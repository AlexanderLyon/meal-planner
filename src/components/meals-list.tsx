import { useState } from 'react';
import { Button } from '@components/button';
import { useHousehold } from '@context/useHousehold';
import { supabase } from '@utils/supabase';
import type { Meal, MealIngredient } from '../types';
import { useMeals } from '@context/mealsProvider';

const NewMealForm = ({ onMealAdded }: { onMealAdded?: () => void }) => {
  const { household } = useHousehold();
  const [mealName, setMealName] = useState('');
  const [ingredientDraft, setIngredientDraft] = useState({
    name: '',
    quantity: '',
    unit: '',
  });
  const [mealIngredients, setMealIngredients] = useState<MealIngredient[]>([]);
  const [instructions, setInstructions] = useState('');

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

  const handleAddMeal = async () => {
    const name = mealName.trim();
    if (!name || mealIngredients.length === 0 || !household) return;

    try {
      const { error } = await supabase.from('meals').insert({
        name,
        household_id: household.id,
        ingredients: mealIngredients,
        instructions: instructions.trim() || null,
      });

      if (error) {
        console.error('Error inserting meal:', error);
        return;
      }

      setMealName('');
      setMealIngredients([]);
      setInstructions('');
      onMealAdded?.();
    } catch (err) {
      console.error('Failed to add meal:', err);
    }
  };

  return (
    <div className="meal-form">
      <div>
        <label className="label">Meal name</label>
        <input
          placeholder="Name of the meal"
          value={mealName}
          onChange={(event) => setMealName(event.target.value)}
        />
      </div>

      <div>
        <label className="label">Ingredients List</label>
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
      </div>

      <div className="chip-list">
        {mealIngredients.map((ingredient) => (
          <span key={ingredient.id} className="chip">
            {ingredient.name} · {ingredient.quantity} {ingredient.unit}
            <Button className="chip-action" onClick={() => handleRemoveIngredient(ingredient.id)}>
              Remove
            </Button>
          </span>
        ))}
      </div>

      <div>
        <label className="label">Instructions</label>
        <textarea
          placeholder="Enter any preparation notes that are important for this recipe"
          value={instructions}
          onChange={(event) => setInstructions(event.target.value)}
        />
      </div>

      <Button
        className="primary"
        onClick={handleAddMeal}
        disabled={!mealName.trim() || mealIngredients.length === 0 || !household}
      >
        Save meal
      </Button>
    </div>
  );
};

const SavedMeals = ({ meals }: { meals: Meal[] }) => {
  return (
    <div className="meal-list">
      {meals.map((meal) => (
        <div key={meal.id} className="meal-card">
          <h3>{meal.name}</h3>
          <ul>
            {meal.ingredients.map((ingredient) => (
              <li key={ingredient.id}>
                {ingredient.name} · {ingredient.quantity} {ingredient.unit}
              </li>
            ))}
          </ul>
          {meal.instructions && <p>{meal.instructions}</p>}
        </div>
      ))}
    </div>
  );
};

export const MealsList: React.FC = () => {
  const { meals, refresh } = useMeals();

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Meals</h2>
        <p>Save your favorite recipes with ingredients and measurements.</p>
      </div>

      <div className="meal-grid">
        <NewMealForm onMealAdded={refresh} />
        <SavedMeals meals={meals} />
      </div>
    </section>
  );
};
