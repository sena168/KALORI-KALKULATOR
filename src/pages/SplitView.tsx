import React from "react";
import Header from "@/components/Header";
import { CalculatorContent } from "@/pages/Calculator";
import { HealthMetricsEmbedded } from "@/pages/HealthMetrics";
import { useTranslation } from "react-i18next";

const SplitView: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 md:pt-28 lg:pt-32 pb-6 px-2">
        <div className="w-full max-w-none">
          <div className="hidden xl:grid xl:grid-cols-2 gap-4 h-[calc(100vh-10rem)]">
            <div className="bg-card border border-border rounded-2xl shadow-md overflow-hidden flex flex-col">
              <CalculatorContent embedded />
            </div>
            <div className="bg-card border border-border rounded-2xl shadow-md overflow-hidden flex flex-col">
              <HealthMetricsEmbedded />
            </div>
          </div>
          <div className="xl:hidden bg-card border border-border rounded-2xl p-6 text-center">
            <p className="text-tv-body text-muted-foreground">
              {t("splitView.noticeTitle")}
            </p>
            <p className="text-tv-small text-muted-foreground mt-2">
              {t("splitView.noticeBody")}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SplitView;
