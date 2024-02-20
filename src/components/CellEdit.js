import { useState, useEffect } from "react";
import "./ModalEdit.css";
import axios from "axios";
import AnexosEdit from "./AnexosEdit";

export default function CellEdit({ editingItem, closeModalEdit, fetchNewDataValues }) {
  const [closeModal, setCloseModal] = useState(false);
  const [newValues, setNewValues] = useState({});

  useEffect(() => {
    if (closeModal) {
      closeModalEdit();
    }
  }, [closeModal, closeModalEdit]);

  const handleChangeNewValues = (e) => {
    setNewValues((prevNewValues) => ({
      ...prevNewValues,
      [e.target.name]: e.target.value,
    }));
  };

    const handleConfirmNewValues = () => {
        axios
        .post("http://localhost:3030/main/edit", {
          id: editingItem.id,
          tipo_requer: editingItem.tipo_requer,
          newDate: newValues.newdate,
          newSecretaria: newValues.newsecretaria,
          newNumOficio: newValues.newnumoficio,
          newNumProcesso: newValues.newnumprocesso,
          newName: newValues.newnome,
          newNumPesquisa: newValues.newnumpesquisa,
          existingValues: editingItem,
        })
        .then((response) => { 
        setCloseModal(true);
        fetchNewDataValues();
        })
        .catch((error) => 
        console.log(error)
        );
    };

  const editPesquisa = (
    <div className="div-input-edit">
      <label htmlFor="edit-pesq-date">Data</label>
      <input
        onChange={handleChangeNewValues}
        className="input-edit"
        defaultValue={editingItem.date}
        id="edit-pesq-date"
        name="newdate"
        type="date"
      />
      <label htmlFor="edit-pesq-numpesquisa">Número de Pesquisa</label>
      <input
        onChange={handleChangeNewValues}
        className="input-edit"
        defaultValue={editingItem.numero}
        id="edit-pesq-numpesquisa"
        name="newnumpesquisa"
        type="Text"
      />
      <label htmlFor="edit-pesq-numprocesso">Número do Processo</label>
      <input
        onChange={handleChangeNewValues}
        className="input-edit"
        defaultValue={editingItem.numprocesso}
        id="edit-pesq-numprocesso"
        name="newnumprocesso"
        type="text"
      />
      <label htmlFor="edit-pesq-nome">Nome</label>
      <input
        onChange={handleChangeNewValues}
        className="input-edit"
        defaultValue={editingItem.name}
        id="edit-pesq-nome"
        name="newnome"
        type="Text"
      />
    </div>
  );
  const editOficio = (
    <div className="div-input-edit">
      <label htmlFor="edit-of-date">Data</label>
      <input
        onChange={handleChangeNewValues}
        className="input-edit"
        defaultValue={editingItem.date}
        id="edit-of-date"
        name="newdate"
        type="date"
      />
      <label htmlFor="edit-of-secretaria">Secretaria</label>
      <input
        onChange={handleChangeNewValues}
        className="input-edit"
        defaultValue={editingItem.sec}
        id="edit-of-secretaria"
        name="newsecretaria"
        type="text"
      />
      <label htmlFor="edit-of-numoficio">Número de Oficio</label>
      <input
        onChange={handleChangeNewValues}
        className="input-edit"
        defaultValue={editingItem.numero}
        id="edit-of-numoficio"
        name="newnumoficio"
        type="text"
      />
      <label htmlFor="edit-of-numprocesso">Número do Processo</label>
      <input
        onChange={handleChangeNewValues}
        className="input-edit"
        defaultValue={editingItem.numprocesso}
        id="edit-of-numprocesso"
        name="newnumprocesso"
        type="text"
      />
      <label htmlFor="edit-of-nome">Nome</label>
      <input
        onChange={handleChangeNewValues}
        className="input-edit"
        defaultValue={editingItem.name}
        id="edit-of-nome"
        name="newnome"
        type="Text"
      />
    </div>
  );

  return (
    <div className="modal-overlay">
      <div className="modaal">
        <h4>Edição de infomações</h4>
        <p>Campos para editar.</p>
        <div className="buttons-div">
          {editingItem.tipo_requer === "Oficio" ? editOficio : editPesquisa}
          <label style={{color: "rgb(15, 145, 231)", marginTop: "10px"}}>Anexos:</label>
          <AnexosEdit editingItem={editingItem} />
        </div>
        <div className="div-buttons">
          <button onClick={() => setCloseModal(closeModalEdit)}>Fechar</button>
          <button onClick={() => handleConfirmNewValues()}>Confirmar</button>
        </div>
      </div>
    </div>
  );
}
