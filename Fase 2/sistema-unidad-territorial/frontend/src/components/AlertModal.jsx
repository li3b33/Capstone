function AlertModal({ isOpen, type, title, message, onConfirm, onCancel, confirmText = 'Aceptar' }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={type === 'alert' ? onConfirm : undefined}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
        <h2 style={{ color: type === 'error' ? '#dc2626' : type === 'warning' ? '#d97706' : '#1e3a8a' }}>
          {title}
        </h2>
        
        <p style={{ color: '#4b5563', marginTop: '1rem', marginBottom: '2rem', fontSize: '0.95rem' }}>
          {message}
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          {type === 'confirm' && (
            <button className="btn-cerrar-modal" onClick={onCancel} style={{ flex: 1 }}>
              Cancelar
            </button>
          )}
          <button 
            className={type === 'error' ? 'btn-logout' : 'btn-primary'} 
            onClick={onConfirm} 
            style={{ flex: 1, justifyContent: 'center' }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AlertModal;