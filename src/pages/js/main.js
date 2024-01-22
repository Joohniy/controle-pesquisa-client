import React, { useState } from "react";
import TablePedidos from "../../components/TablePedidos";

export default function Main() {
  const [typeRequer, setTypeRequer] = useState("Todos");
  return (
    <div>
      <h3>Solicitados</h3>
      <label htmlFor="select-typerequer">Filtrar por:</label>
      <select
        className="select-filtrar"
        id="select-typerequer"
        onChange={(e) => setTypeRequer(e.target.value)}
      >
        <option>Todos</option>
        <option>Oficio</option>
        <option>Pesquisa</option>
      </select>
      <TablePedidos type={typeRequer} />
    </div>
  );
}
