import { useState } from "react";

const SearchBar = ({ onSearch, columns = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterColumn, setFilterColumn] = useState(columns[0]);
  const [order, setOrder] = useState("asc");

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleFilterClick = () => {
    toggleModal();
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
    setIsModalOpen(false);
    onSearch(searchTerm, filterColumn, order);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm, filterColumn, order);
  };

  const renderModal = () => {
    if (!isModalOpen) return null;
    return (
      <div className="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50">
        <div className="relative w-full max-w-md mx-4 my-8 transition-all transform bg-white rounded-lg shadow-lg sm:w-1/2 lg:w-1/3">
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Configuración de Filtro
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Elige la columna y el orden para filtrar los resultados.
              </p>
              <div className="mt-4">
                <label
                  htmlFor="filter-column"
                  className="block text-sm font-medium text-gray-700"
                >
                  Columna:
                </label>
                <select
                  id="filter-column"
                  value={filterColumn}
                  onChange={(e) => setFilterColumn(e.target.value)}
                  className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {columns.map((column) => (
                    <option key={column} value={column}>
                      {column}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-4">
                <label
                  htmlFor="order"
                  className="block text-sm font-medium text-gray-700"
                >
                  Orden:
                </label>
                <select
                  id="order"
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                  className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="asc">Ascendente</option>
                  <option value="desc">Descendente</option>
                </select>
              </div>
            </div>
          </div>
          <div className="px-4 py-3 rounded-b-lg bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
            {" "}
            <button
              type="button"
              onClick={handleApplyFilters}
              className="w-full px-4 py-2 text-base font-medium text-white rounded-md shadow-md bg-primary hover:bg-hoverPrimary sm:ml-3 sm:w-auto sm:text-sm"
            >
              Aplicar
            </button>
            <button
              type="button"
              onClick={toggleModal}
              className="w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <form
      className="flex items-center w-full max-w-3xl mx-auto"
      onSubmit={handleSearch}
    >
      <label htmlFor="simple-search" className="sr-only">
        Search
      </label>
      <div className="relative flex-1">
        <button
          type="button"
          className="absolute inset-y-0 flex items-center pl-3"
          onClick={handleFilterClick}
        >
          <span className="text-gray-500 material-symbols-outlined">tune</span>
        </button>
        <input
          type="text"
          id="simple-search"
          className="w-full py-2 pl-10 pr-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
          placeholder={`Buscar por ${filterColumn}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="ml-2 p-2.5 text-sm font-medium text-white bg-primary rounded-lg border border-blue-700 hover:bg-hoverPrimary focus:ring-4 focus:outline-none focus:ring-blue-300"
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
      {renderModal()}
    </form>
  );
};

export default SearchBar;
