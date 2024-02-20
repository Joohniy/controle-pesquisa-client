import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import "../pages/css/main.css";
import Observacoes from "../pages/js/observacoes";
import { BiSolidTrashAlt, BiSolidEdit } from "react-icons/bi";
import CellEdit from "../components/CellEdit";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function TablePedidos({ type }) {
  const [dataValues, setDataValues] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [id, setId] = useState();
  const [tipoRequer, setTipoRequer] = useState();
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const fetchDataValues = useCallback(() => {
    axios
    .get("http://localhost:3030/main")
    .then((response) => {
      setDataValues(response.data.dataValues[0]);
      console.log(response.data.dataValues[0])
    })
    .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    fetchDataValues();
  }, [fetchDataValues]);

  const handleClickObs = (id, requer) => {
    setOpenModal(true);
    setId(id);
    setTipoRequer(requer);
  };

  const ProcessosAnexos = ({ value }) => {
    const [anexos, setAnexos] = useState([]);
    useEffect(() => {
      const fetchAnexos = (id, requer) => {
        axios
          .get(`http://localhost:3030/main/anexos/${id}/${requer}`)
          .then((response) => setAnexos(response.data.anexos[0]));
      };
      fetchAnexos(value.id, value.tipo_requer);
    }, [value.id, value.tipo_requer]);
    return (
      <td>
        {value.numprocesso}
        <div>
          {anexos.map((valuesAnexos, key) => (
            <p key={key} style={{ color: "red", margin: "0" }}>
              {valuesAnexos.processo_anexo}
            </p>
          ))}
          
        </div>
      </td>
    );
  };

  const handleDeleteCell = (cellId, requer) => {
    axios
      .delete(`http://localhost:3030/main/delete/${cellId}/${requer}`)
      .then((response) => {
        toast.success(response.data);
        fetchDataValues();
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          toast.error(error.response.data);
        } else if (error.message) {
          toast.error(error.message);
        } else {
          toast.error("Erro ao deletar o pedido");
        }
      });
  };

  const handleEditCell = (values) => {
    setOpenModalEdit(true);
    setEditingItem(values);
  };

  let selectedValues = dataValues;
  if (type !== "Todos") {
    selectedValues = dataValues.filter(
      (valuesType) => valuesType.tipo_requer === type
    );
  }
  return selectedValues.length > 0 ? (
    <div>
    {selectedValues.map((values, key) => (
    <div key={key}>
      <table>
        <thead>
          <tr>
            <th>Requerimento</th>
            <th>Data do pedido ao arquivo</th>
            {values.tipo_requer === "Oficio" ? <th>Numero de Oficio</th> : null}
            <th>Numero do processo</th>
            <th>Nome de quem pediu</th>
            <th>Observações</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{`${values.tipo_requer} ${
              values.tipo_requer === "Oficio" ? `${values.sec}` : values.numero
            }`}</td>

            <td data-testid="date-cell" >{values.date}</td>
            {values.tipo_requer === "Oficio" ? <td>{values.numero}</td> : null}
            <ProcessosAnexos value={values} />
            <td>{values.name}</td>
            <td>
              <button
                title="Ver observaçoes"
                onClick={() => handleClickObs(values.id, values.tipo_requer)}
              >
                Consultar
              </button>
            </td>
            <td>
              <BiSolidEdit
                data-testid="icon-edit-main"
                title="Editar"
                onClick={() => handleEditCell(values)}
              />
              {openModalEdit && (
                <CellEdit
                  editingItem={editingItem}
                  closeModalEdit={() => setOpenModalEdit(false)}
                  fetchNewDataValues={() => fetchDataValues()}
                />
              )}
              <BiSolidTrashAlt
                data-testid="icon-deletecell-main"
                title="Deletar"
                onClick={() => handleDeleteCell(values.id, values.tipo_requer)}
              />
            </td>
          </tr>
        </tbody>
      </table>
      {openModal && (
        <Observacoes
          closeModal={() => setOpenModal(false)}
          id={id}
          tipoRequer={tipoRequer}
        />
      )}
    </div>
  ))}
  <ToastContainer />
    </div>
  ) : <div>Não existe pedidos para {type}</div>;
}
