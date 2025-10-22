// Blog Fetcher - Dynamically fetch Phasmophobia blog posts
// This eliminates the need to manually update game updates

export interface BlogPost {
  id: string;
  title: string;
  description: string;
  date: number; // Unix timestamp
  url: string;
  category: 'update' | 'announcement' | 'event' | 'news';
  image?: string; // Image URL
}

// Cache management
let blogCache: BlogPost[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

// HTML entity decoder
const decodeHtmlEntities = (text: string): string => {
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&nbsp;': ' ',
  };
  
  let result = text;
  for (const [entity, char] of Object.entries(entities)) {
    result = result.replace(new RegExp(entity, 'g'), char);
  }
  
  // Handle numeric entities like &#123;
  result = result.replace(/&#(\d+);/g, (match, dec) => {
    return String.fromCharCode(parseInt(dec, 10));
  });
  
  // Handle hex entities like &#x1F;
  result = result.replace(/&#x([0-9a-f]+);/gi, (match, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });
  
  return result;
};

const parseDate = (dateStr: string): number => {
  // Convert "DD/MM/YYYY" format to timestamp
  const [day, month, year] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day).getTime();
};

const categorizePost = (title: string): BlogPost['category'] => {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('hotfix') || lowerTitle.includes('patch') || lowerTitle.includes('v0.')) {
    return 'update';
  } else if (lowerTitle.includes('announcing') || lowerTitle.includes('preview') || lowerTitle.includes('development')) {
    return 'announcement';
  } else if (lowerTitle.includes('twitch') || lowerTitle.includes('anniversary') || lowerTitle.includes('event') || lowerTitle.includes('twitchcon')) {
    return 'event';
  }
  return 'news';
};

