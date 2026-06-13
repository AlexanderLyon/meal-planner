import './card.css';

interface ICardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  condensed?: boolean;
}

export const Card: React.FC<ICardProps> = (props) => {
  return (
    <div
      {...props}
      className={`card ${props.condensed ? 'condensed' : ''} ${props.className || ''}`}
    >
      {props.title || props.subtitle ? (
        <div className="card-head">
          {props.title ? <h2>{props.title}</h2> : null}
          {props.subtitle ? <p>{props.subtitle}</p> : null}
        </div>
      ) : null}
      {props.children}
    </div>
  );
};
