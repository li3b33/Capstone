const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false, // true para 465, false para 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ============================================
// EMAIL: CERTIFICADO APROBADO
// ============================================
const enviarCertificadoAprobado = async (usuario, certificado) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: usuario.correo,
    subject: `✅ Tu certificado de residencia ha sido aprobado (Folio: ${certificado.folio})`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #065f46;">¡Tu certificado ha sido aprobado!</h2>
        <p>Hola <strong>${usuario.nombres} ${usuario.apellidos}</strong>,</p>
        <p>Tu solicitud de certificado de residencia ha sido <strong style="color: #065f46;">APROBADA</strong>.</p>
        
        <div style="background: #f3f4f6; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
          <p style="margin: 0.25rem 0;"><strong>Folio:</strong> ${certificado.folio}</p>
          <p style="margin: 0.25rem 0;"><strong>Dirección certificada:</strong> ${certificado.direccion_certificada}</p>
          <p style="margin: 0.25rem 0;"><strong>Fecha de emisión:</strong> ${new Date(certificado.fecha_emision).toLocaleDateString('es-CL')}</p>
        </div>
        
        <p>Puedes descargar tu certificado desde el sistema:</p>
        <p><a href="${process.env.FRONTEND_URL}/mis-certificados" style="background: #2563eb; color: white; padding: 0.75rem 1.5rem; text-decoration: none; border-radius: 8px; display: inline-block;">Ver mis certificados</a></p>
        
        <p style="color: #6b7280; font-size: 0.875rem; margin-top: 2rem;">
          Junta de Vecinos<br>
          Sistema Unidad Territorial
        </p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

// ============================================
// EMAIL: CERTIFICADO RECHAZADO
// ============================================
const enviarCertificadoRechazado = async (usuario, certificado, motivo) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: usuario.correo,
    subject: `❌ Tu solicitud de certificado no fue aprobada`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #991b1b;">Solicitud no aprobada</h2>
        <p>Hola <strong>${usuario.nombres} ${usuario.apellidos}</strong>,</p>
        <p>Tu solicitud de certificado de residencia ha sido <strong style="color: #991b1b;">RECHAZADA</strong>.</p>
        
        <div style="background: #fee2e2; padding: 1rem; border-radius: 8px; margin: 1rem 0; border-left: 4px solid #991b1b;">
          <p style="margin: 0.25rem 0;"><strong>Motivo:</strong></p>
          <p style="margin: 0.25rem 0;">${motivo}</p>
        </div>
        
        <p>Si crees que es un error, puedes contactar al directorio de la junta de vecinos.</p>
        
        <p style="color: #6b7280; font-size: 0.875rem; margin-top: 2rem;">
          Junta de Vecinos<br>
          Sistema Unidad Territorial
        </p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

// ============================================
// EMAIL: PROYECTO APROBADO
// ============================================
const enviarProyectoAprobado = async (usuario, proyecto) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: usuario.correo,
    subject: `✅ Tu proyecto ha sido aprobado: ${proyecto.titulo}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #065f46;">¡Tu proyecto ha sido aprobado!</h2>
        <p>Hola <strong>${usuario.nombres} ${usuario.apellidos}</strong>,</p>
        <p>Tu proyecto <strong>${proyecto.titulo}</strong> ha sido <strong style="color: #065f46;">APROBADO</strong> por el directorio.</p>

        <div style="background: #f3f4f6; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
          <p style="margin: 0.25rem 0;"><strong>Título:</strong> ${proyecto.titulo}</p>
          <p style="margin: 0.25rem 0;"><strong>Presupuesto estimado:</strong> $${Number(proyecto.presupuesto_estimado).toLocaleString('es-CL')}</p>
        </div>

        <p>Pronto el directorio se contactará contigo para coordinar la ejecución.</p>

        <p style="color: #6b7280; font-size: 0.875rem; margin-top: 2rem;">
          Junta de Vecinos<br>
          Sistema Unidad Territorial
        </p>
      </div>
    `,
  };
  return transporter.sendMail(mailOptions);
};

// ============================================
// EMAIL: PROYECTO RECHAZADO
// ============================================
const enviarProyectoRechazado = async (usuario, proyecto, motivo) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: usuario.correo,
    subject: `❌ Tu proyecto no fue aprobado: ${proyecto.titulo}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #991b1b;">Proyecto no aprobado</h2>
        <p>Hola <strong>${usuario.nombres} ${usuario.apellidos}</strong>,</p>
        <p>Tu proyecto <strong>${proyecto.titulo}</strong> ha sido <strong style="color: #991b1b;">RECHAZADO</strong>.</p>

        <div style="background: #fee2e2; padding: 1rem; border-radius: 8px; margin: 1rem 0; border-left: 4px solid #991b1b;">
          <p style="margin: 0.25rem 0;"><strong>Motivo:</strong></p>
          <p style="margin: 0.25rem 0;">${motivo}</p>
        </div>

        <p>Si crees que es un error, puedes contactar al directorio de la junta de vecinos.</p>

        <p style="color: #6b7280; font-size: 0.875rem; margin-top: 2rem;">
          Junta de Vecinos<br>
          Sistema Unidad Territorial
        </p>
      </div>
    `,
  };
  return transporter.sendMail(mailOptions);
};

module.exports = {
  enviarCertificadoAprobado,
  enviarCertificadoRechazado,
  enviarProyectoAprobado,
  enviarProyectoRechazado,
};