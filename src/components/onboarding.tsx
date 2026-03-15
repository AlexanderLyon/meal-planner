import { useState } from 'react';
import { Button } from '@components/button';
import { useHousehold } from '@context/useHousehold';

const OnboardingMode = {
  Create: 'create',
  Join: 'join',
} as const;

type OnboardingMode = (typeof OnboardingMode)[keyof typeof OnboardingMode];

export const Onboarding: React.FC = () => {
  const { setHouseholdCode } = useHousehold();
  const [onboardingMode, setOnboardingMode] = useState<OnboardingMode>(OnboardingMode.Create);
  const [generatedCode, setGeneratedCode] = useState('');
  const [joinCode, setJoinCode] = useState('');

  const createHouseholdCode = () => Math.random().toString(36).slice(2, 8).toUpperCase();

  const handleCreateHousehold = () => {
    const code = createHouseholdCode();
    setGeneratedCode(code);
    setHouseholdCode(code);
  };

  const handleJoinHousehold = () => {
    const sanitized = joinCode.trim().toUpperCase();
    if (!sanitized) return;
    setHouseholdCode(sanitized);
  };

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
              <input placeholder="The Sunday Table" />
            </div>
            <Button className="primary" onClick={handleCreateHousehold}>
              Create and get code
            </Button>
            {generatedCode ? <p className="pill">Your code: {generatedCode}</p> : null}
          </div>
        ) : (
          <div className="form-grid">
            <div>
              <label className="label">Household code</label>
              <input
                placeholder="AB12CD"
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
