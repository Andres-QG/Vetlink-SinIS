import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

import Services_Gallery from "../components/Services_Gallery";
import Loading from "../components/Loading";

function Services() {
  const { fetchUserRole } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      await fetchUserRole();
      setIsLoading(false);
    };
    fetchRole();
  }, [fetchUserRole]);

  if (isLoading) {
    return <Loading text={"Cargando Servicios"}/>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <section className="text-elemsec body-font">
          <div className="container px-5 py-24 mx-auto">
            <div className="flex flex-col text-center w-full mb-20">
              <h1 className="sm:text-3xl text-2xl font-semibold title-font font-montserrat mb-4 text-secondary">
                Nuestros servicios
              </h1>
              <p className="lg:w-2/3 mx-auto leading-relaxed text-base font-montserrat">
                En VetLink nos preocupamos por el bienestar de nuestros amigos
                peludos, por eso contamos con una alta variedad de servicios
                para cuidarlos como se merecen, justo como ellos nos cuidan con
                su amor cada día.
              </p>
            </div>
            <div className="flex flex-wrap -m-8">
              {/* Cada uno de estos es un cuadrito más */}
              <Services_Gallery
                // ClassName es por si se le desea agregar otro atributo de clase aparte del default
                className=""
                title="Medicina Interna"
                subtitle=""
                text="Ofrecemos atención integral para enfermedades internas en mascotas, incluyendo diagnóstico y tratamiento de condiciones como diabetes, enfermedades respiratorias y trastornos gastrointestinales."
                imageSrc="./src/assets/img/Services_medicina_interna.jpg"
              />
              <Services_Gallery
                className=""
                title="Laboratorio"
                subtitle=""
                text="Contamos con un laboratorio completamente equipado para realizar análisis clínicos, pruebas de sangre y exámenes de orina, lo que nos permite obtener resultados rápidos y precisos para un diagnóstico efectivo."
                imageSrc="./src/assets/img/Services_laboratorio.jpg"
              />
              <Services_Gallery
                className=""
                title="Rayos X"
                subtitle=""
                text="Nuestra tecnología de rayos X de última generación permite obtener imágenes detalladas del interior de su mascota, facilitando la detección de fracturas, tumores y otras anomalías."
                imageSrc="./src/assets/img/Services_RayosX.jpg"
              />
              <Services_Gallery
                className=""
                title="Ultrasonido"
                subtitle=""
                text="Realizamos estudios de ultrasonido para evaluar órganos internos y tejidos blandos, siendo una herramienta clave para diagnósticos en tiempo real sin necesidad de cirugía."
                imageSrc="./src/assets/img/Services_Ultrasonido.jpg"
              />
              <Services_Gallery
                className=""
                title="Cirugía"
                subtitle=""
                text="Ofrecemos una amplia gama de procedimientos quirúrgicos, desde operaciones de rutina hasta cirugías más complejas, siempre con el máximo cuidado y atención a la recuperación de su mascota."
                imageSrc="./src/assets/img/Services_Cirugia.jpg"
              />
              <Services_Gallery
                className=""
                title="Limpieza Dental"
                subtitle=""
                text="Brindamos servicios de limpieza dental profesional para mantener la salud bucal de su mascota, previniendo enfermedades periodontales y mejorando su bienestar general."
                imageSrc="./src/assets/img/Services_Limpieza_Dental.jpg"
              />
              <Services_Gallery
                className=""
                title="Internamiento"
                subtitle=""
                text="Contamos con instalaciones adecuadas para el internamiento de mascotas que requieren atención constante, garantizando un ambiente seguro y cómodo durante su recuperación."
                imageSrc="./src/assets/img/Services_Internamiento.jpg"
              />
              <Services_Gallery
                className=""
                title="Ortopedia"
                subtitle=""
                text="Ofrecemos atención especializada en ortopedia para tratar lesiones y enfermedades del sistema musculoesquelético, asegurando una recuperación efectiva y el bienestar de su mascota."
                imageSrc="./src/assets/img/Services_Ortopedia.jpg"
              />
              <Services_Gallery
                className=""
                title="Grooming"
                subtitle=""
                text="Nuestro servicio de grooming incluye baños, cortes de pelo y cuidados estéticos, ayudando a mantener la higiene y apariencia de su mascota, además de contribuir a su salud general."
                imageSrc="./src/assets/img/Services_Grooming.jpg"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
export default Services;
