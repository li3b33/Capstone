const PDFDocument = require('pdfkit');

function generarCertificadoPDF(certificado, usuario, junta, directorio) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'LETTER',
        margin: 50,
      });

      const chunks = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // ==========================================
      // ENCABEZADO
      // ==========================================
      doc.font('Helvetica-Bold').fontSize(11).text(
        `JUNTA DE VECINOS "${junta.nombre}"`,
        { align: 'center' }
      );
      doc.moveDown(0.3);
      doc.font('Helvetica').fontSize(11).text(
        `${junta.comuna}, comuna de ${junta.comuna}, región Los Lagos`,
        { align: 'center' }
      );

      doc.moveDown(2);

      // ==========================================
      // TÍTULO
      // ==========================================
      doc.font('Helvetica-Bold').fontSize(13).text('CERTIFICADO DE RESIDENCIA', {
        align: 'center',
      });

      doc.moveDown(2);

      // ==========================================
      // CUERPO - PRIMERA PARTE
      // ==========================================
      const presidente = directorio.find((d) => d.cargo === 'presidente') || {};
      const nombrePresidente = presidente.nombres
        ? `${presidente.nombres} ${presidente.apellidos}`
        : '_________________';
      const rutPresidente = presidente.rut || '_________________';

      doc.font('Helvetica').fontSize(11);
      doc.text(
        `${nombrePresidente}, Cédula Nacional de Identidad N° ${rutPresidente}, en calidad de Presidente de`,
        { align: 'justify' }
      );
      doc.text(
        `la Junta de Vecinos denominada ${junta.nombre}, de la comuna de ${junta.comuna}.`,
        { align: 'justify' }
      );

      doc.moveDown(1.5);

      // ==========================================
      // "CERTIFICA"
      // ==========================================
      doc.font('Helvetica-Bold').fontSize(11).text('CERTIFICA', { align: 'center' });

      doc.moveDown(1.5);

      // ==========================================
      // CUERPO - SEGUNDA PARTE (datos del vecino)
      // ==========================================
      doc.font('Helvetica').fontSize(11);
      const nombreVecino = `${usuario.nombres} ${usuario.apellidos}`;
      const rutVecino = usuario.rut;
      const direccionVecino = certificado.direccion_certificada || usuario.direccion;

      const textoCuerpo =
        `Que, ${nombreVecino}, Cédula Nacional de Identidad N° ${rutVecino}, ` +
        `registra su domicilio particular en ${direccionVecino}, comuna de ${junta.comuna}, ` +
        `región Los Lagos, ubicado en el territorio donde esta Junta de Vecinos ` +
        `desarrolla sus funciones.`;

      doc.text(textoCuerpo, {
        align: 'justify',
        lineGap: 4,
      });

      doc.moveDown(1.5);

      doc.text(
        `Se extiende el presente certificado a petición de la persona interesada para postular a créditos financieros o bancarios.`,
        { align: 'justify', lineGap: 4 }
      );

      // ==========================================
      // FIRMA
      // ==========================================
      const firmaY = doc.page.height - 200;

      doc.font('Helvetica').fontSize(10);
      doc.text('__________________________________', 0, firmaY, { align: 'center' });
      doc.moveDown(0.3);
      doc.text('(firma)', { align: 'center' });

      doc.moveDown(1.5);
      doc.font('Helvetica-Bold').fontSize(11).text('FIRMA PRESIDENTE', { align: 'center' });
      doc.font('Helvetica').fontSize(10).text(`Cédula Nacional de Identidad N° ${rutPresidente}`, {
        align: 'center',
      });

      // ==========================================
      // PIE DE PÁGINA
      // ==========================================
      doc.font('Helvetica').fontSize(10);
      doc.text(
        `Puerto Montt, ${new Date(certificado.fecha_emision || Date.now()).toLocaleDateString('es-CL', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}`,
        0,
        doc.page.height - 100,
        { align: 'right' }
      );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { generarCertificadoPDF };