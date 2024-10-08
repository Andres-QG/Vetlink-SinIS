import { Card, CardContent, Typography, Grow } from "@mui/material";

function Services_Gallery({
  title,
  subtitle,
  text,
  imageSrc,
  className,
  price,
  duration,
}) {
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
              className="font-montserrat mt-2">
              {duration}
            </Typography>
          </div>
        </Card>
      </Grow>
    </div>
  );
}

export default Services_Gallery;
