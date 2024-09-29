function Footer() {
  return (
    <>
      <footer className="py-4 text-white bg-bgsecondary font-montserrat">
        <div className="flex items-center justify-between w-full px-4 mx-auto mt-2">
          <div className="text-sm text-secondary">
            &copy; {new Date().getFullYear()} VetLink. Todos los derechos
            reservados.
          </div>
          <div>{/* Add any additional footer content here */}</div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
