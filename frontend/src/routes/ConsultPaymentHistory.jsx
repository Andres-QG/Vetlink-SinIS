import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ConsultView from "../components/Consult/ConsultView";
import getInvoiceTemplate from "../templates/invoiceTemplate";
import pdfMake from "pdfmake";

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

  const logoBase64 =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFUAAABVCAYAAAA49ahaAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAf9SURBVHgB7V1rVhpJFL63WpRIMmFWMMwKkqwguILRk5P4Sk50BTErUFegswLMSYTgH+MKQlYQZwUhKxhmFOQhVXNv85juFkhDV3Wh4TvHxC6hoD+q7+O7txoES0gdF7ZAiF1QmAZQadCPrerG6juwAAGWoIT4DRRkDBFKn5XKgiVYIxVBZeCOYg6mBqoEkYFZmAJMDanVjbUliIBkoZBxFH6DKYA9m6qEEVs6DbBnUxFmpM4QHjNSDeDOkopuDGwHs5VqADNSDWBGqgHMSDWAn47U1PHxYzAMo6Smjk+2UvmTv+8fF/dgCpDKF48A577e+5DfAYMwRqpLJKocS3sKYXexUNwFi3D1W4DX/LsQzoHJD9oIqfyGmUjfoAS7cMVw7yHsmiJWO6kDCVXqqLa5ug8WUX25dkgfrK8SYIpYraQOJhTOq5tr2zAFqL5c3YqDWG2kDiM00awN1kmVHeU/DmK1kDqK0Mr2dgWmDKaJjUzqbSO0B5dYgEPvmC5iI5Gazp2mp4XQ+vp6GcYElbDfKgV73jGX2PeFLERAJFIr2ytEHJ73B27BCg2CoxIfsXQOl6/WSxABkS//RCOx5FZCKWy6bYT24IZ7Ur1VAJ+GOtYxELma2lmtEPmN6AFWJm3OcONYsrE1iA6LggqWe7/RCimDHpQ9c1q7YqyRSmZjhe0xEyobUstKTzTaK52mDHU437iylnAg/8ONCBADJvHQupHO5dL1ZHIiE+FImUYxul/hmhYJpgonn8nJZCEGUDFu/3JzdQ9iRpoWTUs5X001w/mBJRFnuiixI73FjSaI1/EQCpx+PyabivF1iigdTWjjw0FxDnEBIT3n/QRdL6zrxBHT6JsbK/PNq7fekOV+oZCVSrxBeiy05Vk3rJkIqfzHHXrNN/RC7PUPvQ2/F2vPzxbd9HO8qxIRKgrxh1EEKlymuftlGqQSg+odKCTdcz0emY4JVUp89o5RirhXWx9fd3VVfRS5wHBsndSpwsccvfmt3rG9rj/AG/YVJ3SYCp0/bo79hJ3UOoEob1yidEmWwBLstVJeq8CliRXRln/CBAjOxb7B1iYKhjVSWQmiF+cM6JBVonaj/eTi1cYnmACuqqTwSS+b0pWhTQqr7ekXG6tM4kREBlHdfMFh01QIO9pIdbMWgGzvWKLzkBxPP6QSIL9crofTKXmuBjkfIVVG4eA4muauJBq1/bBS44N8cVmiHBqTtwFKutJobaQ2lXNAcely71go5fu7IlpJUV8KIwBTSnlKz3fjPgzM43vNhXsZcE3IaHTiYTgFNdzaORTfki7wuw49WJtNRU/wOwzXjqMgHDKgEUqGmE/jHgR9jkqqkZ6bPXJ948UXCDWXDJUAIGAoe5xoJj91BOzhUFS50FW10Eaqm2KSB24DZpUQbAa2+Pfez3yj9mScuche/tqWcxkIVDylUjs8zn8PGzZxdYK01ife99P/6c5V09jwodX7dz3wQNQHjHFbo0DMtBDPg06iu2oqi4ViBT1Ggx5fqW4++z5oPjf1JdNB9rhyseEPzyrb7vxlCPneosC3UuPcfNDpCpz7KsE5dZSTC/s8qYZLeK6WoESO51zMfzwFS7C4ixqfeo6yrMiHeR6KwSFW6vjE5yippBGjpOm31xa3UfoLc9dzyYHRAzmjjP+JMCTKaAfHY9NQSV2bElIFlLzH0hG5YK2MO7GJ/S3vGK3AZZIrfQoXJwu0hH2dMk3Vtpb7W0tTF64S71oLrb2eSI6ugxGfFwsnJRoruys0QKgHR/S4rPs4BemWq2X6bO15a3MzPrU/AOSe/P4b4ktSeNp4tN3ooFPjx+v2vjej4p4l5fiF6uFgseTH+/k5HibZb8Ubibj2VihzjitwyxIup7A96AxwVmGkstr5cJTj8H+l3igTTDn5igQ4gFFZFAXm3Dic+lA8IoM1oniIHH6t3AjtBM1vNLJRgZeLFTfDIVaqEizVEXEDn0GyYK8Tm9sfu81k5QGPLLF8OChWDjpF00AqiO1SgYsyIMyYLuNyNnS1uTY0nXUbHRZSjxxa2ZSVVeavLr8MSx2T+ZOngsIrKVUl2aj+NSrFHM/MRAQtDgzzOPdkE788hIiov3z2HSwh7DkkW//+cxs7F/vgE9W9A491U05XwSKsxakP3ueXWwupb5yqUtx5ABrAO/rI6Z1yump6V98oWCO17cx5W3F0EdCPDNARj2AMhE2TwyBy8M9vprWweEhBxVMqVyyFLUm4N6YJK1lPgHHEoU4DGyUe+SKMcw7DEHmlNhdSrDC97mVEcbVl6kRLCk4MMnwO4yhmwxCJVA5VvHWp20hsZ2e1V6QJr5gNQyRSOSMKbpm5TcS6hII/Q+PziRpSRb78Ozs7/LvnbgOx3U1o/pRX08ZkLd7fkz72Mc3E3j8+ORy001vXxmRtIdWNTV7wP7E6w5Wo4EteoXrjG9RIKENrnDqM2Nb8Yjx59wi42dsAG2pi67z24H8Qsexdbd/uo5VMcdh0g1AdO/yCMJJRDSJWSWVVpFDBm94a3PZpLE31Estq/ELzylrNiDFfn2fJsewedG2oKTXKaO7vEivEMnen2JbTOl0qckkK3DF9+xHjhb/a2vMzHZtodaDbpTJRt/Y4mN2WzgBmpBrAjFQDmJFqAHeGVL5JDkwJ7gyp9WR9RupdxoxUA7izpJJeWgZLmJovpEkVit/gjmB6vjrJ4pcd6MbMphqAPVLb8gwMQsn4ev6D+A+dP9lMFB0swQAAAABJRU5ErkJggg=="; // Agrega tu logo base64 aquí.

  const handleDownloadInvoice = (item) => {
    const docDefinition = getInvoiceTemplate(item, logoBase64);
    pdfMake.createPdf(docDefinition).download(`Factura_${item.factura_id}.pdf`);
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
      hideActions={false}
      hideAddButton={true}
      onDownload={handleDownloadInvoice}
      disableDownloadAction={false}
    />
  );
};

export default ConsultPaymentHistory;
