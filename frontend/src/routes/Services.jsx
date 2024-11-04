import React, { useState, useEffect } from "react";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import Services_Gallery from "../components/Services_Gallery";

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/consult-services/"
        );
        // console.log(response.data.results);
        // Filtrar solo servicios activos
        const activeServices = response.data.results.filter(
          (service) => service.activo
        );
        setServices(activeServices);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const formatDuration = (minutes) => {
    if (!minutes) return "Variable";
    if (minutes < 60) return `${minutes} minutos`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) return `${hours} hora${hours > 1 ? "s" : ""}`;
    return `${hours} hora${hours > 1 ? "s" : ""} y ${remainingMinutes} minutos`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className="text-elemsec body-font">
          <div className="container px-5 py-24 mx-auto">
            <div className="flex flex-col w-full mb-20 text-center">
              <h1 className="mb-4 text-2xl font-semibold sm:text-3xl title-font font-montserrat text-secondary">
                Nuestros servicios
              </h1>
              <p className="mx-auto text-base leading-relaxed lg:w-2/3 font-montserrat">
                En VetLink nos preocupamos por el bienestar de nuestros amigos
                peludos, por eso contamos con una alta variedad de servicios
                para cuidarlos como se merecen.
              </p>
            </div>
            {loading ? (
              <div className="flex justify-center">
                <CircularProgress />
              </div>
            ) : (
              <div className="flex flex-wrap -m-8">
                {services.map((service) => (
                  <Services_Gallery
                    key={service.servicio_id}
                    className=""
                    title={service.nombre}
                    text={service.descripcion}
                    imageSrc={
                      service.imagen || "./src/assets/img/default_service.jpg"
                    }
                    price={`Costo: ${service.costo ? `${service.costo} CRC` : "Variable"}`}
                    duration={
                      service.minutos_sesion
                        ? formatDuration(service.minutos_sesion)
                        : "Variable"
                    }
                    number_of_sessions={service.numero_sesiones || "Variable"}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Services;
