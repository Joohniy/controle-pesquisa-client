import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { BiSolidTrashAlt, BiMessageSquareAdd } from "react-icons/bi";
import { MdOutlineAddBox } from 'react-icons/md';

export default function AnexosEdit({ editingItem }) {
  const [anexos, setAnexos] = useState([]);
  const [openModalAddAnexos, setOpenModalAddAnexos] = useState(false);
  const [arrayNewAnexo, setArrayNewAnexos] = useState([]);
  const [newAnexo, setNewAnexos] = useState("");
  const [disableButtonConfirm, setDisableButtonConfirm] = useState(false)

  const fetchAnexos = useCallback(() => {
    axios
      .get(`http://localhost:3030/main/edit/${editingItem.id}/${editingItem.tipo_requer}`)
      .then((response) => {
      setAnexos(response.data.anexos[0])
     })
    .catch((err) => console.log(err));
  }, [editingItem.id, editingItem.tipo_requer]);

  useEffect(() => { 
    fetchAnexos();
  }, [fetchAnexos]);

  const handleDeleteAnexo = (idAnexosPesquisa, idAnexosOficio) => {
    axios
      .post("http://localhost:3030/main/anexos/delete", {
        tipoRequer: editingItem.tipo_requer,
        idAnexoPesquisa: idAnexosPesquisa,
        idAnexoOficio: idAnexosOficio,
      })
      .then((response) => {
      setAnexos(response.data.updatedAnexosAfterDelete[0])
      fetchAnexos();
      })
      .catch((err) => console.log(err));
  };

  const handleNewAnexo = (e) => {
    setNewAnexos(e.target.value)
  };

  const handleArrayNewAnexos = () => {
    setArrayNewAnexos([...arrayNewAnexo, newAnexo]);
    setNewAnexos("");
  };
  const buttonFecharAddAnexos = () => {
    setOpenModalAddAnexos(false);
    setArrayNewAnexos([]);
  };

  const handleConfirmNewAnexos = () => {
    if (!arrayNewAnexo && !newAnexo) {
      setDisableButtonConfirm(true);
    } else {
      setDisableButtonConfirm(false)
      axios.post("http://localhost:3030/main/edit/anexos/add", {
        tipoRequer: editingItem.tipo_requer,
        mainCellId: editingItem.id,
        newAnexos: arrayNewAnexo, 
    })
    .then((response) => {
      setAnexos(response.data.updatedListAnexosToEdit[0]);
      setOpenModalAddAnexos(false);
      setArrayNewAnexos([]);
    })
    .catch((err) => console.log(err))
    }
  };

  const addAnexoModal =  (
      <div className="modal-overlay">
        <div className="modaal">
          <h4>Adicionar novos anexos</h4>
          <label htmlFor="newAnexo">Adicione o anexo</label>
          <div className="input-add-editanexos" >
          <input 
          value={newAnexo} 
          name="newAnexo" 
          id="newAnexo" 
          onChange={handleNewAnexo} />
          <MdOutlineAddBox className="icon-add-anexosedit" onClick={() => handleArrayNewAnexos()} />
          </div>
          Anexos que serão incluidos: 
          <div className="container-new-anexos">
            {arrayNewAnexo.map((toAddAnexos, key) => (
                <ul key={key} >
                  <li>{toAddAnexos}</li>
                </ul>
            ))}
          </div>
        <div className="buttons-add-newanexos" >
        <button onClick={buttonFecharAddAnexos}>Fechar</button>
        <button disabled={disableButtonConfirm} onClick={() => handleConfirmNewAnexos()} >Confirmar</button>
        </div>
        </div>
      </div>
  );

  return (
    <div>
    <BiMessageSquareAdd className="edit-anexos-icon" onClick={() => setOpenModalAddAnexos(true)} />
    <div className="anexos-div">
      {anexos.map((anexosValues, key) => (
        <ul key={key}>
          <li>
            {anexosValues.processo_anexo}
            <BiSolidTrashAlt
              title="Deletar anexo"
              onClick={()=> handleDeleteAnexo(anexosValues.id_processos_anexospesquisa, anexosValues.id_processos_anexosoficio)}
            />
          </li>
        </ul>
      ))}
    {openModalAddAnexos ? addAnexoModal : null}
    </div>

    </div>
  );
}
