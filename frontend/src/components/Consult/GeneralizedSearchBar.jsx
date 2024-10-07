import { useState } from "react";

// TODO: Props: onSearch, columns
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
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3
                    className="text-lg font-medium leading-6 text-gray-900"
                    id="modal-title"
                  >
                    Configuración de Filtro
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Elige la columna y el orden para filtrar los resultados.
                    </p>
                  </div>
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
                      className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                      className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="asc">Ascendente</option>
                      <option value="desc">Descendente</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 bg-white sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleApplyFilters}
                  className="w-full px-4 py-2 text-base font-medium text-white rounded-md shadow-sm bg-primary hover:bg-hoverPrimary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Aplicar
                </button>
                <button
                  type="button"
                  onClick={toggleModal}
                  className="w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
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
