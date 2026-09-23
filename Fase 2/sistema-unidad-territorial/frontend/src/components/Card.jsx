function Card({ titulo, descripcion, icono, onClick }) {
  return (
    <div className="card" onClick={onClick}>
      {icono && <div className="card-icon">{icono}</div>}
      <h3>{titulo}</h3>
      {descripcion && <p>{descripcion}</p>}
    </div>
  );
}

export default Card;