import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from "react-i18next";

const Landing: React.FC = () => {
  const { t } = useTranslation();
  const { signInWithGoogle } = useAuth();

  const handleGoogleLogin = async () => {
    const { error } = await signInWithGoogle();
    if (!error) {
      window.location.assign("/");
      return;
    }

    console.error("Google sign-in failed:", error);
    window.alert(t("header.googleLoginFailed"));
  };

  const handleOpenApp = () => {
    try {
      localStorage.setItem("guest-access", "true");
    } catch (error) {
      console.warn("Guest access storage failed:", error);
    }
    window.location.assign("/?guest=1");
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] flex flex-col p-6 relative">
      <div className="flex-1 w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
        {/* LEFT: Content */}
        <div className="flex flex-col items-start gap-6 md:gap-5">
          <div className="space-y-3">
            <h1 className="text-tv-title text-foreground">
              {t("app.title")}
            </h1>
            <p className="text-tv-body text-muted-foreground max-w-md">
              {t("app.subtitle")}
            </p>
          </div>
          <div className="flex flex-col items-start gap-4 w-full max-w-sm">
            <Button
              size="lg"
              onClick={handleOpenApp}
              className="w-full touch-target text-tv-body font-medium px-8 md:px-12 py-6 md:py-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {t("actions.openApp")}
            </Button>
            <Button
              size="sm"
              onClick={handleGoogleLogin}
              className="w-full touch-target text-tv-small font-medium px-6 md:px-10 py-4 md:py-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 bg-primary text-primary-foreground"
            >
              {t("actions.loginGoogle")}
            </Button>
          </div>
        </div>

        {/* RIGHT: Hero */}
        <div className="flex justify-center md:justify-end">
          <img
            src="/bmihero.png"
            alt={t("landing.heroAlt")}
            className="w-full max-w-md md:max-w-sm lg:max-w-md h-auto max-h-[80vh] object-contain"
          />
        </div>
      </div>

      {/* Mobile order tweak */}
      <div className="md:hidden order-3 mt-6 flex justify-center">
        <img
          src="/bmihero.png"
          alt={t("landing.heroAlt")}
          className="w-full max-w-xs h-auto max-h-[40vh] object-contain"
        />
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-6 inset-x-0 flex justify-center">
        <p className="text-xs text-muted-foreground tracking-[0.2em]">
          {t("app.footerBranding")}
        </p>
      </div>
    </div>
  );
};

export default Landing;
