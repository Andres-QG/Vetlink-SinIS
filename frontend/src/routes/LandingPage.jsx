import Accordion from "../components/Accordion";

import vetlinkTextIconLogo from "../assets/icons/vetlink-full-logo.png";
import vetlinkFaceLogo from "../assets/icons/vetlink-logo-face.png";
import heroImage from "../assets/img/hero_dog.jpg";
import feature1 from "../assets/img/feature1.jpg";
import feature2 from "../assets/img/feature2.jpg";
import feature3 from "../assets/img/feature3.jpg";
import whoAreWe from "../assets/img/who_are_we.jpg";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  const faqs = [
    {
      title: "¿Qué información se almacena sobre mi mascota en este sistema?",
      content:
        "Se almacena información básica de tu mascota, como su nombre,especie, raza, edad, sexo, peso, padecimientos y vacunaciones. Esto ayuda a los veterinarios a ofrecer un mejor servicio y atención médica.",
    },
    {
      title: "¿Puedo acceder al historial médico de mi mascota?",
      content:
        "Actualmente, el sistema está diseñado para ser usado por veterinarios y administradores de la clínica. Si deseas acceder al historial médico de tu mascota, puedes solicitarlo directamente a tu clínica veterinaria, que podrá proporcionarte la información.",
    },
    {
      title: "¿Cómo protege el sistema mi información y la de mi mascota?",
      content:
        "La seguridad de la información es una prioridad. Todos los datos personales y médicos se almacenan de forma segura, cumpliendo con los estándares de protección de datos.",
    },
    {
      title: "¿Puedo actualizar los datos de mi mascota en el sistema?",
      content:
        "Para actualizar los datos de tu mascota, puedes comunicarte con tu clínica veterinaria. Ellos podrán realizar las modificaciones necesarias en el sistema.",
    },
    {
      title: "¿Este sistema permite teleconsultas o consultas en línea?",
      content:
        "De momento, el sistema está diseñado para gestionar la información interna de la clínica, por lo que no se ofrecen consultas en línea.",
    },
    {
      title: "¿Qué sucede si cambio de clínica veterinaria?",
      content:
        "Si decides cambiar de clínica, puedes solicitar que te proporcionen una copia del historial médico de tu mascota para que lo lleves a tu nueva veterinaria. Sin embargo si el cambio de clínica es dentro alguna de nuestras clínicas entonces el cambio se hará de forma automática al solicitar el cambio.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero section */}
        <section
          className="relative flex items-center w-full text-white bg-no-repeat bg-cover font-montserrat"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundPosition: "center calc(30%)",
            marginTop: 0,
            paddingTop: 0,
          }}
        >
          <div className="container relative z-10 flex flex-col items-center py-16 mx-auto lg:flex-row lg:items-start">
            {/* Hero contents */}
            <div className="px-1 text-center lg:w-1/2 lg:text-left">
              {/* Logo and text*/}
              <div className="z-0 mb-8 lg:mb-16">
                <img
                  src={vetlinkTextIconLogo}
                  alt="Vetlink Logo"
                  className="mx-auto lg:mx-0 lg:w-[700px] lg:h-[180px] xl:w-[800px] xl:h-[200px] md:w-[400px] md:h-[120px] sm:w-[300px] sm:h-[100px]"
                />
              </div>
              <h1 className="mb-4 text-4xl font-semibold lg:text-6xl xl:text-7xl text-bgsecondary">
                Cuida a tu mascota sin complicaciones
              </h1>
              <p className="mb-8 text-lg lg:text-xl xl:text-2xl text-bgsecondary">
                Regístrate y mantén todo bajo control desde nuestra plataforma.
              </p>
              {/* Action button */}
              <a
                href="#"
                className="px-4 py-2 text-lg font-semibold rounded-lg bg-brand text-bgsecondary lg:py-3 xl:py-4 lg:px-8 xl:px-10 lg:text-xl xl:text-2xl hover:bg-teal-600"
                onClick={() => navigate("/signup")}
              >
                Regístrate ahora
              </a>
            </div>
          </div>
        </section>
        {/*Main features section*/}
        <section className="font-montserrat">
          <h2 className="mt-10 mb-1 text-6xl font-bold text-center text-secondary">
            Facilitamos el cuidado de tu mascota
          </h2>
          <div className="container grid grid-cols-1 gap-8 py-16 mx-auto md:grid-cols-3">
            <div className="p-12 rounded-lg bg-bgprimary">
              <div className="flex items-center justify-center mb-4">
                <img
                  src={feature1}
                  alt="Dog with a cone"
                  className="w-64 h-64 rounded-full"
                />
              </div>
              <h2 className="p-2 text-2xl font-semibold text-center text-brand">
                Gestiona medicamentos y citas de tu mascota
              </h2>
              <p className="text-lg text-center">
                Mantén un control preciso sobre los medicamentos de tu mascota y
                las próximas citas veterinarias. Visualiza fácilmente sus
                tratamientos actuales y asegúrate de que no falte a ninguna
                consulta importante.
              </p>
            </div>
            <div className="p-12 rounded-lg bg-bgprimary">
              <div className="flex items-center justify-center mb-4">
                <img
                  src={feature2}
                  alt="x-ray of a dog"
                  className="w-64 h-64 rounded-full"
                />
              </div>
              <h2 className="p-2 text-2xl font-semibold text-center text-brand">
                Accede al historial médico de tu mascota en línea
              </h2>
              <p className="text-lg text-center">
                Consulta el historial de salud de tu mascota de forma rápida y
                segura. Revisa diagnósticos, vacunas y tratamientos desde
                cualquier dispositivo, todo en un solo lugar.
              </p>
            </div>
            <div className="p-12 rounded-lg bg-bgprimary">
              <div className="flex items-center justify-center mb-4">
                <img
                  src={feature3}
                  alt="cat at the veterinarian"
                  className="w-64 h-64 rounded-full"
                />
              </div>
              <h2 className="p-2 text-2xl font-semibold text-center text-brand">
                Agenda citas veterinarias en línea
              </h2>
              <p className="text-lg text-center">
                Programa las visitas de tu mascota con nuestro sistema de citas
                en línea. Elige la fecha y hora que mejor se ajusten a tu
                agenda, sin complicaciones ni llamadas telefónicas.
              </p>
            </div>
          </div>
        </section>
        {/*WhoAreWe section*/}
        <section className="mt-8 font-montserrat">
          <div className="container grid grid-cols-1 gap-4 mx-auto md:grid-cols-2">
            <div className="flex flex-col items-start p-12 rounded-lg bg-brand">
              <div className="flex items-center justify-between w-full">
                <h2 className="flex items-center p-2 text-5xl font-semibold text-bgsecondary">
                  ¿Quienes somos?
                  <img
                    src={vetlinkFaceLogo}
                    alt="Vetlink face logo"
                    className="w-24 h-12 ml-6"
                  />
                </h2>
              </div>
              <p className="text-2xl text-left text-bgsecondary">
                Somos una plataforma diseñada para optimizar la gestión de
                nuestras clínicas veterinarias, conectando a veterinarios y
                dueños de mascotas de manera eficiente. Nuestro objetivo es
                mejorar la operación diaria y facilitar la comunicación,
                brindando un servicio más ágil y centrado en el bienestar
                animal. Vetlink se adapta al crecimiento de nuestra red de
                clínicas, asegurando una atención de calidad en cada una de
                ellas.
              </p>
            </div>
            <div
              className="bg-center bg-no-repeat bg-cover rounded-lg"
              style={{ backgroundImage: `url(${whoAreWe})` }}
            ></div>
          </div>
        </section>

        {/*Questions section*/}
        <section className="px-6 mx-auto mt-10 mb-4 font-montserrat max-w-7xl lg:px-8">
          <h2 className="mb-4 text-6xl font-semibold text-center text-secondary">
            Preguntas Frecuentes
          </h2>
          <Accordion items={faqs} />
        </section>
      </main>
    </div>
  );
}

export default LandingPage;
