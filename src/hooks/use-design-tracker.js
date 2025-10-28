import { useEffect, useRef, useCallback } from "react";
import { useDesignTracking } from "@/context/design-tracking-context";

export const useDesignTracker = () => {
  const {
    trackVisualGraphics,
    trackColorInteraction,
    trackActivityNoticeability,
    trackEntryPoint,
    trackFontInteraction,
    trackGestalt,
    trackHierarchy,
    trackPerceptiveAnimation,
    trackTransitionNavigation,
    trackMultipleInteractions,
  } = useDesignTracking();

  const interactionQueue = useRef([]);
  const flushTimeoutRef = useRef(null);

  // Flush interactions to backend
  const flushInteractions = useCallback(() => {
    if (interactionQueue.current.length > 0) {
      trackMultipleInteractions([...interactionQueue.current]);
      interactionQueue.current = [];
    }
  }, [trackMultipleInteractions]);

  // Queue interaction for batch processing
  const queueInteraction = useCallback((factor, action, value = 1) => {
    interactionQueue.current.push({ factor, action, value });
    
    // Clear existing timeout
    if (flushTimeoutRef.current) {
      clearTimeout(flushTimeoutRef.current);
    }
    
    // Set new timeout to flush interactions
    flushTimeoutRef.current = setTimeout(flushInteractions, 2000);
  }, [flushInteractions]);

  // Tracking functions that queue interactions
  const trackClick = useCallback((element) => {
    // Determine which design factors to track based on element
    if (element.classList.contains('btn') || element.tagName === 'BUTTON') {
      queueInteraction('entryPoint', 'button_click');
      queueInteraction('hierarchy', 'button_interaction');
    }
    
    if (element.classList.contains('nav') || element.closest('nav')) {
      queueInteraction('transitionNavigation', 'navigation_click');
    }
    
    if (element.classList.contains('card') || element.closest('.card')) {
      queueInteraction('gestalt', 'card_interaction');
    }
  }, [queueInteraction]);

  const trackHover = useCallback((element) => {
    queueInteraction('activityNoticeability', 'hover_interaction');
    
    if (element.classList.contains('animated') || element.style.transition) {
      queueInteraction('perceptiveAnimation', 'hover_animation');
    }
  }, [queueInteraction]);

  const trackScroll = useCallback(() => {
    queueInteraction('hierarchy', 'scroll_interaction');
    queueInteraction('transitionNavigation', 'scroll_navigation');
  }, [queueInteraction]);

  const trackColorChange = useCallback(() => {
    queueInteraction('color', 'color_preference_change');
  }, [queueInteraction]);

  const trackFontChange = useCallback(() => {
    queueInteraction('font', 'font_preference_change');
  }, [queueInteraction]);

  const trackImageView = useCallback(() => {
    queueInteraction('visualGraphics', 'image_view');
  }, [queueInteraction]);

  const trackModalOpen = useCallback(() => {
    queueInteraction('hierarchy', 'modal_open');
    queueInteraction('gestalt', 'modal_interaction');
  }, [queueInteraction]);

  const trackFormInteraction = useCallback((fieldType) => {
    queueInteraction('entryPoint', 'form_interaction');
    
    if (fieldType === 'color') {
      queueInteraction('color', 'color_input');
    } else if (fieldType === 'select') {
      queueInteraction('hierarchy', 'select_interaction');
    }
  }, [queueInteraction]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (flushTimeoutRef.current) {
        clearTimeout(flushTimeoutRef.current);
        flushInteractions();
      }
    };
  }, [flushInteractions]);

  return {
    trackClick,
    trackHover,
    trackScroll,
    trackColorChange,
    trackFontChange,
    trackImageView,
    trackModalOpen,
    trackFormInteraction,
    flushInteractions,
    trackGestalt,
    trackHierarchy,
    trackPerceptiveAnimation,
    trackTransitionNavigation,
  };
};

// Hook for automatic event tracking
export const useAutoDesignTracking = (ref) => {
  const tracker = useDesignTracker();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleClick = (e) => {
      tracker.trackClick(e.target);
    };

    const handleMouseEnter = (e) => {
      tracker.trackHover(e.target);
    };

    const handleScroll = () => {
      tracker.trackScroll();
    };

    // Add event listeners
    element.addEventListener('click', handleClick);
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('scroll', handleScroll);

    return () => {
      element.removeEventListener('click', handleClick);
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('scroll', handleScroll);
    };
  }, [ref, tracker]);

  return tracker;
};
