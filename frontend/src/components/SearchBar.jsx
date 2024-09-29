import React from 'react';

const SearchBar = () => {
  // Función para manejar el clic en el botón de filtros
  const handleFilterClick = () => {
    // Aquí puedes agregar la lógica para mostrar un menú de filtros o abrir un modal
    console.log('Botón de filtros clickeado');
  };

  return (
    // Formulario contenedor
    <form className="flex items-center max-w-sm mx-auto">
      {/* Etiqueta para accesibilidad */}
      <label htmlFor="simple-search" className="sr-only">Search</label>

      {/* Contenedor para el input de búsqueda */}
      <div className="relative w-full">
        {/* Botón de filtros con ícono de "delete" */}
        <button
          type="button"
          className="absolute inset-y-0 flex items-center start-0 ps-3"
          onClick={handleFilterClick} // Maneja el clic
        >
          <span className="text-gray-500 material-symbols-outlined">tune</span>
        </button>

        {/* Input de búsqueda */}
        <input
          type="text"
          id="simple-search"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
          placeholder="Buscar"
          required
          // Modifica el tamaño aquí para alargar el input
          style={{ width: '100%' }} // Puedes cambiar '100%' por un valor específico como '300px'
        />
      </div>

      {/* Botón de envío */}
      <button
        type="submit"
        className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
      >
        <svg
          className="w-4 h-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg>
        <span className="sr-only">Search</span>
      </button>
    </form>
  );
};

export default SearchBar;
