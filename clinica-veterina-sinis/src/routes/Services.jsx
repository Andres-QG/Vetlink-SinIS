import Header from "../components/Header";
import Footer from "../components/Footer";

import Services_Gallety from "../components/Services_Gallety";
function Services() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <section className="text-gray-600 body-font">
          <div className="container px-5 py-24 mx-auto">
            <div className="flex flex-col text-center w-full mb-20">
              <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
                Nuestros servicios
              </h1>
              <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
                En PetLink nos preocupamos por el bienestar de nuestros amigos
                peludos, por eso contamos con una alta variedad de servicios
                para cudiarlos como se merecen, justo como ellos nos cuidan con
                su amor cada día.
              </p>
            </div>
            <div className="flex flex-wrap -m-8">
              {/* Cada uno de estos es un cuadrito más */}
              <Services_Gallety
                // ClassName es por si se le desea agregar otro atributo de clase aparte del default
                className=""
                title="Medicina Interna"
                subtitle=""
                text="Ofrecemos atención integral para enfermedades internas en mascotas, incluyendo diagnóstico y tratamiento de condiciones como diabetes, enfermedades respiratorias y trastornos gastrointestinales."
                imageSrc="./src/assets/img/Services_medicina_interna.jpg"
              />
              <Services_Gallety
                className=""
                title="Laboratorio"
                subtitle=""
                text="Contamos con un laboratorio completamente equipado para realizar análisis clínicos, pruebas de sangre y exámenes de orina, lo que nos permite obtener resultados rápidos y precisos para un diagnóstico efectivo."
                imageSrc="./src/assets/img/Services_laboratorio.jpg"
              />
              <Services_Gallety
                className=""
                title="Rayos X"
                subtitle=""
                text="Nuestra tecnología de rayos X de última generación permite obtener imágenes detalladas del interior de su mascota, facilitando la detección de fracturas, tumores y otras anomalías."
                imageSrc="./src/assets/img/Services_RayosX.jpg"
              />
              <Services_Gallety
                className=""
                title="Ultrasonido"
                subtitle=""
                text="Realizamos estudios de ultrasonido para evaluar órganos internos y tejidos blandos, siendo una herramienta clave para diagnósticos en tiempo real sin necesidad de cirugía."
                imageSrc="./src/assets/img/Services_Ultrasonido.jpg"
              />
              <Services_Gallety
                className=""
                title="Cirugía"
                subtitle=""
                text="Ofrecemos una amplia gama de procedimientos quirúrgicos, desde operaciones de rutina hasta cirugías más complejas, siempre con el máximo cuidado y atención a la recuperación de su mascota."
                imageSrc="./src/assets/img/Services_Cirugia.jpg"
              />
              <Services_Gallety
                className=""
                title="Limpieza Dental"
                subtitle=""
                text="Brindamos servicios de limpieza dental profesional para mantener la salud bucal de su mascota, previniendo enfermedades periodontales y mejorando su bienestar general."
                imageSrc="./src/assets/img/Services_Limpieza_Dental.jpg"
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
