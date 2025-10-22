import { fetchBlogPosts } from '@/lib/data/blog-fetcher';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

// Storage keys
const LAST_POSTS_KEY = 'blog_notifications_last_posts';
const NOTIFICATION_CHECK_INTERVAL = 30 * 60 * 1000; // 30 minutes

interface StoredPost {
  id: string;
  title: string;
  date: number;
}

/**
 * Initialize blog notification service
 * Call this once when the app starts
 */
export const initializeBlogNotifications = async () => {
  try {
    // Request notification permissions
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.log('Blog notifications permission not granted');
      return;
    }

    console.log('Blog notifications initialized');
    
    // Check immediately on startup
    await checkForNewBlogPosts();
    
    // Set up periodic checks
    const interval = setInterval(checkForNewBlogPosts, NOTIFICATION_CHECK_INTERVAL);
    
    // Store interval ID for cleanup if needed
    (global as any).blogNotificationInterval = interval;
  } catch (error) {
    console.error('Failed to initialize blog notifications:', error);
  }
};

/**
 * Check for new blog posts and send notifications
 */
export const checkForNewBlogPosts = async () => {
  try {
    console.log('Checking for new blog posts...');

    // Fetch latest blog posts
    const posts = await fetchBlogPosts();
    
    if (posts.length === 0) {
      console.log('No blog posts found');
      return;
    }

    // Get previously stored posts
    const storedPostsJson = await AsyncStorage.getItem(LAST_POSTS_KEY);
    const storedPosts: StoredPost[] = storedPostsJson ? JSON.parse(storedPostsJson) : [];
    
    const storedPostIds = new Set(storedPosts.map(p => p.id));

    // Find new posts
    const newPosts = posts.filter(post => !storedPostIds.has(post.id));

    if (newPosts.length > 0) {
      console.log(`Found ${newPosts.length} new blog post(s)`);
      
      // Send notification for each new post
      for (const post of newPosts) {
        await sendBlogNotification(post.title, post.date);
      }
    } else {
      console.log('No new blog posts');
    }

    // Update stored posts with current posts (keep last 50)
    const postsToStore: StoredPost[] = posts.slice(0, 50).map(p => ({
      id: p.id,
      title: p.title,
      date: p.date,
    }));
    
    await AsyncStorage.setItem(LAST_POSTS_KEY, JSON.stringify(postsToStore));
    console.log(`Stored ${postsToStore.length} posts for comparison`);
  } catch (error) {
    console.error('Error checking for new blog posts:', error);
  }
};

/**
 * Send a notification for a new blog post
 */
const sendBlogNotification = async (postTitle: string, postDate: number) => {
  try {
    const dateStr = new Date(postDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'New blog post',
        body: postTitle,
        subtitle: dateStr,
        data: {
          type: 'blog_post',
          title: postTitle,
        },
      },
      trigger: null, // Send immediately
    });

    console.log(`Notification sent for: ${postTitle}`);
  } catch (error) {
    console.error('Failed to send notification:', error);
  }
};

/**
 * Clean up blog notification service
 */
export const cleanupBlogNotifications = () => {
  if ((global as any).blogNotificationInterval) {
    clearInterval((global as any).blogNotificationInterval);
    console.log('Blog notification interval cleared');
  }
};

/**
 * Clear stored blog post history (for testing)
 */
export const clearBlogNotificationHistory = async () => {
  try {
    await AsyncStorage.removeItem(LAST_POSTS_KEY);
    console.log('Blog notification history cleared');
  } catch (error) {
    console.error('Failed to clear blog notification history:', error);
  }
};
