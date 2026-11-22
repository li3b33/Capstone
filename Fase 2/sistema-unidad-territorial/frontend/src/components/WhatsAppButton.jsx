import { MessageCircle } from 'lucide-react';

function WhatsAppButton({ telefono, mensaje }) {
  if (!telefono) return null;

  // Limpiamos el teléfono (dejamos solo números)
  let numeroLimpio = telefono.replace(/\D/g, '');
  
  // Si el número tiene 9 dígitos y empieza con 9 (celular chileno), le agregamos el 56
  if (numeroLimpio.length === 9 && numeroLimpio.startsWith('9')) {
    numeroLimpio = `56${numeroLimpio}`; 
  } 
  // Si empieza con 0, lo quitamos y ponemos el 56
  else if (numeroLimpio.startsWith('0')) {
    numeroLimpio = `56${numeroLimpio.substring(1)}`;
  }

  // Codificamos el mensaje para la URL
  const mensajeCodificado = encodeURIComponent(mensaje);
  const urlWhatsApp = `https://wa.me/${numeroLimpio}?text=${mensajeCodificado}`;

  return (
    <a 
      href={urlWhatsApp} 
      target="_blank" 
      rel="noopener noreferrer"
      className="btn-accion"
      style={{ 
        background: '#25D366', 
        color: 'white', 
        textDecoration: 'none', 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '0.4rem',
        marginTop: '0.5rem',
        fontWeight: '600'
      }}
      title="Notificar por WhatsApp"
    >
      <MessageCircle size={14} /> WhatsApp
    </a>
  );
}

export default WhatsAppButton;