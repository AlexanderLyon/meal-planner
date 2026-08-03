import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const SkeletonLoader: React.FC<{ count?: number; height?: number | string }> = ({
  count = 1,
  height = 20,
}) => {
  return (
    <Skeleton
      className="skeleton-loader"
      count={count}
      height={height}
      baseColor="var(--surface)"
    />
  );
};
