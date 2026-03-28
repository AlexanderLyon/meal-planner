import { useState, useEffect } from 'react';
import { supabase } from '@utils/supabase';
import { useHousehold } from '@context/useHousehold';
import { Button } from '@components/button';
import type { IngredientItem } from '../types';

export const IngredientList: React.FC = () => {
  const { household } = useHousehold();
  const [pantry, setPantry] = useState<IngredientItem[]>([]);
  const [pantryDraft, setPantryDraft] = useState({
    name: '',
    preferredStore: '',
  });

  const fetchIngredientsList = async () => {
    const { data, error } = await supabase
      .from('ingredients')
      .select('*')
      .eq('household_id', household?.id);
    if (error) {
      console.error(error);
    } else if (data) {
      setPantry(data);
    }
  };

  const handleAddIngredientItem = async () => {
    const name = pantryDraft.name.trim();
    const preferredStore = pantryDraft.preferredStore.trim();
    const { data, error } = await supabase
      .from('ingredients')
      .insert({
        household_id: household?.id,
        name,
        preferred_store: preferredStore,
      })
      .select()
      .single();

    if (error) {
      console.error(error);
    } else if (data) {
      setPantryDraft({ name: '', preferredStore: '' });
      await fetchIngredientsList(); // Refresh the list after adding
    }
  };

  useEffect(() => {
    fetchIngredientsList();
  }, []);

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Ingredients</h2>
        <p>Keep a shared ingredient list with preferred stores.</p>
      </div>

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
            disabled={!pantryDraft.name || !pantryDraft.preferredStore}
          >
            Add ingredient
          </Button>
        </div>

        <div className="ingredient-list">
          {pantry.map((item) => (
            <article key={item.id} className="meal-card">
              <h3>{item.name}</h3>
              {item.preferred_brand && (
                <p className="muted">Preferred brand: {item.preferred_brand}</p>
              )}
              {item.preferred_store && (
                <p className="muted">Preferred store: {item.preferred_store}</p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
