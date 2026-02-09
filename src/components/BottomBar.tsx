import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCalories } from '@/contexts/CalorieContext';
import { useTranslation } from "react-i18next";

interface BottomBarProps {
  embedded?: boolean;
}

const BottomBar: React.FC<BottomBarProps> = ({ embedded = false }) => {
  const { t, i18n } = useTranslation();
  const { totalCalories, clearAll } = useCalories();

  const locale = i18n.language === "id" ? "id-ID" : i18n.language;
  const formattedCalories = new Intl.NumberFormat(locale).format(totalCalories);

  return (
    <footer
      className={
        embedded
          ? "bg-card border-t border-border"
          : "fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border"
      }
    >
      <div className={`${embedded ? "px-4" : "container mx-auto px-4"} h-20 md:h-24 lg:h-28 flex items-center justify-between`}>
        {/* Total Calories Display */}
        <div className="flex flex-col">
          <span className="text-tv-small text-muted-foreground">{t("menu.totalCalories")}</span>
          <span className="text-tv-title text-primary font-bold">
            {formattedCalories}
            <span className="text-tv-body text-muted-foreground ml-2">{t("units.kcal")}</span>
          </span>
        </div>

        {/* Clear All Button */}
        <Button
          variant="destructive"
          size="lg"
          onClick={clearAll}
          className="touch-target text-tv-body font-medium px-6 md:px-8"
        >
          <Trash2 className="h-5 w-5 md:h-6 md:w-6 mr-2" />
          {t("menu.clearAll")}
        </Button>
      </div>
    </footer>
  );
};

export default BottomBar;
