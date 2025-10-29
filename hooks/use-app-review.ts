/**
 * useAppReview Hook
 * Manages review modal state and timing logic
 */

import { appReviewService } from '@/lib/services/appReviewService';
import { useState } from 'react';

export const useAppReview = () => {
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);

  /**
   * Check if we should show the review prompt and display it
   */
  const checkAndShowReview = async () => {
    try {
      const shouldShow = await appReviewService.shouldShowReviewPrompt();
      if (shouldShow) {
        setIsReviewModalVisible(true);
      }
    } catch (error) {
      console.error('[useAppReview] Error checking review eligibility:', error);
    }
  };

  /**
   * Record an interaction and optionally check for review prompt
   */
  const recordInteractionAndCheckReview = async (checkReview = false) => {
    try {
      await appReviewService.recordAppInteraction();
      if (checkReview) {
        await checkAndShowReview();
      }
    } catch (error) {
      console.error('[useAppReview] Error recording interaction:', error);
    }
  };

  /**
   * Close the review modal
   */
  const closeReviewModal = () => {
    setIsReviewModalVisible(false);
  };

  return {
    isReviewModalVisible,
    closeReviewModal,
    checkAndShowReview,
    recordInteractionAndCheckReview,
  };
};
