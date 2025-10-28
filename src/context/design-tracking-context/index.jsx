import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "../auth-context";
import {
  getUserDesignTrackingService,
  updateDesignFactorService,
  updateUserPreferencesService,
  trackUserInteractionService,
  getDesignAnalyticsService,
} from "@/services";

export const DesignTrackingContext = createContext(null);

const defaultPreferences = {
  preferredColors: ["#3b82f6", "#10b981", "#8b5cf6"],
  preferredFonts: ["Inter", "Roboto", "Poppins"],
  preferredAnimationSpeed: "normal",
  preferredLayoutStyle: "modern",
};

export default function DesignTrackingProvider({ children }) {
  const { auth } = useContext(AuthContext);
  const [designTracking, setDesignTracking] = useState(null);
  const [userPreferences, setUserPreferences] = useState(defaultPreferences);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user design tracking data
  const fetchDesignTracking = useCallback(async () => {
    if (!auth?.user?._id) return;

    try {
      setIsLoading(true);
      const response = await getUserDesignTrackingService(auth.user._id);
      if (response.success) {
        setDesignTracking(response.data);
        setUserPreferences(response.data.preferences || defaultPreferences);
      }
    } catch (error) {
      console.error("Error fetching design tracking:", error);
    } finally {
      setIsLoading(false);
    }
  }, [auth?.user?._id]);

  // Track a single design factor
  const trackDesignFactor = useCallback(async (factor, value = 1, action = "interaction") => {
    if (!auth?.user?._id) return;

    try {
      const response = await updateDesignFactorService(auth.user._id, {
        factor,
        value,
        action,
        sessionId,
      });

      if (response.success) {
        setDesignTracking(response.data);
      }
    } catch (error) {
      console.error("Error tracking design factor:", error);
    }
  }, [auth?.user?._id, sessionId]);

  // Track multiple interactions at once
  const trackMultipleInteractions = useCallback(async (interactions) => {
    if (!auth?.user?._id || !interactions.length) return;

    try {
      const formattedInteractions = interactions.map(interaction => ({
        ...interaction,
        sessionId,
      }));

      const response = await trackUserInteractionService(auth.user._id, formattedInteractions);
      
      if (response.success) {
        setDesignTracking(response.data);
      }
    } catch (error) {
      console.error("Error tracking interactions:", error);
    }
  }, [auth?.user?._id, sessionId]);

  // Update user preferences
  const updatePreferences = useCallback(async (newPreferences) => {
    if (!auth?.user?._id) return;

    try {
      const updatedPreferences = { ...userPreferences, ...newPreferences };
      const response = await updateUserPreferencesService(auth.user._id, updatedPreferences);
      
      if (response.success) {
        setUserPreferences(updatedPreferences);
        setDesignTracking(response.data);
      }
    } catch (error) {
      console.error("Error updating preferences:", error);
    }
  }, [auth?.user?._id, userPreferences]);

  // Get analytics data
  const getAnalytics = useCallback(async (timeframe = "all") => {
    if (!auth?.user?._id) return null;

    try {
      const response = await getDesignAnalyticsService(auth.user._id, timeframe);
      return response.success ? response.data : null;
    } catch (error) {
      console.error("Error fetching analytics:", error);
      return null;
    }
  }, [auth?.user?._id]);

  // Convenience functions for tracking specific design factors
  const trackColorInteraction = useCallback((value = 1) => {
    trackDesignFactor("color", value, "color_interaction");
  }, [trackDesignFactor]);

  const trackFontInteraction = useCallback((value = 1) => {
    trackDesignFactor("font", value, "font_interaction");
  }, [trackDesignFactor]);

  const trackVisualGraphics = useCallback((value = 1) => {
    trackDesignFactor("visualGraphics", value, "visual_interaction");
  }, [trackDesignFactor]);

  const trackActivityNoticeability = useCallback((value = 1) => {
    trackDesignFactor("activityNoticeability", value, "activity_interaction");
  }, [trackDesignFactor]);

  const trackEntryPoint = useCallback((value = 1) => {
    trackDesignFactor("entryPoint", value, "entry_interaction");
  }, [trackDesignFactor]);

  const trackGestalt = useCallback((value = 1) => {
    trackDesignFactor("gestalt", value, "gestalt_interaction");
  }, [trackDesignFactor]);

  const trackHierarchy = useCallback((value = 1) => {
    trackDesignFactor("hierarchy", value, "hierarchy_interaction");
  }, [trackDesignFactor]);

  const trackPerceptiveAnimation = useCallback((value = 1) => {
    trackDesignFactor("perceptiveAnimation", value, "animation_interaction");
  }, [trackDesignFactor]);

  const trackTransitionNavigation = useCallback((value = 1) => {
    trackDesignFactor("transitionNavigation", value, "navigation_interaction");
  }, [trackDesignFactor]);

  // Initialize design tracking when user is authenticated
  useEffect(() => {
    if (auth?.authenticate && auth?.user?._id) {
      fetchDesignTracking();
    }
  }, [auth?.authenticate, auth?.user?._id, fetchDesignTracking]);

  const contextValue = {
    designTracking,
    userPreferences,
    sessionId,
    isLoading,
    
    // Core functions
    trackDesignFactor,
    trackMultipleInteractions,
    updatePreferences,
    getAnalytics,
    fetchDesignTracking,
    
    // Specific tracking functions
    trackColorInteraction,
    trackFontInteraction,
    trackVisualGraphics,
    trackActivityNoticeability,
    trackEntryPoint,
    trackGestalt,
    trackHierarchy,
    trackPerceptiveAnimation,
    trackTransitionNavigation,
  };

  return (
    <DesignTrackingContext.Provider value={contextValue}>
      {children}
    </DesignTrackingContext.Provider>
  );
}

// Custom hook for using design tracking context
export const useDesignTracking = () => {
  const context = useContext(DesignTrackingContext);
  if (!context) {
    throw new Error("useDesignTracking must be used within a DesignTrackingProvider");
  }
  return context;
};
