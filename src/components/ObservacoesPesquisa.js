import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { BiSolidTrashAlt } from "react-icons/bi";

export default function ModalObservacoesPesquisa({ closeModalObservacoesPesquisa, editingItem }) {
  const [openAddObservacao, setOpenAddObservacao] = useState(false);
  const [observacoes, setObservacoes] = useState([]);

  const fetchObservacoes = useCallback(() => {
    axios.get(
      `http://localhost:3030/pesquisas/observacoes/${editingItem.id}`
      )
      .then((response) => setObservacoes(response.data.observacoes[0]))
      .catch((error) => console.log(error))
  }, [editingItem.id]) 

  useEffect(() => {
    fetchObservacoes();
  }, [fetchObservacoes]);


  function ObservacoesPesquisa() {
    
    const deleteObs = (id) => {
      axios.delete(
        `http://localhost:3030/observacoes/delete/${id}`
        )
        .then((response) => {
          console.log(response.data)
          fetchObservacoes();
        })
        .catch((error) => console.log(error))
    };

    return (
      <div className="modaal">
        <h3>Modal observaçoes</h3>
        <div>
          <ul>
            {console.log(observacoes)}
            {observacoes.length > 0 ? observacoes.map((observacao) => (
              <li key={observacao.id_requerimento_observacoes}>
                <strong>{observacao.observacao} em: </strong>{observacao.date}
                <BiSolidTrashAlt 
                onClick={() => deleteObs(observacao.id_requerimento_observacoes)}
                className="icon-delete"
                size={18} 
                />
              </li>
            )) : <p>Não existem observacoes</p>}
          </ul>
        </div>
        <div>
          <button onClick={() => setOpenAddObservacao(true)}>
            Adicionar Observacao
          </button>
        </div>
      </div>
    );
  }

  function AddObservacoesPesquisa() {
    const [selectOptions] = useState([
      "",
      "Entrou em contato",
      "Tirou copias",
      "Encaminhado",
      "Teve vistas do processo",
      "Municipe informado",
      "Municipe Ligou"
    ]);
    const [selectedOption, setSelectedOptions] = useState("");
    const [date, setDate] = useState("");

    const addObservacao = () => {
      axios
        .post("http://localhost:3030/pesquisas/observacoes", {
          requerimentoId: editingItem.id,
          observacao: selectedOption,
          date: date,
        })
        .then((response) => {
          console.log(response.data);
          fetchObservacoes();
          setOpenAddObservacao(false);
        })
        .catch((error) => console.log(error));
    };

    return (
      <div className="modaal">
        <div>
          <p>Adicionar observação referente a pesquisa: </p>
        </div>
        <select onChange={(e) => setSelectedOptions(e.target.value)}>
          {selectOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <div>
          <button onClick={() => addObservacao()}>Adicionar</button>
          <button onClick={() => setOpenAddObservacao(false)}>Fechar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <IoMdCloseCircle
        className="close-icon"
        onClick={() => closeModalObservacoesPesquisa(false)}
      />
      {openAddObservacao ? <AddObservacoesPesquisa /> : <ObservacoesPesquisa />}
    </div>
  );
};
