export type MealIngredient = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
};

export type Meal = {
  id: string;
  name: string;
  ingredients: MealIngredient[];
};

export type MealPlanDay = {
  day: string;
  mealId: string;
  note: string;
};

export type IngredientItem = {
  id: string;
  name: string;
  preferred_brand?: string;
  preferred_store?: string;
};
