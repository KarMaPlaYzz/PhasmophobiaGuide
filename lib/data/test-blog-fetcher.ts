// Quick test to verify blog fetcher is working
// Run this in the terminal: npx ts-node lib/data/blog-fetcher.ts

import { fetchBlogPosts } from './blog-fetcher';

console.log('Testing blog fetcher...');

fetchBlogPosts().then((posts) => {
  console.log(`\n✅ Fetched ${posts.length} posts\n`);
  posts.slice(0, 5).forEach((post) => {
    console.log(`- ${post.title}`);
    console.log(`  Date: ${new Date(post.date).toLocaleDateString()}`);
    console.log(`  Category: ${post.category}`);
    console.log(`  URL: ${post.url}\n`);
  });
}).catch((error) => {
  console.error('❌ Error:', error);
});
