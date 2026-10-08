function Card({ titulo, descripcion, icono, onClick }) {
  const contenido = (
    <>
      {icono && <div className="card-icon">{icono}</div>}
      <h3>{titulo}</h3>
      {descripcion && <p>{descripcion}</p>}
    </>
  );

  // Si tiene onClick, usar button (accesible por teclado)
  if (onClick) {
    return (
      <button type="button" className="card card-button" onClick={onClick}>
        {contenido}
      </button>
    );
  }

  // Si no, usar div normal
  return <div className="card">{contenido}</div>;
}

export default Card;