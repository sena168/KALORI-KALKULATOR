import React, { useState, useMemo, useCallback } from 'react';
import { getMenuData } from '@/data/menu-data';
import { CalorieProvider } from '@/contexts/CalorieContext';
import Header from '@/components/Header';
import CategoryTabs from '@/components/CategoryTabs';
import FoodMenu from '@/components/FoodMenu';
import BottomBar from '@/components/BottomBar';

const Calculator: React.FC = () => {
  const menuData = useMemo(() => getMenuData(), []);
  const [activeCategory, setActiveCategory] = useState<string>(menuData[0]?.id || 'makanan-utama');

  const handleCategoryChange = useCallback((categoryId: string) => {
    setActiveCategory(categoryId);
  }, []);

  const activeItems = useMemo(() => {
    const category = menuData.find(cat => cat.id === activeCategory);
    return category?.items || [];
  }, [menuData, activeCategory]);

  return (
    <CalorieProvider>
      <div className="h-screen flex flex-col overflow-hidden bg-background">
        {/* Fixed Header */}
        <Header />
        
        {/* Fixed Category Tabs */}
        <CategoryTabs
          categories={menuData}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />
        
        {/* Scrollable Menu Content */}
        {/* Spacing: header (16-24) + tabs (~60-72) + bottom bar (20-28) */}
        <main className="flex flex-col flex-1 min-h-0 mt-[8.5rem] md:mt-[10rem] lg:mt-[12rem] mb-20 md:mb-24 lg:mb-28">
          <FoodMenu items={activeItems} categoryId={activeCategory} />
        </main>
        
        {/* Fixed Bottom Bar */}
        <BottomBar />
      </div>
    </CalorieProvider>
  );
};

export default Calculator;
