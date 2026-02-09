import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Landing from './Landing';
import Calculator from './Calculator';
import { useTranslation } from "react-i18next";

const Index: React.FC = () => {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const [forceReady, setForceReady] = useState(false);
  const hasGuestAccess =
    typeof window !== "undefined" &&
    (localStorage.getItem("guest-access") === "true" ||
      new URLSearchParams(window.location.search).get("guest") === "1");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setForceReady(true);
    }, 4000);
    return () => clearTimeout(timeoutId);
  }, []);

  // Show loading state
  if (loading && !forceReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <img
            src="/bmicalico1.png"
            alt={t("loading.index")}
            className="w-20 h-20 mx-auto animate-pulse mb-4 object-contain"
          />
          <p className="text-muted-foreground text-tv-body">{t("loading.index")}</p>
        </div>
      </div>
    );
  }

  // Show landing page if not authenticated and no guest access
  if (!user && !hasGuestAccess) {
    return <Landing />;
  }

  // Show calculator if authenticated or guest access granted
  return <Calculator />;
};

export default Index;
