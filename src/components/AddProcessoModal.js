import axios from "axios";
import { useState } from "react";
import { MdAddBox } from "react-icons/md";

export default function AddProcessoModal({ editingItem, closeModal, updateTable }) {
  const [newProcesso, setNewProcesso] = useState("");
  const [newAnexo, setNewAnexo] = useState("");
  const [newAnexosArray, setNewAnexosArray] = useState([]);

  const handleNewProcesso = (e) => {
    setNewProcesso(e.target.value);
  };
  const handleNewAnexo = (e) => {
    setNewAnexo(e.target.value);
  };
  const handleNewAnexoArray = () => {
    setNewAnexosArray([...newAnexosArray, newAnexo]);
    setNewAnexo("");
  };
  const handleCloseModal = () => {
    closeModal(false);
    setNewAnexosArray([]);
  };

  const addProcesso = () => {
    axios
      .post("http://localhost:3030/pesquisas/add", {
        id: editingItem.id,
        newProcesso: newProcesso,
        anexos: newAnexosArray,
        processoAlreadyRegistered: editingItem.numero_processo,
      })
      .then((response) => {
        console.log(response.data);
        updateTable();
      })
      .catch((error) =>
        console.log(error, "Aconteceu algo errado em adicionar o processo")
      );
  };

  return (
    <div className="modal-overlay">
      <div className="modaal">
        <h4>Adicionar e editar processos e anexos</h4>
        <label htmlFor="newProcesso">Nº processo</label>
        <div className="input-add-editanexos">
          <input
            type="text"
            id="newProcesso"
            value={newProcesso}
            onChange={handleNewProcesso}
          />
        </div>
        <label htmlFor="newAnexos">Anexos</label>
        <div className="input-add-editanexos">
          <input
            type="text"
            id="newAnexos"
            value={newAnexo}
            onChange={handleNewAnexo}
          />
          <MdAddBox onClick={handleNewAnexoArray} size={30} color="black" />
        </div>
        <div hidden={newAnexosArray.length >= 1 ? false : true}>Anexos que serão incluidos:</div>
        <div className="container-new-anexos">
          {newAnexosArray.map((toAddAnexos, key) => (
            <ul key={key}>
              <li>{toAddAnexos}</li>
            </ul>
          ))}
        </div>
        <div className="buttons-add-newanexos">
          <button onClick={handleCloseModal}>Fechar</button>
          <button onClick={() => addProcesso()}>Confirmar</button>
        </div>
      </div>
    </div>
  );
}