// Extract links and dates from HTML using a more flexible approach
const extractBlogPostsFromHtml = (html: string): BlogPost[] => {
  const posts: BlogPost[] = [];
  const seenUrls = new Set<string>();

  // The HTML structure is actual HTML, not markdown
  // Look for blog post links and their titles
  // Pattern: <a href="/blog/..." class="..." >...content...</a>
  // OR: <a href="/blog/..."...>Title</a>
  // We need to extract both the href and the title text
  
  // First try: Look for h2 or heading followed by blog link
  // Pattern: <h2>Title</h2> ... <a href="/blog/slug">...</a>
  const headingBlogPattern = /<h2[^>]*>([^<]+)<\/h2>[\s\S]*?<a[^>]*href="(\/blog\/([^"]+))"[^>]*>/g;
  
  let match;
  const links: Array<{title: string; url: string; id: string; index: number}> = [];
  
  while ((match = headingBlogPattern.exec(html)) !== null) {
    links.push({
      title: decodeHtmlEntities(match[1].trim()),
      url: 'https://www.kineticgames.co.uk' + match[2],
      id: match[3],
      index: match.index,
    });
  }

  console.log(`Found ${links.length} blog posts with heading pattern`);

  if (links.length === 0) {
    // Fallback: Look for any blog href and extract nearby text as title
    const simpleBlogPattern = /<a[^>]*href="(\/blog\/([^"]+))"[^>]*>([^<]*)<\/a>/g;
    
    while ((match = simpleBlogPattern.exec(html)) !== null) {
      const url = match[1];
      const id = match[2];
      let title = match[3]?.trim();
      
      // If title is empty or just an image tag, look backwards for a heading
      if (!title || title.includes('<')) {
        const beforeLink = html.substring(Math.max(0, match.index - 500), match.index);
        const headingMatch = beforeLink.match(/<h2[^>]*>([^<]+)<\/h2>[\s\S]*$/);
        if (headingMatch) {
          title = headingMatch[1].trim();
        }
      }
      
      if (title && !title.includes('<')) {
        links.push({
          title: decodeHtmlEntities(title),
          url: 'https://www.kineticgames.co.uk' + url,
          id,
          index: match.index,
        });
      }
    }
    console.log(`Found ${links.length} blog posts with fallback pattern`);
  }

  // Now, for each blog link, search for a nearby date and image
  const dateRegex = /(\d{1,2})\/(\d{1,2})\/(\d{4})/;
  // Look for various image patterns: img tags, background images, data attributes
  const patterns = [
    /<img[^>]*src=['"]([^'"]+)['"][^>]*>/gi,  // img src
    /background-image\s*:\s*url\(['"]?([^'")\s]+)['"]?\)/gi,  // CSS background-image
    /data-src=['"]([^'"]+)['"][^>]*/gi,  // lazy loading data-src
    /srcset=['"]([^'"]+)['"][^>]*/gi,  // srcset attribute
    /style=['"]background-image:[^'"]*(https?:[^'"]+)[^'"]*/gi,  // inline background-image
  ];

  for (const link of links) {
    // Skip if already seen
    if (seenUrls.has(link.url)) continue;

    // Search for date and image in a window around this link
    // Look backwards (before) and forwards (after) for better coverage
    const searchStart = Math.max(0, link.index - 3000);
    const searchEnd = Math.min(html.length, link.index + 1000);
    const searchWindow = html.substring(searchStart, searchEnd);

    console.log(`\n=== Processing post: "${link.title}" ===`);

    const dateMatch = dateRegex.exec(searchWindow);
    
    // Try each pattern until we find images
    let imageMatch = null;
    let lastMatch = null;
    let matchHighRes = null;
    
    for (const pattern of patterns) {
      pattern.lastIndex = 0;
      let match;
      while ((match = pattern.exec(searchWindow)) !== null) {
        let src = match[1];
        // Clean up the URL
        src = src.trim().replace(/^['"]|['"]$/g, '');
        
        // Filter out tracking pixels and other non-image urls
        if (src && !src.includes('tracking') && !src.includes('pixel') && !src.includes('1x1') && !src.includes('data:')) {
          lastMatch = src;
          if (!imageMatch) {
            imageMatch = src;
          }
          
          // Prioritize high-res images: 1200w > 750w > others
          if (src.includes('1200w') || src.includes('1000w') || src.includes('w=1200') || src.includes('w=1000')) {
            matchHighRes = src;
            console.log(`✓ Found high-res image (1200w/1000w): ${src}`);
          } else if (src.includes('750w') || src.includes('w=750')) {
            if (!matchHighRes) {
              matchHighRes = src;
            }
            console.log(`✓ Found 750w image: ${src}`);
          } else {
            console.log(`✓ Found image: ${src}`);
          }
        }
      }
      if (matchHighRes) break; // Stop if we found a high-res image
    }

    // Priority: high-res (1200w/1000w) > 750w > last > first
    if (matchHighRes) {
      imageMatch = matchHighRes;
      console.log(`✓ Using high-res image: ${imageMatch}`);
    } else if (lastMatch) {
      imageMatch = lastMatch;
      console.log(`✓ Using last image: ${imageMatch}`);
    }

    if (!imageMatch) {
      console.log(`✗ No image found`);
    } else {
      console.log(`   Final image URL: ${imageMatch}`);
      
      // Check if the image URL contains multiple sizes (comma-separated)
      if (imageMatch.includes(',')) {
        console.log(`   Multiple image sizes detected`);
        const imageSizes = imageMatch.split(',').map((img: string) => img.trim());
        
        // Look for 750w image first (best balance), then 1200w, then 2500w, then any
        let selectedImage = imageSizes.find((img: string) => img.includes('750w'));
        if (!selectedImage) {
          selectedImage = imageSizes.find((img: string) => img.includes('1200w'));
        }
        if (!selectedImage) {
          selectedImage = imageSizes.find((img: string) => img.includes('2500w'));
        }
        if (!selectedImage) {
          selectedImage = imageSizes[imageSizes.length - 1]; // Use last (usually largest)
        }
        
        imageMatch = selectedImage;
        console.log(`   Selected from multiple: ${imageMatch}`);
      }
    }

    if (dateMatch) {
      try {
        const day = parseInt(dateMatch[1]);
        const month = parseInt(dateMatch[2]);
        const year = parseInt(dateMatch[3]);

        // Validate date
        if (day > 0 && day <= 31 && month > 0 && month <= 12 && year >= 2024 && year <= 2026) {
          const date = new Date(year, month - 1, day).getTime();

          posts.push({
            id: link.id,
            title: link.title,
            description: link.title,
            date,
            url: link.url,
            category: categorizePost(link.title),
            image: imageMatch || undefined,
          });
          seenUrls.add(link.url);
        }
      } catch (e) {
        console.warn(`Failed to parse post "${link.title}"`, e);
      }
    } else {
      console.log(`No date found for: "${link.title}"`);
    }
  }

  console.log(`\n=== EXTRACTION SUMMARY ===`);
  console.log(`Total posts extracted: ${posts.length}`);
  console.log(`Posts with images: ${posts.filter(p => p.image).length}`);
  posts.slice(0, 3).forEach((p, idx) => {
    console.log(`${idx + 1}. "${p.title}": Image=${p.image ? 'YES' : 'NO'}`);
  });
  console.log(`===========================\n`);
  
  return posts;
};

export const fetchBlogPosts = async (): Promise<BlogPost[]> => {
  // Return cached posts if still valid
  const now = Date.now();
  if (blogCache && (now - cacheTimestamp) < CACHE_DURATION) {
    console.log('Returning cached blog posts');
    return blogCache;
  }

  try {
    console.log('Fetching blog posts from Kinetic Games...');
    const response = await fetch('https://www.kineticgames.co.uk/blog');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const html = await response.text();
    console.log(`Received ${html.length} bytes of HTML`);
    
    // Debug: Find a sample img tag to understand the structure
    const imgTagMatch = html.match(/<img[^>]*>/);
    if (imgTagMatch) {
      console.log('Sample img tag:', imgTagMatch[0].substring(0, 300));
    }
    
    // Debug: show a sample of the HTML to see the structure
    const sampleStart = html.indexOf('blog/');
    if (sampleStart > 0) {
      const sampleEnd = sampleStart + 300;
      console.log('HTML sample around first blog link:', html.substring(sampleStart - 50, sampleEnd));
    }

    // Extract blog posts from HTML
    const posts = extractBlogPostsFromHtml(html);
    
    // Sort by date descending (newest first)
    posts.sort((a, b) => b.date - a.date);

    // Cache the results
    blogCache = posts;
    cacheTimestamp = now;

    console.log(`Successfully fetched and cached ${posts.length} blog posts`);
    if (posts.length > 0) {
      console.log('First post:', posts[0]);
    }
    return posts;
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
    
    // Return cached posts if fetch fails
    if (blogCache) {
      console.log('Returning cached posts due to fetch error');
      return blogCache;
    }
    
    return [];
  }
};

export const getRecentBlogPosts = async (limit: number = 10): Promise<BlogPost[]> => {
  const posts = await fetchBlogPosts();
  return posts.slice(0, limit);
};

export const getBlogPostsByCategory = async (category: BlogPost['category']): Promise<BlogPost[]> => {
  const posts = await fetchBlogPosts();
  return posts.filter((post) => post.category === category);
};

export const getLatestBlogPost = async (): Promise<BlogPost | null> => {
  const posts = await fetchBlogPosts();
  return posts.length > 0 ? posts[0] : null;
};

// Debug function to clear cache and force refetch
export const clearBlogCache = (): void => {
  blogCache = null;
  cacheTimestamp = 0;
  console.log('Blog cache cleared');
};
