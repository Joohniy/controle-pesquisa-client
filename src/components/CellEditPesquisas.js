import { useEffect, useState } from "react";
import axios from "axios";

export default function CellEditPesquisas({ closeModal, editingCell, updateTable }) {
  const [newValues, setNewValues] = useState({});
  const [anexos, setAnexos] = useState([]);

  const handleNewValues = (e) => {
    setNewValues((prevValues) => ({
      ...prevValues,
      [e.target.name]: e.target.value
    }))
  };

  const handleConfirmNewValues = () => {
    axios.post("http://localhost:3030/pesquisas/edit", {
      newValues: newValues,
      existingValues: editingCell,
    })
    .then((response) => {
      console.log(response);
      updateTable();
      closeModal(false);
    })
    .catch((error) => console.log(error))
  };
         
  useEffect(() => {
    const fetchAnexos = async () => {
      await axios.get(`http://localhost:3030/pesquisas/edit/anexos/${editingCell.id}`)
      .then((response) => setAnexos(response.data.anexos[0]))
      .catch((error) => console.log(error))  
    }
    fetchAnexos()
  }, [editingCell.id]);
  
  return (
    <>
      <div className="modal-overlay">
        <div className="modaal">
            <h4>Edição de campos</h4>
            <div className="div-input-edit">
              <label>Alterar requerente:</label>
              <input
              onChange={handleNewValues} 
              defaultValue={editingCell.requerente}
              name="newrequerente"
              type="text"
              />
              <label>Alterar endereço:</label>
              <input
              onChange={handleNewValues} 
              defaultValue={editingCell.endereco}
              name="newendereco"
              type="text"
              />
              <label>Alterar nº imóvel:</label>
              <input
              onChange={handleNewValues}
              defaultValue={editingCell.numero_imovel} 
              name="newnumeroImovel"
              type="text"
              />
              <label>Alterar numero protocolo digital:</label>
              <input
              onChange={handleNewValues}
              defaultValue={editingCell.numdigital}
              name="newnumdigital"
              type="text" 
              />
              <label>Alterar processo:</label>
              <input
              onChange={handleNewValues}
              defaultValue={editingCell.numero_processo} 
              name="newprocesso"
              type="text"
              />
              <label>Alterar anexos:</label>
              <div className="anexos-div">
                {anexos.map((value) => (
                  <ul>
                    <li>{value.anexos}</li>
                  </ul>
                ))}
              </div>
            </div>
            <button onClick={handleConfirmNewValues}>Confirmar</button>
            <button onClick={() => closeModal(false)}>Fechar</button>
        </div>
      </div>
    </>
  );
}
