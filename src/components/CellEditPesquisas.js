import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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
      updateTable();
      console.log(response.data)
      toast.success(response.data)
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
              <label htmlFor="edit-requerente">Alterar requerente:</label>
              <input
              onChange={handleNewValues} 
              defaultValue={editingCell.requerente}
              id="edit-requerente"
              name="newrequerente"
              type="text"
              />
              <label htmlFor="edit-endereco">Alterar endereço:</label>
              <input
              onChange={handleNewValues} 
              defaultValue={editingCell.endereco}
              id="edit-endereco"
              name="newendereco"
              type="text"
              />
              <label htmlFor="edit-nimovel">Alterar nº imóvel:</label>
              <input
              onChange={handleNewValues}
              defaultValue={editingCell.numero_imovel} 
              id="edit-nimovel"
              name="newnumeroImovel"
              type="text"
              />
              <label htmlFor="edit-numdigital">Alterar numero protocolo digital:</label>
              <input
              onChange={handleNewValues}
              defaultValue={editingCell.numdigital}
              id="edit-numdigital"
              name="newnumdigital"
              type="text" 
              />
              <label htmlFor="edit-numprocesso">Alterar processo:</label>
              <input
              onChange={handleNewValues}
              defaultValue={editingCell.numero_processo}
              id="edit-numprocesso" 
              name="newprocesso"
              type="text"
              />
              <label htmlFor="edit-anexos">Alterar anexos:</label>
              <div className="anexos-div"> 
                {anexos.map((value, key) => (
                  <ul key={key}>
                    <li>{value.anexos}</li>
                  </ul>
                ))}
              </div>
            </div>
            <button onClick={handleConfirmNewValues}>Confirmar</button>
            <button onClick={() => closeModal(false)}>Fechar</button>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
