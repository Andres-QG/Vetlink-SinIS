import Header from "../components/Header";
import Footer from "../components/Footer";

import vetlinkTextIconLogo from "../assets/icons/vetlink-full-logo.png";
import heroImage from "../assets/img/hero_dog.jpg";

function LandingPage() {
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
            <div className="lg:w-1/2 px-4 text-center lg:text-left">
              {/* Logo and text*/}
              <div className="mb-8 lg:mb-16">
                <img
                  src={vetlinkTextIconLogo}
                  alt="Vetlink Logo"
                  className="mx-auto lg:mx-0 lg:w-[700px] lg:h-[180px] xl:w-[800px] xl:h-[200px] md:w-[400px] md:h-[120px] sm:w-[300px] sm:h-[100px]"
                />
              </div>
              <h1 className="text-4xl lg:text-6xl xl:text-7xl font-semibold mb-4">
                Cuida a tu mascota sin complicaciones
              </h1>
              <p className="text-lg lg:text-xl xl:text-2xl mb-8">
                Regístrate y mantén todo bajo control desde nuestra plataforma.
              </p>
              {/* Action button */}
              <a
                href="#"
                className="bg-teal-500 text-white py-2 lg:py-3 xl:py-4 px-4 lg:px-8 xl:px-10 rounded-lg text-lg lg:text-xl xl:text-2xl font-semibold hover:bg-teal-600"
              >
                Regístrate ahora
              </a>
            </div>
          </div>
        </section>
        {/*Main features section*/}
        <section></section>
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;
