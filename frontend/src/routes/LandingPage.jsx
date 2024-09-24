import Header from "../components/Header";
import Footer from "../components/Footer";
import Accordion from "../components/Accordion";

import vetlinkTextIconLogo from "../assets/icons/vetlink-full-logo.png";
import vetlinkFaceLogo from "../assets/icons/vetlink-logo-face.png";
import heroImage from "../assets/img/hero_dog.jpg";
import feature1 from "../assets/img/feature1.jpg";
import feature2 from "../assets/img/feature2.jpg";
import feature3 from "../assets/img/feature3.jpg";
import whoAreWe from "../assets/img/who_are_we.jpg";

function LandingPage() {
  const faqs = [
    {
      title: "¿Cuál es la diferencia entre una mascota y un perro?",
      content: "Ninguna.",
    },
    {
      title: "¿Cuál es la diferencia entre una mascota y un gato?",
      content: "Ninguna.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero section */}
        <section
          className="relative w-full text-white bg-cover bg-no-repeat flex items-center font-montserrat"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundPosition: "center calc(30%)",
            marginTop: 0,
            paddingTop: 0,
          }}
        >
          <div className="container mx-auto flex flex-col lg:flex-row items-center lg:items-start py-16 relative z-10">
            {/* Hero contents */}
            <div className="lg:w-1/2 px-1 text-center lg:text-left">
              {/* Logo and text*/}
              <div className="mb-8 lg:mb-16 z-0">
                <img
                  src={vetlinkTextIconLogo}
                  alt="Vetlink Logo"
                  className="mx-auto lg:mx-0 lg:w-[700px] lg:h-[180px] xl:w-[800px] xl:h-[200px] md:w-[400px] md:h-[120px] sm:w-[300px] sm:h-[100px]"
                />
              </div>
              <h1 className="text-4xl lg:text-6xl xl:text-7xl font-semibold mb-4 text-bgsecondary">
                Cuida a tu mascota sin complicaciones
              </h1>
              <p className="text-lg lg:text-xl xl:text-2xl mb-8 text-bgsecondary">
                Regístrate y mantén todo bajo control desde nuestra plataforma.
              </p>
              {/* Action button */}
              <a
                href="#"
                className="bg-brand text-bgsecondary py-2 lg:py-3 xl:py-4 px-4 lg:px-8 xl:px-10 rounded-lg text-lg lg:text-xl xl:text-2xl font-semibold hover:bg-teal-600"
              >
                Regístrate ahora
              </a>
            </div>
          </div>
        </section>
        {/*Main features section*/}
        <section className="font-montserrat">
          <h2 className="text-6xl font-bold text-center mb-1 mt-10 text-secondary">
            Facilitamos el cuidado de tu mascota
          </h2>
          <div className="container mx-auto py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-bgprimary rounded-lg p-12">
              <div className="flex items-center justify-center mb-4">
                <img
                  src={feature1}
                  alt="Dog with a cone"
                  className="h-64 w-64 rounded-full"
                />
              </div>
              <h2 className="text-2xl font-semibold text-center p-2 text-brand">
                Gestiona medicamentos y citas de tu mascota
              </h2>
              <p className="text-lg text-center">
                Mantén un control preciso sobre los medicamentos de tu mascota y
                las próximas citas veterinarias. Visualiza fácilmente sus
                tratamientos actuales y asegúrate de que no falte a ninguna
                consulta importante.
              </p>
            </div>
            <div className="bg-bgprimary rounded-lg p-12">
              <div className="flex items-center justify-center mb-4">
                <img
                  src={feature2}
                  alt="x-ray of a dog"
                  className="h-64 w-64 rounded-full"
                />
              </div>
              <h2 className="text-2xl font-semibold text-center p-2 text-brand">
                Accede al historial médico de tu mascota en línea
              </h2>
              <p className="text-lg text-center">
                Consulta el historial de salud de tu mascota de forma rápida y
                segura. Revisa diagnósticos, vacunas y tratamientos desde
                cualquier dispositivo, todo en un solo lugar.
              </p>
            </div>
            <div className="bg-bgprimary rounded-lg p-12">
              <div className="flex items-center justify-center mb-4">
                <img
                  src={feature3}
                  alt="cat at the veterinarian"
                  className="h-64 w-64 rounded-full"
                />
              </div>
              <h2 className="text-2xl font-semibold text-center p-2 text-brand">
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
        <section className="font-montserrat mt-8">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-brand rounded-lg p-12 flex flex-col items-start">
              <div className="flex items-center justify-between w-full">
                <h2 className="text-5xl font-semibold p-2 text-bgsecondary flex items-center">
                  ¿Quienes somos?
                  <img
                    src={vetlinkFaceLogo}
                    alt="Vetlink face logo"
                    className="h-12 w-24 ml-6"
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
              className="bg-no-repeat bg-center bg-cover rounded-lg"
              style={{ backgroundImage: `url(${whoAreWe})` }}
            ></div>
          </div>
        </section>

        {/*Questions section*/}
        <section className="font-montserrat mt-10 mb-4 mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-6xl font-semibold text-center mb-4 text-secondary">
            Preguntas Frecuentes
          </h2>
          <Accordion items={faqs} />
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;
