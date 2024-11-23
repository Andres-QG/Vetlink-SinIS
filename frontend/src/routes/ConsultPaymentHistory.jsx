import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ConsultView from "../components/Consult/ConsultView";

const ConsultPaymentHistory = () => {
  const rowsPerPage = 7;
  const columns = [
    { field: "factura_id", headerName: "Factura ID", type: "text" },
    { field: "usuario_cliente", headerName: "Cliente", type: "text" },
    { field: "clinica_nombre", headerName: "Clínica", type: "text" }, // Nueva columna para el nombre de la clínica
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

  return (
    <ConsultView
      title="Historial de Pagos"
      fetchUrl="http://localhost:8000/api/consult-payment-history/"
      rowsPerPage={rowsPerPage}
      columns={columns}
      pkCol="factura_id"
      visualIdentifierCol="usuario_cliente"
      customDeleteTitle={"¿Estás seguro de que deseas eliminar este registro?"}
      disableAddButton={true} // No se pueden agregar registros desde la vista
      disableModifyAction={true} // No se permite modificar el historial de pagos
      disableDeleteAction={true} // No se permite eliminar pagos
      disableReactivateAction={true} // No se permite reactivar pagos
      hideActions={true}
      hideAddButton={true}
    />
  );
};

export default ConsultPaymentHistory;
