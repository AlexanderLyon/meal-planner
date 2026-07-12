import { useState } from 'react';
import { Card } from '@components/Card';
import { Button } from '@components/Button';
import { SkeletonLoader } from '@components/skeleton-loader';
import { MealGeneration } from '@components/meal-generation';
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
  const { addNewMeal } = useMeals();

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
    addNewMeal({
      mealName,
      mealIngredients,
      instructions,
      onSuccess: () => {
        setMealName('');
        setMealIngredients([]);
        setInstructions('');
        onMealAdded?.();
      },
    });
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
        <label className="label">Ingredients Required</label>
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

      <Button className="primary" onClick={handleAddMeal} disabled={!mealName.trim() || !household}>
        Save meal
      </Button>
    </div>
  );
};

const EditMealForm = ({
  meal,
  onSave,
  onCancel,
}: {
  meal: Meal;
  onSave: () => void;
  onCancel: () => void;
}) => {
  const [mealName, setMealName] = useState(meal.name);
  const [ingredients, setIngredients] = useState<MealIngredient[]>(meal.ingredients);
  const [instructions, setInstructions] = useState(meal.instructions ?? '');
  const [ingredientDraft, setIngredientDraft] = useState({ name: '', quantity: '', unit: '' });

  const createId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

  const handleAddIngredient = () => {
    const name = ingredientDraft.name.trim();
    const unit = ingredientDraft.unit.trim();
    const quantity = Number(ingredientDraft.quantity);
    if (!name || !unit || Number.isNaN(quantity) || quantity <= 0) return;
    setIngredients((prev) => [...prev, { id: createId('ing'), name, quantity, unit }]);
    setIngredientDraft({ name: '', quantity: '', unit: '' });
  };

  const handleRemoveIngredient = (id: string) => {
    setIngredients((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSave = async () => {
    const name = mealName.trim();
    if (!name) return;
    const { error } = await supabase
      .from('meals')
      .update({ name, ingredients, instructions: instructions.trim() || null })
      .eq('id', meal.id);
    if (error) {
      console.error('Error updating meal:', error);
      return;
    }
    onSave();
  };

  return (
    <div className="meal-form">
      <div>
        <label className="label">Meal name</label>
        <input value={mealName} onChange={(e) => setMealName(e.target.value)} />
      </div>

      <div>
        <label className="label">Ingredients</label>
        <div className="ingredient-row">
          <input
            placeholder="Ingredient"
            value={ingredientDraft.name}
            onChange={(e) => setIngredientDraft((prev) => ({ ...prev, name: e.target.value }))}
          />
          <input
            type="number"
            min="0"
            step="0.25"
            placeholder="Qty"
            value={ingredientDraft.quantity}
            onChange={(e) => setIngredientDraft((prev) => ({ ...prev, quantity: e.target.value }))}
          />
          <input
            placeholder="Unit"
            value={ingredientDraft.unit}
            onChange={(e) => setIngredientDraft((prev) => ({ ...prev, unit: e.target.value }))}
          />
          <Button className="ghost" onClick={handleAddIngredient}>
            Add
          </Button>
        </div>
      </div>

      <div className="chip-list">
        {ingredients.map((ingredient) => (
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
        <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} />
      </div>

      <div className="edit-actions">
        <Button className="primary" onClick={handleSave} disabled={!mealName.trim()}>
          Save changes
        </Button>
        <Button className="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

const SavedMeals = ({
  meals,
  onDelete,
  onEdited,
}: {
  meals: Meal[];
  onDelete: (id: string, name: string) => void;
  onEdited: () => void;
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingMealId, setEditingMealId] = useState<string | null>(null);

  return (
    <div className="search-wrapper">
      <div className="filter-input">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11.36 20.213l-2.36 .787v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227h16v2.172a2 2 0 0 1 -.586 1.414l-4.414 4.414" />
          <path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
          <path d="M20.2 20.2l1.8 1.8" />
        </svg>
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Filter meals"
        />
      </div>
      <div className="meal-list">
        {meals.map((meal) => {
          if (
            searchTerm?.trim()?.length &&
            !meal.name.toLowerCase().includes(searchTerm.toLowerCase())
          ) {
            return;
          }
          return (
            <Card key={meal.id} condensed className="meal-card">
              {editingMealId === meal.id ? (
                <EditMealForm
                  meal={meal}
                  onSave={() => {
                    setEditingMealId(null);
                    onEdited();
                  }}
                  onCancel={() => setEditingMealId(null)}
                />
              ) : (
                <>
                  <div className="meal-card-actions">
                    <button
                      onClick={() => setEditingMealId(meal.id)}
                      className="edit-button"
                      title="Edit meal"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(meal.id, meal.name)}
                      className="delete-button"
                      title="Delete meal"
                    >
                      ✕
                    </button>
                  </div>
                  <h3>{meal.name}</h3>
                  <ul>
                    {meal.ingredients.map((ingredient) => (
                      <li key={ingredient.id}>
                        {ingredient.name} · {ingredient.quantity} {ingredient.unit}
                      </li>
                    ))}
                  </ul>
                  {meal.instructions && <p>{meal.instructions}</p>}
                </>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export const MealsList: React.FC = () => {
  const { meals, refresh, loading } = useMeals();

  const handleDeleteMeal = async (mealId: string, mealName: string) => {
    if (!confirm(`Are you sure you want to delete "${mealName}"? This action cannot be undone.`)) {
      return;
    }

    const { error } = await supabase.from('meals').delete().eq('id', mealId);

    if (error) {
      console.error('Error deleting meal:', error);
    } else {
      refresh();
    }
  };

  if (loading) {
    return <SkeletonLoader height={500} />;
  }

  return (
    <>
      <Card title="Meals" subtitle="Save your favorite recipes with ingredients and measurements.">
        <div className="meal-grid">
          <NewMealForm onMealAdded={refresh} />
          <SavedMeals meals={meals} onDelete={handleDeleteMeal} onEdited={refresh} />
        </div>
      </Card>
      <MealGeneration />
    </>
  );
};
