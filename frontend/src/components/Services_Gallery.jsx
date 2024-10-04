function Services_Gallery({ title, subtitle, text, imageSrc, className }) {
  return (
    <div className={`lg:w-1/3 sm:w-1/2 p-4 ${className}`}>
      <div className="flex flex-col h-full">
        <div className="relative h-64">
          <img
            alt="gallery"
            className="absolute inset-0 w-full h-full object-cover object-center"
            src={imageSrc}
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="px-8 py-4 bg-bgsecondary border-t-4 border-gray-200 flex-grow">
          <h2 className="tracking-widest text-2xl title-font font-semibold text-secondary mb-1 font-montserrat">
            {title}
          </h2>
          <h1 className="title-font text-lg font-medium text-elemsec mb-3 font-montserrat">
            {subtitle}
          </h1>
          <p className="leading-relaxed font-montserrat">{text}</p>
        </div>
      </div>
    </div>
  );
}

export default Services_Gallery;