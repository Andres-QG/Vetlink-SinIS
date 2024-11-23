import pdfMake from "pdfmake/build/pdfmake";

// Configuración de las fuentes desde URLs
pdfMake.fonts = {
  Roboto: {
    normal:
      "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf",
    bold: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf",
    italics:
      "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf",
    bolditalics:
      "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf",
  },
};

const getInvoiceTemplate = (invoiceData, logoBase64) => {
  const {
    factura_id,
    usuario_cliente,
    clinica_nombre,
    monto_total,
    detalle,
    fecha,
  } = invoiceData;

  // Convertir monto_total a un número válido
  const total = parseFloat(String(monto_total).replace(/[^0-9.-]+/g, "")) || 0;

  return {
    content: [
      // Encabezado con logo, título y número de factura
      {
        columns: [
          {
            stack: [
              {
                columns: [
                  {
                    image: logoBase64,
                    width: 60,
                    margin: [0, 0, 10, 0],
                  },
                  {
                    text: "VetLink",
                    fontSize: 28,
                    bold: true,
                    color: "#00308f",
                    margin: [10, 15, 0, 0], // Alineación vertical con margen
                  },
                ],
              },
            ],
            alignment: "left",
          },
          {
            text: `Factura ${factura_id}`,
            alignment: "right",
            fontSize: 14,
            bold: true,
            color: "#00308f",
            margin: [0, 25, 0, 0], // Alineación vertical con margen
          },
        ],
        columnGap: 20, // Espaciado entre logo+título y número de factura
        margin: [0, 0, 0, 20],
      },
      // Información del remitente y cliente
      {
        columns: [
          {
            text: [
              { text: "De:\n", bold: true, fontSize: 12 },
              `${clinica_nombre}\nTeléfono: +506 8888-8888\nEmail: VetLink@gmail.com`,
            ],
          },
          {
            text: [
              { text: "Para:\n", bold: true, fontSize: 12 },
              `${usuario_cliente}\nFecha: ${fecha}`,
            ],
            alignment: "right",
          },
        ],
        margin: [0, 0, 0, 20],
      },
      // Título de la tabla de detalles
      {
        text: "Detalles de la Factura",
        style: "sectionHeader",
        margin: [0, 20, 0, 10],
      },
      // Tabla de detalles de la factura
      {
        table: {
          headerRows: 1,
          widths: ["*", "auto", "auto", "auto"],
          body: [
            [
              { text: "Descripción", style: "tableHeader" },
              { text: "Cantidad", style: "tableHeader" },
              { text: "Valor Unitario", style: "tableHeader" },
              { text: "Total", style: "tableHeader" },
            ],
            [detalle, "1", total.toFixed(2), total.toFixed(2)],
          ],
        },
        layout: "lightHorizontalLines",
      },
      // Total de la factura
      {
        text: `Total: ${total.toFixed(2)}`,
        style: "total",
        alignment: "right",
        margin: [0, 20, 0, 0],
      },
      // Mensaje de agradecimiento
      {
        text: "Gracias por confiar en VetLink. ¡Esperamos verte pronto!",
        style: "footer",
        alignment: "center",
        margin: [0, 50, 0, 0],
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10],
      },
      sectionHeader: {
        fontSize: 16,
        bold: true,
        color: "#00308f",
      },
      tableHeader: {
        bold: true,
        fontSize: 12,
        color: "white",
        fillColor: "#00308f",
      },
      total: {
        fontSize: 14,
        bold: true,
        color: "#00308f",
      },
      footer: {
        fontSize: 10,
        color: "#555",
      },
    },
    defaultStyle: {
      font: "Roboto", // Especifica la fuente predeterminada
    },
  };
};

export default getInvoiceTemplate;
