import React, { useState, useEffect } from "react";

const UserTable = ({ users, nextPage, prevPage, onPageChange, totalPages }) => {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (nextPage) {
      const pageNumber = parseInt(new URL(nextPage).searchParams.get("page"));
      setCurrentPage(pageNumber - 1);
    }
  }, [nextPage]);

  const handlePageChange = (page) => {
    if (page === "prev" && prevPage) {
      onPageChange(currentPage - 1); // Envía el número de página a onPageChange
      setCurrentPage(currentPage - 1);
    } else if (page === "next" && nextPage) {
      onPageChange(currentPage + 1); // Envía el número de página a onPageChange
      setCurrentPage(currentPage + 1);
    } else {
      onPageChange(page); // Aquí simplemente pasamos el número de página
      setCurrentPage(page);
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="m-5 border border-gray-200 rounded-lg shadow-md">
        <table className="w-full min-w-full text-sm text-left text-gray-500 bg-white border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">Usuario</th>
              <th scope="col" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">Cédula</th>
              <th scope="col" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">Nombre</th>
              <th scope="col" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">Teléfono</th>
              <th scope="col" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">Correo</th>
              <th scope="col" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">Acciones</th>
            </tr>
          </thead>
          <tbody className="border-t border-gray-100 divide-y divide-gray-100">
            {users.map((user, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{user.usuario}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.cedula}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.telefono}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.correo}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-start gap-4">
                    <button onClick={() => alert(`Mascotas de ${user.nombre}`)}>
                      <span className="text-purple-300 material-symbols-outlined">pets</span>
                    </button>
                    <button onClick={() => alert(`Editando ${user.nombre}`)}>
                      <span className="text-green-300 material-symbols-outlined">edit</span>
                    </button>
                    <button onClick={() => alert(`Eliminando ${user.nombre}`)}>
                      <span className="text-red-300 material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Separador */}
        <hr className="border-gray-300 " />

        {/* Paginación Responsive */}
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
          <div className="flex justify-between flex-1 sm:hidden">
            <button
              onClick={() => handlePageChange("prev")}
              disabled={!prevPage}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md ${!prevPage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <button
              onClick={() => handlePageChange("next")}
              disabled={!nextPage}
              className={`relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md ${!nextPage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}
            >
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>

          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Página <span className="font-medium">{currentPage}</span> de <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div>
              <nav className="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange("prev")}
                  disabled={!prevPage}
                  className={`relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md ${!prevPage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border ${currentPage === index + 1 ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange("next")}
                  disabled={!nextPage}
                  className={`relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md ${!nextPage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                >
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTable;
