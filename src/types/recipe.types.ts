export interface RecipeItem {
  inventoryItemId: string | { _id: string; name: string; unit: string };
  quantity: number;
  unit: string;
}

export interface Recipe {
  _id: string;
  productId: string;
  items: RecipeItem[];
  version: number;
  active: boolean;
}

export interface RecipeCostBreakdownLine {
  inventoryItemId: string;
  name: string;
  quantity: number;
  unit: string;
  cost: number;
}

export interface RecipeCost {
  productId: string;
  recipeVersion: number;
  breakdown: RecipeCostBreakdownLine[];
  totalFoodCost: number;
  sellingPrice: number | null;
  foodCostPercent: number | null;
}


