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
    <div>
      <div className="m-5 overflow-hidden border border-gray-200 rounded-lg shadow-md">
        <table className="w-full text-sm text-left text-gray-500 bg-white border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-4 font-medium text-gray-900">Usuario</th>
              <th scope="col" className="px-6 py-4 font-medium text-gray-900">Cédula</th>
              <th scope="col" className="px-6 py-4 font-medium text-gray-900">Nombre</th>
              <th scope="col" className="px-6 py-4 font-medium text-gray-900">Teléfono</th>
              <th scope="col" className="px-6 py-4 font-medium text-gray-900">Correo</th>
              <th scope="col" className="px-6 py-4 font-medium text-gray-900">Acciones</th>
            </tr>
          </thead>
          <tbody className="border-t border-gray-100 divide-y divide-gray-100">
            {users.map((user, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4">{user.usuario}</td>
                <td className="px-6 py-4">{user.cedula}</td>
                <td className="px-6 py-4">{user.nombre}</td>
                <td className="px-6 py-4">{user.telefono}</td>
                <td className="px-6 py-4">{user.correo}</td>
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

        {/* Paginación */}
        <div className="flex items-center justify-center h-16">
          <nav aria-label="Page navigation example">
            <ul className="flex items-center space-x-2">
              <li className={`page-item ${!prevPage ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <button
                  onClick={() => handlePageChange("prev")}
                  className={`px-4 py-2 bg-white border rounded-lg shadow-sm focus:outline-none ${!prevPage ? 'text-gray-500' : 'text-gray-700 hover:bg-gray-200'}`}
                  disabled={!prevPage}
                >
                  ← Anterior
                </button>
              </li>

              {Array.from({ length: totalPages }, (_, index) => (
                <li className="justify-center page-item" key={index}>
                  <button
                    onClick={() => handlePageChange(index + 1)} // Solo pasamos el número de página
                    className={`px-4 py-2 border rounded-lg focus:outline-none ${currentPage === index + 1 ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-200'}`}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}

              <li className={`page-item ${!nextPage ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <button
                  onClick={() => handlePageChange("next")}
                  className={`px-4 py-2 bg-white border rounded-lg shadow-sm focus:outline-none ${!nextPage ? 'text-gray-500' : 'text-gray-700 hover:bg-gray-200'}`}
                  disabled={!nextPage}
                >
                  Siguiente →
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default UserTable;
