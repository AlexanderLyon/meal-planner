import { useState, useEffect } from 'react';
import { useHousehold } from '@context/useHousehold';
import { Card } from '@components/Card';
import { Button } from '@components/Button';

const ShareIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1.2rem"
    height="1.2rem"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8 9h-1a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-8a2 2 0 0 0 -2 -2h-1" />
    <path d="M12 14v-11" />
    <path d="M9 6l3 -3l3 3" />
  </svg>
);

export const ShareCode: React.FC = () => {
  const { household, leaveHousehold } = useHousehold();
  const [isCopied, setIsCopied] = useState(false);
  const shareData = {
    title: `Join ${household?.name || 'me'} on Meal Planner!`,
    url: `${window.location.origin}?code=${household?.id}`,
  };

  const handleShare = (): void => {
    if (!household?.id) return;
    window.navigator.share(shareData);
  };

  const handleCopy = (): void => {
    if (!household?.id) return;
    navigator.clipboard.writeText(household.id);
    setIsCopied(true);
  };

  useEffect(() => {
    if (!isCopied) return;

    const timeout = setTimeout(() => setIsCopied(false), 3000);
    return () => clearTimeout(timeout);
  }, [isCopied]);

  if (!household) return null;

  return (
    <Card>
      <div className="household-card">
        <strong className="household-label">{household.name}</strong>
        <span className="household-code">{household.id} </span>
        <p className="muted">Share this code to invite others.</p>
        <span className="share-actions">
          <span className="share-actions__secondary">
            {navigator.canShare(shareData) && (
              <Button className="ghost share-btn" onClick={handleShare}>
                <ShareIcon /> Share invite link
              </Button>
            )}
            <Button className="ghost" onClick={handleCopy}>
              {isCopied ? 'Copied to clipboard!' : 'Copy share code'}
            </Button>
          </span>
          <Button className="share-actions__logout" onClick={leaveHousehold}>
            Log out of current household
          </Button>
        </span>
      </div>
    </Card>
  );
};
