import { useState, useEffect } from "react";
import "./ModalEdit.css";
import axios from "axios";
import AnexosEdit from "./AnexosEdit";

export default function CellEdit({ editingItem, closeModalEdit, fetchNewDataValues }) {
  const [closeModal, setCloseModal] = useState(false);
  const [newValues, setNewValues] = useState();

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
          newDate: newValues?.newdate,
          newSecretaria: newValues?.newsecretaria,
          newNumOficio: newValues?.newnumoficio,
          newNumProcesso: newValues?.newnumprocesso,
          newName: newValues?.newnome,
          newNumPesquisa: newValues?.newnumpesquisa,
          existingValues: editingItem,
        })
        .then((response) => { 
        console.log(response.data.updatedCellValues[0]);
        fetchNewDataValues()
        setCloseModal(true)
        })
        .catch((error) => 
        console.log(error)
        );
    };

  const editPesquisa = (
    <div className="div-input-edit">
      <label>Data</label>
      <input
        onChange={handleChangeNewValues}
        className="input-edit"
        defaultValue={editingItem.date}
        name="newdate"
        type="date"
      />
      <label>Número de Pesquisa</label>
      <input
        onChange={handleChangeNewValues}
        className="input-edit"
        defaultValue={editingItem.numero}
        name="newnumpesquisa"
        type="Text"
      />
      <label>Número do Processo</label>
      <input
        onChange={handleChangeNewValues}
        className="input-edit"
        defaultValue={editingItem.numprocesso}
        name="newnumprocesso"
        type="text"
      />
      <label>Nome</label>
      <input
        onChange={handleChangeNewValues}
        className="input-edit"
        defaultValue={editingItem.name}
        name="newnome"
        type="Text"
      />
    </div>
  );
  const editOficio = (
    <div className="div-input-edit">
      <label>Data</label>
      <input
        onChange={handleChangeNewValues}
        className="input-edit"
        defaultValue={editingItem.date}
        name="newdate"
        type="date"
      />
      <label>Secretaria</label>
      <input
        onChange={handleChangeNewValues}
        className="input-edit"
        defaultValue={editingItem.sec}
        name="newsecretaria"
        type="text"
      />
      <label>Número de Oficio</label>
      <input
        onChange={handleChangeNewValues}
        className="input-edit"
        defaultValue={editingItem.numero}
        name="newnumoficio"
        type="text"
      />
      <label>Número do Processo</label>
      <input
        onChange={handleChangeNewValues}
        className="input-edit"
        defaultValue={editingItem.numprocesso}
        name="newnumprocesso"
        type="text"
      />
      <label>Nome</label>
      <input
        onChange={handleChangeNewValues}
        className="input-edit"
        defaultValue={editingItem.name}
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
