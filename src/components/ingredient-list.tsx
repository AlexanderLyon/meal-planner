import { useState } from 'react';
import { supabase } from '@utils/supabase';
import { useHousehold } from '@context/useHousehold';
import { Card } from '@components/Card';
import { Button } from '@components/Button';
import { SkeletonLoader } from '@components/skeleton-loader';
import { useMeals } from '@context/mealsProvider';

export const IngredientList: React.FC = () => {
  const { household } = useHousehold();
  const { ingredients, refresh, loading } = useMeals();
  const [pantryDraft, setPantryDraft] = useState({
    name: '',
    preferredBrand: '',
    preferredStore: '',
  });
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddIngredientItem = async () => {
    const name = pantryDraft.name.trim();
    const preferredStore = pantryDraft.preferredStore.trim();
    const preferredBrand = pantryDraft.preferredBrand.trim();
    const { data, error } = await supabase
      .from('ingredients')
      .insert({
        household_id: household?.id,
        name,
        preferred_brand: preferredBrand,
        preferred_store: preferredStore,
      })
      .select()
      .single();

    if (error) {
      console.error(error);
    } else if (data) {
      setPantryDraft({ name: '', preferredBrand: '', preferredStore: '' });
      refresh(); // Refresh the list after adding
    }
  };

  const handleDeleteIngredient = async (ingredientId: string, ingredientName: string) => {
    if (
      !confirm(`Are you sure you want to delete "${ingredientName}"? This action cannot be undone.`)
    ) {
      return;
    }

    const { error } = await supabase.from('ingredients').delete().eq('id', ingredientId);

    if (error) {
      console.error('Error deleting ingredient:', error);
    } else {
      refresh();
    }
  };

  if (loading) {
    return <SkeletonLoader height={500} />;
  }

  return (
    <Card title="Ingredients" subtitle="List your most-used ingredients with preferred stores.">
      <div className="meal-grid">
        <div className="meal-form">
          <div>
            <label className="label">Ingredient name</label>
            <input
              placeholder="Baby spinach"
              value={pantryDraft.name}
              onChange={(event) =>
                setPantryDraft((prev) => ({
                  ...prev,
                  name: event.target.value,
                }))
              }
            />
          </div>
          <div>
            <label className="label">Preferred brand</label>
            <input
              placeholder="Rummo"
              value={pantryDraft.preferredBrand}
              onChange={(event) =>
                setPantryDraft((prev) => ({
                  ...prev,
                  preferredBrand: event.target.value,
                }))
              }
            />
          </div>
          <div>
            <label className="label">Preferred store</label>
            <input
              placeholder="Local market"
              value={pantryDraft.preferredStore}
              onChange={(event) =>
                setPantryDraft((prev) => ({
                  ...prev,
                  preferredStore: event.target.value,
                }))
              }
            />
          </div>
          <Button
            className="primary"
            onClick={handleAddIngredientItem}
            disabled={!pantryDraft.name}
          >
            Add ingredient
          </Button>
        </div>

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
              placeholder="Filter ingredients"
            />
          </div>

          <div className="ingredient-list">
            {ingredients.map((item) => {
              if (
                searchTerm?.trim()?.length &&
                !item.name.toLowerCase().includes(searchTerm.toLowerCase())
              ) {
                return;
              }
              return (
                <Card key={item.id} condensed className="ingredient-card">
                  <button
                    onClick={() => handleDeleteIngredient(item.id, item.name)}
                    className="delete-button"
                    title="Delete ingredient"
                  >
                    ✕
                  </button>
                  <h3>{item.name}</h3>
                  {item.preferred_brand && (
                    <p className="muted">Preferred brand: {item.preferred_brand}</p>
                  )}
                  {item.preferred_store && (
                    <p className="muted">Preferred store: {item.preferred_store}</p>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
};
