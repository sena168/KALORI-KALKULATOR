import { useState, useCallback, useMemo } from 'react';
import { MenuItem } from '@/data/menu-data';
import { useMenuData } from '@/hooks/useMenuData';

export interface ItemQuantity {
  [itemId: string]: number;
}

export interface UseCalorieStateReturn {
  quantities: ItemQuantity;
  totalCalories: number;
  incrementQuantity: (itemId: string) => void;
  decrementQuantity: (itemId: string) => void;
  setQuantity: (itemId: string, quantity: number) => void;
  clearAll: () => void;
  getQuantity: (itemId: string) => number;
}

export const useCalorieState = (): UseCalorieStateReturn => {
  const [quantities, setQuantities] = useState<ItemQuantity>({});
  
  const { categories: menuData } = useMenuData({ includeHidden: false });
  
  // Create a map of item IDs to their calorie values for quick lookup
  const calorieMap = useMemo(() => {
    const map: Record<string, number> = {};
    menuData.forEach(category => {
      category.items.forEach(item => {
        map[item.id] = item.calories;
      });
    });
    return map;
  }, [menuData]);

  const totalCalories = useMemo(() => {
    return Object.entries(quantities).reduce((total, [itemId, quantity]) => {
      const calories = calorieMap[itemId] || 0;
      return total + (calories * quantity);
    }, 0);
  }, [quantities, calorieMap]);

  const incrementQuantity = useCallback((itemId: string) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  }, []);

  const decrementQuantity = useCallback((itemId: string) => {
    setQuantities(prev => {
      const currentQty = prev[itemId] || 0;
      if (currentQty <= 0) return prev;
      
      const newQty = currentQty - 1;
      if (newQty === 0) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      
      return {
        ...prev,
        [itemId]: newQty,
      };
    });
  }, []);

  const setQuantity = useCallback((itemId: string, quantity: number) => {
    setQuantities(prev => {
      if (quantity <= 0) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [itemId]: quantity,
      };
    });
  }, []);

  const clearAll = useCallback(() => {
    setQuantities({});
  }, []);

  const getQuantity = useCallback((itemId: string) => {
    return quantities[itemId] || 0;
  }, [quantities]);

  return {
    quantities,
    totalCalories,
    incrementQuantity,
    decrementQuantity,
    setQuantity,
    clearAll,
    getQuantity,
  };
};
