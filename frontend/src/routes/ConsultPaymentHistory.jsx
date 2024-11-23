import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ConsultView from "../components/Consult/ConsultView";
import axios from "axios";
import { saveAs } from "file-saver"; // Importamos file-saver para manejar la descarga

const ConsultPaymentHistory = () => {
  const rowsPerPage = 7;
  const columns = [
    { field: "factura_id", headerName: "Factura ID", type: "text" },
    { field: "usuario_cliente", headerName: "Cliente", type: "text" },
    { field: "clinica_nombre", headerName: "Clínica", type: "text" },
    { field: "tipo_pago", headerName: "Tipo de Pago", type: "text" },
    { field: "monto_total", headerName: "Monto Total", type: "number" },
    { field: "fecha", headerName: "Fecha de Pago", type: "date" },
    {
      field: "estado",
      headerName: "Estado",
      type: "chip",
      chipColors: {
        Exitoso: "#b8e6d7",
        Pendiente: "#ffe4b3",
        Fallido: "#ff7c7d",
      },
    },
  ];

  /** Función para manejar la descarga de la factura */
  const handleDownloadInvoice = async (item) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/generate-invoice/${item.factura_id}/`,
        {
          responseType: "blob", // Para manejar blobs (archivos)
          withCredentials: true, // Si tu API requiere autenticación
        }
      );

      // Crear una URL para el blob y descargarlo
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Factura_${item.factura_id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error al descargar la factura:", error);
      // Puedes mostrar una notificación de error si lo deseas
    }
  };

  return (
    <ConsultView
      title="Historial de Pagos"
      fetchUrl="http://localhost:8000/api/consult-payment-history/"
      rowsPerPage={rowsPerPage}
      columns={columns}
      pkCol="factura_id"
      visualIdentifierCol="usuario_cliente"
      customDeleteTitle={"¿Estás seguro de que deseas eliminar este registro?"}
      disableAddButton={true}
      disableModifyAction={true}
      disableDeleteAction={true}
      disableReactivateAction={true}
      hideActions={false} // Mostramos las acciones para incluir el botón de descarga
      hideAddButton={true}
      /** Pasamos los nuevos props */
      onDownload={handleDownloadInvoice}
      disableDownloadAction={false} // Habilitamos el botón de descarga
    />
  );
};

export default ConsultPaymentHistory;
