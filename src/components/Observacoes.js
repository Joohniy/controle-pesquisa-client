import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { BiTrash } from "react-icons/bi";
import { IoMdCloseCircle } from "react-icons/io";

export default function Observacoes({ closeModal, id, tipoRequer }) {
  const [openAddObservacao, setOpenAddObservacao] = useState(false);
  const [dateObs, setDateObs] = useState("");
  const [observacao, setObservacao] = useState("");
  const [observacoes, setObservacoes] = useState([]);

  const fetchObservacoes = useCallback(() => {
    axios
      .get(`http://localhost:3030/observacoes/${tipoRequer}/${id}`)
      .then((response) => setObservacoes(response.data.observacoes[0]))
      .catch((error) => console.log(error));
  }, [id, tipoRequer])

  useEffect(() => {
    fetchObservacoes()
  }, [fetchObservacoes])

  const handleConfirm = () => {
    if (observacao && dateObs) {
        axios
        .post("http://localhost:3030/observacoes", {
          id: id,
          tipo_requer: tipoRequer,
          observacao: observacao,
          dateObs: dateObs,
        })
        .then((response) => {
          fetchObservacoes()
          setOpenAddObservacao(false)
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const buttonVoltar = () => {
    setOpenAddObservacao(false);
    setObservacao("");
  };

  const handleDelete = (idObs) => {
    axios
      .delete(`http://localhost:3030/observacoes/delete/${tipoRequer}/${idObs}`)
      .then((response) => {
        fetchObservacoes();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  
function AddObservacao({ handleConfirm, buttonVoltar, observacao, setObservacao, dateObs, setDateObs }) {
  return (
    <div className="modaal">
      <div>
        <h2>Adicionar Observaçoes</h2>
      </div>
      <select
        value={observacao}
        onChange={(e) => setObservacao(e.target.value)}
      >
        <option value={"Selecione"}>Selecione</option>
        <option value={"Solicitado Novamente"}>Solicitado novamente</option>
        <option value={"Entregue"}>Entregue</option>
      </select>
      <input
        data-testid="date-input"
        value={dateObs}
        type="date"
        onChange={(e) => setDateObs(e.target.value)}
      />
      <button onClick={() => handleConfirm()}>Confirmar</button>
      <button onClick={buttonVoltar}>Voltar</button>
    </div>
  );
}

  const Modal = () => {
    return (
      <div className="modaal">
        <div>
          <h2>Observaçoes</h2>
        </div>
        <ul>
          {observacoes.length > 0 ? observacoes.map((obs, key) => (
            <li key={key}>
            {obs.observacao} em: {obs.date}.
              <BiTrash
                data-testid="delete-obs-main"
                onClick={() => handleDelete(obs.id)}
                className="icon-delete"
              />
            </li>
          )) : <p>Não há observações para este pedido.</p> }
        </ul>
        <button className="add" onClick={() => setOpenAddObservacao(true)}>
          Adicionar Observação
        </button>
      </div>
    );
  };

  return (
    <div className="modal-overlay">
      <IoMdCloseCircle className="close-icon" onClick={closeModal}>
        Fechar
      </IoMdCloseCircle>
      {openAddObservacao ? (
        <AddObservacao
          handleConfirm={handleConfirm}
          buttonVoltar={buttonVoltar}
          observacao={observacao}
          setObservacao={setObservacao}
          dateObs={dateObs}
          setDateObs={setDateObs}
        />
      ) : (
        <Modal />
      )}
    </div>
  );
}