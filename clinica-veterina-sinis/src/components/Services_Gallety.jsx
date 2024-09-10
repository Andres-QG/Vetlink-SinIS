function Services_Gallery({ title, subtitle, text, imageSrc, className }) {
  return (
    <div className={`lg:w-1/3 sm:w-1/2 p-4 ${className}`}>
      <div className="flex flex-col h-full">
        <div className="relative h-64">
          <img
            alt="gallery"
            className="absolute inset-0 w-full h-full object-cover object-center"
            src={imageSrc}
            style={{ objectFit: "cover" }} // Asegurar que la imagen cubra todo el contenedor
          />
        </div>
        <div className="px-8 py-4 bg-white border-t-4 border-gray-200 flex-grow">
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

export default Services_Gallery;
