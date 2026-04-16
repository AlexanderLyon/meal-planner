import './App.css';
import { BrowserRouter, Routes, Route, NavLink, Navigate, useLocation } from 'react-router';
import { HouseholdProvider } from '@context/householdProvider';
import { Onboarding } from '@components/onboarding';
import { MealsList } from '@components/meals-list';
import { ShoppingList } from '@components/shopping-list';
import { WeeklyPlan } from '@components/weekly-plan';
import { ShareCode } from '@components/share-code';
import { IngredientList } from '@components/ingredient-list';
import { useHousehold } from '@/context/useHousehold';
import { MealsProvider } from '@/context/mealsProvider';

function App() {
  const { household } = useHousehold();
  const location = useLocation();
  const loggedOut = !household?.id;

  if (loggedOut) {
    return (
      <>
        {location.pathname !== '/' && <Navigate to="/" replace />}
        <header className="app-header">
          <div>
            <p className="eyebrow">Meal Planner</p>
          </div>
        </header>
        <Onboarding />
      </>
    );
  }

  return (
    <MealsProvider household={household}>
      <header className="app-header">
        <div>
          <p className="eyebrow">Meal Planner</p>
        </div>
        <nav className="navigation">
          <NavLink to="/weekly-plan">This Week</NavLink>
          <NavLink to="/meals">Meals</NavLink>
          <NavLink to="/ingredients">Ingredients</NavLink>
          <NavLink to="/shopping">Shopping List</NavLink>
        </nav>
      </header>
      <main className="dashboard">
        <Routes>
          <Route path="/" element={<WeeklyPlan />} />
          <Route path="/weekly-plan" element={<WeeklyPlan />} />
          <Route path="/meals" element={<MealsList />} />
          <Route path="/ingredients" element={<IngredientList />} />
          <Route path="/shopping" element={<ShoppingList />} />
        </Routes>

        <ShareCode />
      </main>
    </MealsProvider>
  );
}

function AppWrapper() {
  return (
    <BrowserRouter>
      <div className="app">
        <HouseholdProvider>
          <App />
        </HouseholdProvider>
      </div>
    </BrowserRouter>
  );
}

export default AppWrapper;
