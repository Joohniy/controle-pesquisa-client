import { useState, useEffect } from "react";
import axios from "axios";
import { GrAddCircle } from "react-icons/gr";
import { BiSolidTrashAlt, BiSolidEdit } from "react-icons/bi";
import { IoIosListBox } from "react-icons/io";
import AddProcessoModal from "./AddProcessoModal";
import ModalObservacoesPesquisa from "./ObservacoesPesquisa";
import CellEditPesquisas from "./CellEditPesquisas";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function TablePesquisas() {
  const [data, setData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openModalObservacoes, setOpenModalObservacoes] = useState(false);
  const [openModalEditPesquisas, setOpenModalEditPesquisas] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const fetchData = () => {
    axios
      .get("http://localhost:3030/pesquisas")
      .then((response) => setData(response.data.pesquisas[0]))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const ProcessosAnexos = ({ value }) => {
    const [anexos, setAnexos] = useState([]);
    useEffect(() => {
      const fetchAnexos = (id) => {
        axios
          .get(`http://localhost:3030/pesquisas/anexos/${id}`)
          .then((response) => setAnexos(response.data.anexos[0]))
          .catch((error) => console.log(error));
      };
      fetchAnexos(value.id);
    }, [value.id]);
    return (
      <td>
        {!value.numero_processo
          ? "Nada localizado ainda"
          : value.numero_processo}
        <div>
          {anexos.map((anexoValues) => (
            <p
              key={anexoValues.id_anexo}
              style={{ color: "red", margin: "3px" }}
            >
              {anexoValues.anexos}
            </p>
          ))}
        </div>
      </td>
    );
  };

  const handleAddProcesso = (cellValues) => {
    setOpenModal(true);
    setEditingItem(cellValues);
  };

  const handleOpenModalObservacoes = (cellValues) => {
    setOpenModalObservacoes(true);
    setEditingItem(cellValues);
  };

  const handleOpenModalEditPesquisa = (cellValues) => {
    setOpenModalEditPesquisas(true);
    setEditingItem(cellValues);
  };

  const handleDeleteCell = (cellId) => {
    axios
      .delete(`http://localhost:3030/pesquisas/delete/${cellId}`)
      .then((response) => {
        console.log(response.data);
        toast.success(response.data)
        fetchData();
      })
      .catch((error) => console.log(error));
  };
   
  return (
    <>
      {data.map((values, index) => (
        <div key={index}>
          <table>
            <thead>
              <tr>
                <th>Nº</th>
                <th>Requerente</th>
                <th>Endereço para pesquisa</th>
                <th>Nº protocolo digital</th>
                <th>
                  Processo{" "}
                  <GrAddCircle
                    size={17}
                    onClick={() => handleAddProcesso(values)}
                  />
                </th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ width: "1px" }}>{index + 1}</td>
                <td>{values.requerente}</td>
                <td>{`${values.endereco}, ${values.numero_imovel}`}</td>
                <td>{!values.numdigital ? "-" : values.numdigital}</td>
                <ProcessosAnexos value={values} />
                <td>
                  <IoIosListBox 
                  title="Observações"
                  data-testid="icon-observacoes"
                  onClick={() => handleOpenModalObservacoes(values)} 
                  size={22}
                  />
                  <BiSolidEdit
                  data-testid="icon-edit"
                  size={22}
                  onClick={() => handleOpenModalEditPesquisa(values)}
                  />
                  <BiSolidTrashAlt
                  data-testid="icon-delete"
                  title="Deletar"
                  size={22}
                  onClick={() => handleDeleteCell(values.id)}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
      {openModal ? (
        <AddProcessoModal
          editingItem={editingItem}
          closeModal={setOpenModal}
          updateTable={fetchData}
        />
      ) : null}
      {openModalObservacoes ? (
        <ModalObservacoesPesquisa 
        closeModalObservacoesPesquisa={setOpenModalObservacoes}
        editingItem={editingItem}
        />
      ) : null}
      {openModalEditPesquisas ? (
        <CellEditPesquisas
        editingCell={editingItem}
        closeModal={setOpenModalEditPesquisas}
        updateTable={fetchData}  
        />
      ) : null}
      <ToastContainer />
    </>
  );
}
