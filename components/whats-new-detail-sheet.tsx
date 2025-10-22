import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useMemo, useState } from 'react';
import { Image, Linking, Pressable, StyleSheet, View } from 'react-native';

import { ImageCarouselModal } from '@/components/image-carousel-modal';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { BlogPost, clearBlogCache, getRecentBlogPosts } from '@/lib/data/blog-fetcher';
import {
    Feature,
    FeatureRelease,
    formatReleaseDate,
    getCountdownLabel,
    getDaysUntilRelease,
    getPhasmophobiaUpdates,
    getStatusLabel,
    TBA_DATE,
} from '@/lib/data/whats-new';

interface WhatsNewDetailSheetProps {
  isVisible: boolean;
  onClose: () => void;
  releases: FeatureRelease[];
  upcomingFeatures: Feature[];
}

export const WhatsNewDetailSheet = ({
  isVisible,
  onClose,
  releases,
  upcomingFeatures,
}: WhatsNewDetailSheetProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const snapPoints = useMemo(() => ['65%', '100%'], []);
  const [selectedTab, setSelectedTab] = useState<'latest' | 'upcoming' | 'game' | 'blog'>('latest');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [imageCarouselVisible, setImageCarouselVisible] = useState(false);
  const [carouselImages, setCarouselImages] = useState<string[]>([]);
  const [carouselTitle, setCarouselTitle] = useState('');
  const [countdownUpdate, setCountdownUpdate] = useState(0);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [blogLoading, setBlogLoading] = useState(true);
  const [blogError, setBlogError] = useState<string | null>(null);

  // Fetch blog posts function
  const loadBlogPosts = async () => {
    setBlogLoading(true);
    setBlogError(null);
    try {
      const posts = await getRecentBlogPosts(10);
      console.log(`Loaded ${posts.length} blog posts`);
      posts.forEach((post, idx) => {
        console.log(`Post ${idx}: "${post.title}" - Image: ${post.image ? `✓ ${post.image.substring(0, 60)}...` : '✗ undefined'}`);
      });
      setBlogPosts(posts);
      if (posts.length === 0) {
        setBlogError('No blog posts found');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error('Failed to load blog posts:', errorMsg);
      setBlogError(`Failed to load: ${errorMsg}`);
    } finally {
      setBlogLoading(false);
    }
  };

  // Update countdown every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdownUpdate((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch blog posts when component mounts
  useEffect(() => {
    clearBlogCache();
    loadBlogPosts();
  }, []);

  const latestRelease = releases[0];

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const openImageCarousel = (images: string[], title: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCarouselImages(images);
    setCarouselTitle(title);
    setImageCarouselVisible(true);
  };

  const getCategoryColor = (category: Feature['category']): string => {
    switch (category) {
      case 'feature':
        return colors.spectral;
      case 'improvement':
        return colors.paranormal;
      case 'bugfix':
        return '#FFB84D';
      case 'balance':
        return colors.haunted;
      case 'content':
        return '#4CAF50';
      default:
        return colors.text;
    }
  };

  const getCategoryIcon = (category: Feature['category']): string => {
    switch (category) {
      case 'feature':
        return 'star';
      case 'improvement':
        return 'flash';
      case 'bugfix':
        return 'bug';
      case 'balance':
        return 'balance';
      case 'content':
        return 'add-circle';
      default:
        return 'help-circle';
    }
  };

  const getPriorityColor = (priority?: Feature['priority']): string => {
    switch (priority) {
      case 'high':
        return '#FF5252';
      case 'medium':
        return '#FFB84D';
      case 'low':
        return '#4CAF50';
      default:
        return colors.text;
    }
  };

  const renderFeatureItem = (feature: Feature, index: number) => {
    const isExpanded = expandedSections[feature.id];
    const daysUntil = getDaysUntilRelease(feature.releaseDate);
    const isComingSoon = daysUntil > 0 && daysUntil <= 7;

    return (
      <Pressable
        key={feature.id}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          toggleSection(feature.id);
        }}
        style={[
          styles.featureCard,
          {
            backgroundColor: colors.surface,
            borderColor: getCategoryColor(feature.category) + '30',
            borderWidth: 1,
          },
        ]}
      >
        {/* Header Row */}
        <View style={styles.featureHeader}>
          <View style={styles.featureHeaderLeft}>
            <View
              style={[
                styles.categoryIcon,
                { backgroundColor: getCategoryColor(feature.category) + '20' },
              ]}
            >
              <Ionicons
                name={getCategoryIcon(feature.category) as any}
                size={16}
                color={getCategoryColor(feature.category)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText style={styles.featureTitle}>{feature.title}</ThemedText>
              <View style={styles.featureMeta}>
                {feature.releaseDate !== TBA_DATE && (
                  <ThemedText style={styles.featureDate}>
                    {formatReleaseDate(feature.releaseDate)}
                  </ThemedText>
                )}
                {isComingSoon && (
                  <View style={[styles.badge, { backgroundColor: '#FFB84D' }]}>
                    <ThemedText style={styles.badgeText}>SOON</ThemedText>
                  </View>
                )}
                {feature.priority && (
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: getPriorityColor(feature.priority) },
                    ]}
                  >
                    <ThemedText style={styles.badgeText}>
                      {feature.priority.toUpperCase()}
                    </ThemedText>
                  </View>
                )}
              </View>
            </View>
          </View>

          <Ionicons
            name={isExpanded ? 'chevron-down' : 'chevron-forward'}
            size={20}
            color={colors.spectral}
            style={{ marginTop: 4 }}
          />
        </View>

        {/* Status Badge - Only show when no known date */}
        {feature.releaseDate === TBA_DATE && (
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    feature.status === 'released'
                      ? '#4CAF50'
                      : feature.status === 'announced'
                      ? colors.spectral
                      : colors.paranormal,
                },
              ]}
            >
              <Ionicons
                name={
                  feature.status === 'released'
                    ? 'checkmark-circle'
                    : feature.status === 'announced'
                    ? 'star'
                    : 'time'
                }
                size={12}
                color="#fff"
              />
              <ThemedText style={[styles.statusText, { marginLeft: 4 }]}>
                {getStatusLabel(feature.status, feature.releaseDate)}
              </ThemedText>
            </View>
          </View>
        )}

        {/* Countdown Timer - Show when date is known */}
        {feature.releaseDate !== TBA_DATE && feature.status !== 'released' && (
          <View style={styles.countdownRow}>
            <ThemedText style={styles.countdownText}>
              {/* countdownUpdate dependency ensures re-renders every second */}
              {countdownUpdate && getCountdownLabel(feature.releaseDate) || getCountdownLabel(feature.releaseDate)}
            </ThemedText>
          </View>
        )}

        {/* Description - Always Visible */}
        <ThemedText style={styles.featureDescription}>{feature.description}</ThemedText>

        {/* Expandable Details */}
        {isExpanded && (
          <View style={styles.expandedContent}>
            {feature.details && (
              <View>
                <ThemedText style={styles.detailsLabel}>Details</ThemedText>
                <ThemedText style={styles.detailsText}>{feature.details}</ThemedText>
              </View>
            )}

            {feature.images && feature.images.length > 0 && (
              <View>
                <ThemedText style={styles.detailsLabel}>Images ({feature.images.length})</ThemedText>
                <Pressable
                  onPress={() => openImageCarousel(feature.images!, feature.title)}
                  style={[
                    styles.imageGalleryButton,
                    { backgroundColor: getCategoryColor(feature.category) + '15' },
                  ]}
                >
                  <Ionicons
                    name="image"
                    size={18}
                    color={getCategoryColor(feature.category)}
                  />
                  <ThemedText
                    style={[
                      styles.imageGalleryButtonText,
                      { color: getCategoryColor(feature.category) },
                    ]}
                  >
                    View Gallery ({feature.images.length} {feature.images.length === 1 ? 'image' : 'images'})
                  </ThemedText>
                  <Ionicons
                    name="arrow-forward"
                    size={16}
                    color={getCategoryColor(feature.category)}
                  />
                </Pressable>
              </View>
            )}

            {feature.tags && feature.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                <ThemedText style={styles.detailsLabel}>Tags</ThemedText>
                <View style={styles.tags}>
                  {feature.tags.map((tag, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.tag,
                        { backgroundColor: getCategoryColor(feature.category) + '20' },
                      ]}
                    >
                      <ThemedText
                        style={[
                          styles.tagText,
                          { color: getCategoryColor(feature.category) },
                        ]}
                      >
                        {tag}
                      </ThemedText>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <BottomSheet
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      onClose={onClose}
      index={isVisible ? 0 : -1}
      animateOnMount={true}
      style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' }}
      backgroundComponent={() => (
        <BlurView intensity={94} style={StyleSheet.absoluteFillObject} />
      )}
      handleIndicatorStyle={{ backgroundColor: colors.spectral }}
    >
      <BottomSheetScrollView
        style={{ flex: 1, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <ThemedText style={styles.headerTitle}>What's New</ThemedText>
            <ThemedText style={styles.headerSubtitle}>
              Upcoming features & recent updates
            </ThemedText>
          </View>
          <Ionicons name="sparkles" size={28} color={colors.spectral} />
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelectedTab('latest');
            }}
            style={[
              styles.tab,
              {
                borderBottomColor:
                  selectedTab === 'latest' ? colors.spectral : 'transparent',
                borderBottomWidth: 2,
              },
            ]}
          >
            <ThemedText
              style={[
                styles.tabLabel,
                {
                  fontWeight: selectedTab === 'latest' ? '700' : '500',
                  color: selectedTab === 'latest' ? colors.spectral : colors.text,
                },
              ]}
            >
              Latest Release
            </ThemedText>
          </Pressable>

          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelectedTab('upcoming');
            }}
            style={[
              styles.tab,
              {
                borderBottomColor:
                  selectedTab === 'upcoming' ? colors.haunted : 'transparent',
                borderBottomWidth: 2,
              },
            ]}
          >
            <ThemedText
              style={[
                styles.tabLabel,
                {
                  fontWeight: selectedTab === 'upcoming' ? '700' : '500',
                  color: selectedTab === 'upcoming' ? colors.haunted : colors.text,
                },
              ]}
            >
              Coming Soon
            </ThemedText>
          </Pressable>

          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelectedTab('game');
            }}
            style={[
              styles.tab,
              {
                borderBottomColor:
                  selectedTab === 'game' ? colors.paranormal : 'transparent',
                borderBottomWidth: 2,
                display: 'none',
              },
            ]}
          >
            <ThemedText
              style={[
                styles.tabLabel,
                {
                  fontWeight: selectedTab === 'game' ? '700' : '500',
                  color: selectedTab === 'game' ? colors.paranormal : colors.text,
                },
              ]}
            >
              Phasmophobia
            </ThemedText>
          </Pressable>

          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelectedTab('blog');
            }}
            style={[
              styles.tab,
              {
                borderBottomColor:
                  selectedTab === 'blog' ? colors.haunted : 'transparent',
                borderBottomWidth: 2,
              },
            ]}
          >
            <ThemedText
              style={[
                styles.tabLabel,
                {
                  fontWeight: selectedTab === 'blog' ? '700' : '500',
                  color: selectedTab === 'blog' ? colors.haunted : colors.text,
                },
              ]}
            >
              Blog
            </ThemedText>
          </Pressable>
        </View>

        {/* Content */}
        {selectedTab === 'latest' && latestRelease ? (
          <View style={styles.content}>
            {/* Release Header */}
            <View
              style={[
                styles.releaseHeader,
                { backgroundColor: colors.spectral + '10', borderColor: colors.spectral },
              ]}
            >
              <View>
                <ThemedText style={styles.releaseVersion}>{latestRelease.version}</ThemedText>
                <ThemedText style={styles.releaseTitle}>{latestRelease.title}</ThemedText>
              </View>
              <Ionicons name="checkmark-circle" size={24} color={colors.spectral} />
            </View>

            <ThemedText style={styles.releaseDescription}>{latestRelease.description}</ThemedText>

            {/* Highlights */}
            {latestRelease.highlights && latestRelease.highlights.length > 0 && (
              <View style={styles.highlightsSection}>
                <ThemedText style={styles.sectionTitle}>Highlights</ThemedText>
                {latestRelease.highlights.map((highlight, idx) => (
                  <View key={idx} style={styles.highlightItem}>
                    <View
                      style={[
                        styles.highlightDot,
                        { backgroundColor: colors.spectral },
                      ]}
                    />
                    <ThemedText style={styles.highlightText}>{highlight}</ThemedText>
                  </View>
                ))}
              </View>
            )}

            {/* Features in this release */}
            <ThemedText style={styles.sectionTitle}>Features Included</ThemedText>
            <View>
              {latestRelease.features.map((feature, idx) =>
                renderFeatureItem(feature, idx)
              )}
            </View>
          </View>
        ) : null}

        {selectedTab === 'upcoming' && (
          <View style={styles.content}>
            {upcomingFeatures.length > 0 ? (
              <>
                <ThemedText style={styles.sectionSubtitle}>
                  Get a sneak peek at what's coming to Phasmophobia Guide
                </ThemedText>
                {upcomingFeatures.map((feature, idx) => renderFeatureItem(feature, idx))}
              </>
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="hourglass" size={40} color={colors.text} />
                <ThemedText style={styles.emptyStateText}>
                  No upcoming features announced yet
                </ThemedText>
              </View>
            )}
          </View>
        )}

        {selectedTab === 'game' && (
          <View style={[styles.content, { display: 'none' }]}>
            {getPhasmophobiaUpdates().length > 0 ? (
              <>
                <ThemedText style={styles.sectionSubtitle}>
                  Latest Phasmophobia game updates and new features
                </ThemedText>
                {getPhasmophobiaUpdates().map((feature, idx) => renderFeatureItem(feature, idx))}
              </>
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="game-controller-outline" size={40} color={colors.text} />
                <ThemedText style={styles.emptyStateText}>
                  No game updates available
                </ThemedText>
              </View>
            )}
          </View>
        )}

        {selectedTab === 'blog' && (
          <View style={styles.content}>
            {blogLoading ? (
              <View style={styles.emptyState}>
                <Ionicons 
                  name="refresh" 
                  size={40} 
                  color={colors.spectral}
                  style={{ opacity: 0.6 }}
                />
                <ThemedText style={styles.emptyStateText}>
                  Loading blog posts...
                </ThemedText>
              </View>
            ) : blogError ? (
              <View style={styles.emptyState}>
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    loadBlogPosts();
                  }}
                  style={({ pressed }) => [
                    styles.refreshButton,
                    { opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  <Ionicons 
                    name="refresh" 
                    size={40} 
                    color={colors.haunted}
                  />
                </Pressable>
                <ThemedText style={styles.emptyStateText}>
                  {blogError}
                </ThemedText>
                <ThemedText style={[styles.emptyStateText, { fontSize: 11, marginTop: 4 }]}>
                  Tap to retry
                </ThemedText>
              </View>
            ) : blogPosts.length > 0 ? (
              <>
                <ThemedText style={styles.sectionSubtitle}>
                  Latest blog posts from Kinetic Games
                </ThemedText>
                {blogPosts.map((post, idx) => (
                  <Pressable
                    key={post.id}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      Linking.openURL(post.url);
                    }}
                    style={[
                      styles.blogPostCard,
                      {
                        backgroundColor:
                          post.category === 'update'
                            ? colors.difficulty.intermediate + '15'
                            : post.category === 'announcement'
                            ? colors.paranormal + '15'
                            : post.category === 'event'
                            ? colors.haunted + '15'
                            : colors.spectral + '15',
                        borderColor:
                          post.category === 'update'
                            ? colors.difficulty.intermediate
                            : post.category === 'announcement'
                            ? colors.paranormal
                            : post.category === 'event'
                            ? colors.haunted
                            : colors.spectral,
                      },
                    ]}
                  >
                    {post.image && (
                      <Image
                        source={{ uri: post.image }}
                        style={styles.blogPostImage}
                        resizeMode="cover"
                      />
                    )}
                    <View style={styles.blogPostHeader}>
                      <View style={{ flex: 1 }}>
                        <ThemedText style={styles.blogPostTitle}>
                          {post.title}
                        </ThemedText>
                        <ThemedText style={styles.blogPostDate}>
                          {new Date(post.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </ThemedText>
                      </View>
                      <View
                        style={[
                          styles.blogCategoryBadge,
                          {
                            backgroundColor:
                              post.category === 'update'
                                ? colors.difficulty.intermediate
                                : post.category === 'announcement'
                                ? colors.paranormal
                                : post.category === 'event'
                                ? colors.haunted
                                : colors.spectral,
                          },
                        ]}
                      >
                        <ThemedText style={styles.blogCategoryText}>
                          {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                        </ThemedText>
                      </View>
                    </View>
                    <View style={styles.blogPostFooter}>
                      <ThemedText style={styles.readMoreText}>
                        Read on blog →
                      </ThemedText>
                    </View>
                  </Pressable>
                ))}
              </>
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="document-outline" size={40} color={colors.text} />
                <ThemedText style={styles.emptyStateText}>
                  No blog posts found
                </ThemedText>
              </View>
            )}
          </View>
        )}

        <View style={{ height: 20 }} />
      </BottomSheetScrollView>

      {/* Image Carousel Modal */}
      <ImageCarouselModal
        isVisible={imageCarouselVisible}
        images={carouselImages}
        title={carouselTitle}
        onClose={() => setImageCarouselVisible(false)}
      />
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    marginTop: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 12,
    opacity: 0.6,
  },

  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    marginBottom: 16,
    marginHorizontal: -16,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tab: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  tabLabel: {
    fontSize: 13,
  },

  content: {
    marginBottom: 12,
  },

  releaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  releaseVersion: {
    fontSize: 12,
    fontWeight: '700',
    opacity: 0.7,
    marginBottom: 4,
  },
  releaseTitle: {
    fontSize: 16,
    fontWeight: '600',
  },

  releaseDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
    opacity: 0.85,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 13,
    opacity: 0.7,
    marginBottom: 16,
  },

  highlightsSection: {
    marginBottom: 16,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  highlightDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
    flexShrink: 0,
  },
  highlightText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
  },

  featureCard: {
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  featureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  featureHeaderLeft: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureMeta: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  featureDate: {
    fontSize: 11,
    opacity: 0.6,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
  },

  statusRow: {
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },

  countdownRow: {
    marginBottom: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  countdownText: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.7,
  },

  featureDescription: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
    opacity: 0.85,
  },

  expandedContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.08)',
    gap: 12,
  },
  detailsLabel: {
    fontSize: 11,
    fontWeight: '700',
    opacity: 0.6,
    marginBottom: 6,
  },
  detailsText: {
    fontSize: 12,
    lineHeight: 16,
    opacity: 0.8,
  },

  tagsContainer: {
    marginTop: 4,
  },
  tags: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '600',
  },

  imageGalleryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  imageGalleryButtonText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyStateText: {
    fontSize: 13,
    opacity: 0.6,
  },

  refreshButton: {
    padding: 12,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  blogPostCard: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 0,
    marginBottom: 12,
    overflow: 'hidden',
  },
  blogPostImage: {
    width: '100%',
    height: 180,
  },
  blogPostHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
    padding: 12,
    paddingBottom: 0,
  },
  blogPostTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  blogPostDate: {
    fontSize: 11,
    opacity: 0.6,
  },
  blogCategoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  blogCategoryText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  blogPostFooter: {
    borderTopWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 8,
  },
  readMoreText: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.7,
  },
});
