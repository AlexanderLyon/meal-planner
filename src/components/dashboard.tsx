import React, { useState } from 'react';
import type { MealIngredient, Meal } from '../types';
import { Button } from '@components/button';
import { ShoppingList } from '@components/shopping-list';
import { WeeklyPlan } from '@components/weekly-plan';
import { ShareCode } from '@components/share-code';
import { IngredientList } from '@components/ingredient-list';

const initialMeals: Meal[] = [
  {
    id: 'meal-1',
    name: 'Lemon Herb Chicken',
    ingredients: [
      { id: 'ing-1', name: 'Chicken thighs', quantity: 6, unit: 'pcs' },
      { id: 'ing-2', name: 'Lemon', quantity: 2, unit: 'pcs' },
      { id: 'ing-3', name: 'Olive oil', quantity: 3, unit: 'tbsp' },
    ],
  },
  {
    id: 'meal-2',
    name: 'Veggie Chili',
    ingredients: [
      { id: 'ing-4', name: 'Kidney beans', quantity: 2, unit: 'cans' },
      { id: 'ing-5', name: 'Bell pepper', quantity: 2, unit: 'pcs' },
      { id: 'ing-6', name: 'Tomatoes', quantity: 1, unit: 'can' },
    ],
  },
  {
    id: 'meal-3',
    name: 'Salmon Grain Bowl',
    ingredients: [
      { id: 'ing-7', name: 'Salmon', quantity: 2, unit: 'fillets' },
      { id: 'ing-8', name: 'Quinoa', quantity: 1, unit: 'cup' },
      { id: 'ing-9', name: 'Cucumber', quantity: 1, unit: 'pcs' },
    ],
  },
];

export const Dashboard: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>(initialMeals);

  const [mealName, setMealName] = useState('');
  const [ingredientDraft, setIngredientDraft] = useState({
    name: '',
    quantity: '',
    unit: '',
  });
  const [mealIngredients, setMealIngredients] = useState<MealIngredient[]>([]);

  const createId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

  const handleAddIngredient = () => {
    const name = ingredientDraft.name.trim();
    const unit = ingredientDraft.unit.trim();
    const quantity = Number(ingredientDraft.quantity);

    if (!name || !unit || Number.isNaN(quantity) || quantity <= 0) return;

    setMealIngredients((prev) => [...prev, { id: createId('ing'), name, quantity, unit }]);
    setIngredientDraft({ name: '', quantity: '', unit: '' });
  };

  const handleRemoveIngredient = (id: string) => {
    setMealIngredients((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddMeal = () => {
    const name = mealName.trim();
    if (!name || mealIngredients.length === 0) return;

    const newMeal: Meal = {
      id: createId('meal'),
      name,
      ingredients: mealIngredients,
    };

    setMeals((prev) => [newMeal, ...prev]);
    setMealName('');
    setMealIngredients([]);
  };

  return (
    <main className="dashboard">
      <section className="panel">
        <div className="panel-head">
          <h2>Meals</h2>
          <p>Save go-to recipes with ingredients and measurements.</p>
        </div>

        <div className="meal-grid">
          <div className="meal-form">
            <div>
              <label className="label">Meal name</label>
              <input
                placeholder="Crispy tofu bowls"
                value={mealName}
                onChange={(event) => setMealName(event.target.value)}
              />
            </div>

            <div className="ingredient-row">
              <input
                placeholder="Ingredient"
                value={ingredientDraft.name}
                onChange={(event) =>
                  setIngredientDraft((prev) => ({
                    ...prev,
                    name: event.target.value,
                  }))
                }
              />
              <input
                type="number"
                min="0"
                step="0.25"
                placeholder="Qty"
                value={ingredientDraft.quantity}
                onChange={(event) =>
                  setIngredientDraft((prev) => ({
                    ...prev,
                    quantity: event.target.value,
                  }))
                }
              />
              <input
                placeholder="Unit"
                value={ingredientDraft.unit}
                onChange={(event) =>
                  setIngredientDraft((prev) => ({
                    ...prev,
                    unit: event.target.value,
                  }))
                }
              />
              <Button className="ghost" onClick={handleAddIngredient}>
                Add
              </Button>
            </div>

            <div className="chip-list">
              {mealIngredients.map((ingredient) => (
                <span key={ingredient.id} className="chip">
                  {ingredient.name} · {ingredient.quantity} {ingredient.unit}
                  <Button
                    className="chip-action"
                    onClick={() => handleRemoveIngredient(ingredient.id)}
                  >
                    Remove
                  </Button>
                </span>
              ))}
            </div>

            <Button className="primary" onClick={handleAddMeal}>
              Save meal
            </Button>
          </div>

          <div className="meal-list">
            {meals.map((meal) => (
              <article key={meal.id} className="meal-card">
                <h3>{meal.name}</h3>
                <ul>
                  {meal.ingredients.map((ingredient) => (
                    <li key={ingredient.id}>
                      {ingredient.name} · {ingredient.quantity} {ingredient.unit}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <IngredientList />
      <WeeklyPlan meals={meals} />
      <ShoppingList />
      <ShareCode />
    </main>
  );
};
