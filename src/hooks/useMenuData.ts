import { useCallback, useEffect, useMemo, useState } from "react";
import { getMenuData, MenuCategory, MenuItem } from "@/data/menu-data";

type MenuOverride = {
  name?: string;
  calories?: number;
  imageDataUrl?: string;
  hidden?: boolean;
};

type AdminState = {
  overrides: Record<string, MenuOverride>;
  order: Partial<Record<MenuCategory["id"], string[]>>;
};

export type MenuItemWithMeta = MenuItem & {
  hidden?: boolean;
  imageDataUrl?: string;
};

export type MenuCategoryWithMeta = Omit<MenuCategory, "items"> & {
  items: MenuItemWithMeta[];
};

const STORAGE_KEY = "admin-menu-overrides-v1";

const emptyState: AdminState = { overrides: {}, order: {} };

const loadState = (): AdminState => {
  if (typeof window === "undefined") return emptyState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState;
    const parsed = JSON.parse(raw) as AdminState;
    return {
      overrides: parsed.overrides ?? {},
      order: parsed.order ?? {},
    };
  } catch {
    return emptyState;
  }
};

const saveState = (state: AdminState) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        overrides: state.overrides,
        order: state.order,
      }),
    );
  } catch {
    // ignore storage failures
  }
};

const applyState = (base: MenuCategory[], state: AdminState): MenuCategoryWithMeta[] => {
  return base.map((category) => {
    const items = category.items.map((item) => {
      const override = state.overrides[item.id];
      const imagePath = override?.imageDataUrl ?? item.imagePath;
      return {
        ...item,
        ...override,
        imagePath,
        hidden: override?.hidden ?? false,
      };
    });

    const order = state.order[category.id];
    if (!order || order.length === 0) {
      return { ...category, items };
    }

    const byId = new Map(items.map((item) => [item.id, item]));
    const ordered = order.map((id) => byId.get(id)).filter(Boolean) as MenuItemWithMeta[];
    const remaining = items.filter((item) => !order.includes(item.id));
    return {
      ...category,
      items: [...ordered, ...remaining],
    };
  });
};

export const useMenuData = (options?: { includeHidden?: boolean }) => {
  const base = useMemo(() => getMenuData(), []);
  const [state, setState] = useState<AdminState>(() => loadState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  const merged = useMemo(() => applyState(base, state), [base, state]);

  const categories = useMemo(() => {
    if (options?.includeHidden === false) {
      return merged.map((category) => ({
        ...category,
        items: category.items.filter((item) => !item.hidden),
      }));
    }
    return merged;
  }, [merged, options?.includeHidden]);

  const updateItem = useCallback((itemId: string, patch: MenuOverride) => {
    setState((prev) => ({
      ...prev,
      overrides: {
        ...prev.overrides,
        [itemId]: {
          ...prev.overrides[itemId],
          ...patch,
        },
      },
    }));
  }, []);

  const setOrder = useCallback((categoryId: MenuCategory["id"], order: string[]) => {
    setState((prev) => ({
      ...prev,
      order: {
        ...prev.order,
        [categoryId]: order,
      },
    }));
  }, []);

  return {
    categories,
    updateItem,
    setOrder,
  };
};
