
export enum ToolCategory {
  IMAGE = 'Image Tools',
  SEO = 'SEO Tools',
  TEXT = 'Text Tools',
  DEV = 'Developer Tools',
  MATH = 'Math & Calculators',
  UNIT = 'Unit Converters',
  SECURITY = 'Security & Encryption',
  SOCIAL = 'Social Media',
  MISC = 'Miscellaneous',
  PDF = 'PDF Tools',
  VIDEO = 'Video Tools'
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: string; // Lucide icon name or emoji
}

export interface AppState {
  currentToolId: string | null;
  searchQuery: string;
  activeCategory: ToolCategory | 'All';
}
