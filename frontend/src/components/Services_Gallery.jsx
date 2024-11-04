import { Card, Typography, Grow } from "@mui/material";
import PropTypes from "prop-types";

function Services_Gallery({
  title,
  subtitle,
  text,
  imageSrc,
  className,
  price,
  duration,
  number_of_sessions,
}) {
  const displayDuration = duration || "Variable";
  const displaySessions = number_of_sessions || "Variable";

  return (
    <div className={`lg:w-1/3 sm:w-1/2 p-4 ${className}`}>
      <Grow in={true} timeout={1000}>
        <Card className="flex flex-col h-full">
          <div className="relative h-64">
            <img
              alt="gallery"
              className="absolute inset-0 w-full h-full object-cover object-center"
              src={imageSrc}
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="px-8 py-4 bg-bgsecondary border-t-4 border-gray-200 flex-grow">
            <div className="flex justify-between items-center">
              <h2 className="tracking-widest text-2xl title-font font-semibold text-secondary mb-1 font-montserrat">
                {title}
              </h2>
              <Typography
                variant="body2"
                color="green"
                className="font-montserrat">
                {price}
              </Typography>
            </div>
            <h1 className="title-font text-lg font-medium text-elemsec mb-3 font-montserrat">
              {subtitle}
            </h1>
            <p className="leading-relaxed font-montserrat">{text}</p>
            <Typography
              variant="overline"
              color="textSecondary"
              className="font-montserrat mt-2"
              style={{ display: "block", marginBottom: "16px" }}>
              Duración: {displayDuration}
            </Typography>
            <Typography
              variant="overline"
              color="textSecondary"
              className="font-montserrat mt-2"
              style={{ display: "block" }}>
              Número de sesiones: {displaySessions}
            </Typography>
          </div>
        </Card>
      </Grow>
    </div>
  );
}

Services_Gallery.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  text: PropTypes.string.isRequired,
  imageSrc: PropTypes.string.isRequired,
  className: PropTypes.string,
  price: PropTypes.string.isRequired,
  duration: PropTypes.string,
  number_of_sessions: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Services_Gallery.defaultProps = {
  subtitle: "",
  className: "",
  duration: null,
  number_of_sessions: null,
};

export default Services_Gallery;
