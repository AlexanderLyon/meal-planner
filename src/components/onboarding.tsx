import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { Button } from '@components/button';
import { useHousehold } from '@context/useHousehold';

const OnboardingMode = {
  Create: 'create',
  Join: 'join',
} as const;

type OnboardingMode = (typeof OnboardingMode)[keyof typeof OnboardingMode];

export const Onboarding: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { joinHouseholdById, createHousehold } = useHousehold();
  const [onboardingMode, setOnboardingMode] = useState<OnboardingMode>(OnboardingMode.Create);
  const [householdName, setHouseholdName] = useState('');
  const [joinCode, setJoinCode] = useState('');

  const handleCreateHousehold = async (name: string) => {
    await createHousehold(name);
  };

  const handleJoinHousehold = async () => {
    await joinHouseholdById(joinCode.trim());
  };

  useEffect(() => {
    if (searchParams.get('code')) {
      setOnboardingMode(OnboardingMode.Join);
      setJoinCode(searchParams.get('code') || '');
    }
  }, [searchParams, setJoinCode, setOnboardingMode]);

  return (
    <>
      <div>
        <h1>Plan the week. Shop once. Eat well.</h1>
        <p className="subhead">
          Keep meals, ingredients, and plans synced for everyone in your household.
        </p>
      </div>

      <section className="panel onboarding">
        <div className="panel-head">
          <h2>Welcome home</h2>
          <p>Start fresh or join a household already in progress.</p>
        </div>

        <div className="toggle">
          <Button
            className={onboardingMode === OnboardingMode.Create ? 'active' : ''}
            onClick={() => setOnboardingMode(OnboardingMode.Create)}
          >
            Create household
          </Button>
          <Button
            className={onboardingMode === OnboardingMode.Join ? 'active' : ''}
            onClick={() => setOnboardingMode(OnboardingMode.Join)}
          >
            Join household
          </Button>
        </div>

        {onboardingMode === OnboardingMode.Create ? (
          <div className="form-grid">
            <div>
              <label className="label">Household name</label>
              <input
                placeholder="The Sunday Table"
                value={householdName}
                onChange={(event) => setHouseholdName(event.target.value)}
              />
            </div>
            <Button className="primary" onClick={() => handleCreateHousehold(householdName)}>
              Create and get code
            </Button>
          </div>
        ) : (
          <div className="form-grid">
            <div>
              <label className="label">Household code</label>
              <input
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                value={joinCode}
                onChange={(event) => setJoinCode(event.target.value)}
              />
            </div>
            <Button className="primary" onClick={handleJoinHousehold}>
              Join household
            </Button>
          </div>
        )}
      </section>
    </>
  );
};
