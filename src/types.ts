export type Household = {
  name: string;
  id: string;
};

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
  instructions?: string;
};

export type MealPlanDay = {
  mealId?: string;
  note?: string;
};

export type WeeklyMealPlan = {
  [day: string]: MealPlanDay;
};

export type IngredientItem = {
  id: string;
  name: string;
  preferred_brand?: string;
  preferred_store?: string;
};
