function Services_Gallety({ title, subtitle, text, imageSrc, className }) {
  return (
    <div className={`lg:w-1/3 sm:w-1/2 p-4 ${className}`}>
      <div className="flex relative h-64">
        <img
          alt="gallery"
          className="absolute inset-0 w-full h-full object-cover object-center"
          src={imageSrc}
          style={{ objectFit: "cover" }} // Asegurar que la imagen cubra todo el contenedor
        />
        <div className="px-8 py-10 relative z-10 w-full border-4 border-gray-200 bg-white opacity-0 hover:opacity-100">
          <h2 className="tracking-widest text-2xl title-font font-medium text-indigo-500 mb-1">
            {title}
          </h2>
          <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
            {subtitle}
          </h1>
          <p className="leading-relaxed">{text}</p>
        </div>
      </div>
    </div>
  );
}

export default Services_Gallety;
