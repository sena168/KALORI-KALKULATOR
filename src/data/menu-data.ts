// Auto-generated menu data from /public/menu/ folder structure
// This file serves as the data layer for the menu system
// In the future, this can be swapped with an API call without changing UI components

export interface MenuItem {
  id: string;
  name: string;
  calories: number;
  imagePath: string;
  category: 'makanan-utama' | 'camilan' | 'minuman';
}

export interface MenuCategory {
  id: 'makanan-utama' | 'camilan' | 'minuman';
  label: string;
  items: MenuItem[];
}

// Helper function to parse filename into menu item
// Format: nama_menu-kalori.png -> { name: "Nama Menu", calories: 123 }
export const parseFilename = (filename: string, category: 'makanan-utama' | 'camilan' | 'minuman'): MenuItem | null => {
  try {
    // Remove extension
    const nameWithoutExt = filename.replace(/\.png$/i, '');
    
    // Split by dash to get name and calories
    const lastDashIndex = nameWithoutExt.lastIndexOf('-');
    if (lastDashIndex === -1) return null;
    
    const namePart = nameWithoutExt.substring(0, lastDashIndex);
    const caloriesPart = nameWithoutExt.substring(lastDashIndex + 1);
    
    // Parse calories
    const calories = parseInt(caloriesPart, 10);
    if (isNaN(calories)) return null;
    
    // Convert name: replace underscores with spaces, title case
    const name = namePart
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    
    return {
      id: `${category}-${namePart}`,
      name,
      calories,
      imagePath: `/menu/${category}/${filename}`,
      category,
    };
  } catch {
    return null;
  }
};

// Import all PNG files from menu folders at build time
// This uses Vite's import.meta.glob for build-time file discovery

const makananUtamaFiles = import.meta.glob('/public/menu/makanan-utama/*.png', { eager: true, query: '?url', import: 'default' });
const camilanFiles = import.meta.glob('/public/menu/camilan/*.png', { eager: true, query: '?url', import: 'default' });
const minumanFiles = import.meta.glob('/public/menu/minuman/*.png', { eager: true, query: '?url', import: 'default' });

const extractFilename = (path: string): string => {
  const parts = path.split('/');
  return parts[parts.length - 1];
};

const processFiles = (files: Record<string, unknown>, category: 'makanan-utama' | 'camilan' | 'minuman'): MenuItem[] => {
  return Object.keys(files)
    .map(path => {
      const filename = extractFilename(path);
      return parseFilename(filename, category);
    })
    .filter((item): item is MenuItem => item !== null)
    .sort((a, b) => a.name.localeCompare(b.name));
};

export const menuCategories: MenuCategory[] = [
  {
    id: 'makanan-utama',
    label: 'Makanan Utama',
    items: processFiles(makananUtamaFiles, 'makanan-utama'),
  },
  {
    id: 'camilan',
    label: 'Camilan',
    items: processFiles(camilanFiles, 'camilan'),
  },
  {
    id: 'minuman',
    label: 'Minuman',
    items: processFiles(minumanFiles, 'minuman'),
  },
];

// For development/demo: sample placeholder data when no images are present
export const sampleMenuData: MenuCategory[] = [
  {
    id: 'makanan-utama',
    label: 'Makanan Utama',
    items: [
      { id: 'mu-1', name: 'Nasi Goreng', calories: 350, imagePath: '/placeholder.svg', category: 'makanan-utama' },
      { id: 'mu-2', name: 'Mie Ayam', calories: 420, imagePath: '/placeholder.svg', category: 'makanan-utama' },
      { id: 'mu-3', name: 'Soto Ayam', calories: 280, imagePath: '/placeholder.svg', category: 'makanan-utama' },
      { id: 'mu-4', name: 'Gado Gado', calories: 320, imagePath: '/placeholder.svg', category: 'makanan-utama' },
      { id: 'mu-5', name: 'Rendang', calories: 450, imagePath: '/placeholder.svg', category: 'makanan-utama' },
      { id: 'mu-6', name: 'Ayam Bakar', calories: 380, imagePath: '/placeholder.svg', category: 'makanan-utama' },
      { id: 'mu-7', name: 'Ikan Goreng', calories: 290, imagePath: '/placeholder.svg', category: 'makanan-utama' },
      { id: 'mu-8', name: 'Bakso', calories: 340, imagePath: '/placeholder.svg', category: 'makanan-utama' },
    ],
  },
  {
    id: 'camilan',
    label: 'Camilan',
    items: [
      { id: 'cm-1', name: 'Pisang Goreng', calories: 180, imagePath: '/placeholder.svg', category: 'camilan' },
      { id: 'cm-2', name: 'Martabak Manis', calories: 450, imagePath: '/placeholder.svg', category: 'camilan' },
      { id: 'cm-3', name: 'Risoles', calories: 150, imagePath: '/placeholder.svg', category: 'camilan' },
      { id: 'cm-4', name: 'Tahu Goreng', calories: 120, imagePath: '/placeholder.svg', category: 'camilan' },
      { id: 'cm-5', name: 'Kue Lapis', calories: 200, imagePath: '/placeholder.svg', category: 'camilan' },
      { id: 'cm-6', name: 'Onde Onde', calories: 160, imagePath: '/placeholder.svg', category: 'camilan' },
    ],
  },
  {
    id: 'minuman',
    label: 'Minuman',
    items: [
      { id: 'mn-1', name: 'Es Teh Manis', calories: 90, imagePath: '/placeholder.svg', category: 'minuman' },
      { id: 'mn-2', name: 'Es Jeruk', calories: 120, imagePath: '/placeholder.svg', category: 'minuman' },
      { id: 'mn-3', name: 'Kopi Susu', calories: 150, imagePath: '/placeholder.svg', category: 'minuman' },
      { id: 'mn-4', name: 'Es Campur', calories: 280, imagePath: '/placeholder.svg', category: 'minuman' },
      { id: 'mn-5', name: 'Jus Alpukat', calories: 220, imagePath: '/placeholder.svg', category: 'minuman' },
      { id: 'mn-6', name: 'Es Kelapa Muda', calories: 80, imagePath: '/placeholder.svg', category: 'minuman' },
    ],
  },
];

// Export the menu data - uses real data if available, otherwise sample data
export const getMenuData = (): MenuCategory[] => {
  const hasRealData = menuCategories.some(cat => cat.items.length > 0);
  return hasRealData ? menuCategories : sampleMenuData;
};
