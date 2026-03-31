import './Card.css'

function Card({ icon, title, description, items }) {
  return (
    <div className="card">
      <div className="card-header">
        {icon && <div className="card-icon">{icon}</div>}
        <h3 className="card-title">{title}</h3>
      </div>
      {description && <p className="card-description">{description}</p>}
      {items && (
        <ul className="card-list">
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Card;
