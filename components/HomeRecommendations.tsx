"use client";

import { useEffect, useState } from "react";

import RecommendationSection from "@/components/RecommendationSection";
import { getRecentlyViewedRecommendations } from "@/lib/recommendations";

export default function HomeRecommendations() {
  const [hasRecentlyViewed, setHasRecentlyViewed] = useState(false);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const recentlyViewed = getRecentlyViewedRecommendations(6);

      setHasRecentlyViewed(recentlyViewed.length > 0);
      setLoaded(true);
    }, 0);

    const refreshRecentlyViewed = () => {
      const recentlyViewed = getRecentlyViewedRecommendations(6);

      setHasRecentlyViewed(recentlyViewed.length > 0);
    };

    window.addEventListener("shopsphere-sync", refreshRecentlyViewed);

    return () => {
      clearTimeout(timer);

      window.removeEventListener("shopsphere-sync", refreshRecentlyViewed);
    };
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <RecommendationSection
        strategy="trending"
        title="Trending Now"
        description="Discover products shoppers are loving right now."
        limit={4}
      />

      <RecommendationSection
        strategy="personalized"
        title="Recommended For You"
        description="AI-powered picks based on your shopping activity."
        limit={4}
      />

      {hasRecentlyViewed && (
        <RecommendationSection
          strategy="recently-viewed"
          title="Recently Viewed"
          description="Continue exploring products you've recently viewed."
          limit={4}
        />
      )}
    </>
  );
}
