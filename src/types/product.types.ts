export interface Category {
  _id: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
}

export interface ModifierOption {
  _id: string;
  modifierGroupId: string;
  name: string;
  price: number;
  isActive: boolean;
  sortOrder: number;
}

export interface ModifierGroup {
  _id: string;
  name: string;
  selectionType: 'SINGLE' | 'MULTIPLE';
  required: boolean;
  minSelect: number;
  maxSelect: number | null;
  isActive: boolean;
  modifiers?: ModifierOption[]; // populated by GET /modifiers/groups
}

export interface MenuProduct {
  _id: string;
  name: string;
  sku: string | null;
  categoryId: string | Category;
  price: number;
  tax: number;
  imageKey: string | null;
  imageUrl: string | null;
  modifierGroupIds: string[] | ModifierGroup[];
  recipeId: string | null;
  availableBranches: string[];
  isActive: boolean;
  createdAt: string;
}

export interface CreateProductPayload {
  name: string;
  sku?: string;
  categoryId: string;
  price: number;
  tax?: number;
  modifierGroupIds?: string[];
  availableBranches?: string[];
}



