import './App.css';
import { HouseholdProvider } from '@context/householdProvider';
import { useHousehold } from '@context/useHousehold';
import { Onboarding } from '@components/onboarding';
import { Dashboard } from '@components/dashboard';

function App() {
  const { household } = useHousehold();

  return (
    <>
      <header className="app-header">
        <div>
          <p className="eyebrow">Meal Planner</p>
        </div>
        {household?.id ? (
          <nav className="navigation">
            <p>This Week</p>
            <p>Meals</p>
            <p>Ingredients</p>
            <p>Shopping List</p>
          </nav>
        ) : null}
      </header>

      <>{!household?.id ? <Onboarding /> : <Dashboard />}</>
    </>
  );
}

function AppWrapper() {
  return (
    <div className="app">
      <HouseholdProvider>
        <App />
      </HouseholdProvider>
    </div>
  );
}

export default AppWrapper;
