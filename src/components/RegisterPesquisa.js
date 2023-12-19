import React, { useState } from "react";
import { MdOutlineAddBox } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../pages/css/register.css";

export default function RegisterPesquisa({ tipoRequer }) {
  const [values, setValues] = useState({});
  const [anexos, setAnexos] = useState("");
  const [arrayAnexos, setArrayAnexos] = useState([]);
  const navigate = useNavigate();

  const handleChanges = (value) => {
    setValues((prevValues) => ({
      ...prevValues,
      [value.target.name]: value.target.value,
    }));
  };

  const validateSchema = z.object({
    numpesquisa: z.string().min(1, "Campo Obrigatório"),
    date: z.string().min(1, "Campo Obrigatório"),
    numprocesso: z.string().min(1, "Campo Obrigatório"),
    name: z.string().min(1, "Campo Obrigatório"),
  });
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(validateSchema)
  });

  const submitData = () => {
        axios
          .post("http://localhost:3030/register/pesquisa", {
            tipo_requer: tipoRequer,
            numpesquisa: values.numpesquisa,
            date: values.date,
            numprocesso: values.numprocesso,
            name: values.name,
            anexos: arrayAnexos,
          })
          .then((res) => {
            toast.success(res.data);
            navigate("/main");
          })
          .catch((error) => {
            toast.error(error.response.data)
            navigate("/register/pesquisa");
          });
  };

  const handleAnexos = (e) => {
    setAnexos(e.target.value);
  };
  const addAnexos = () => {
    setArrayAnexos([...arrayAnexos, anexos]);
    setAnexos("");
  };

  return (
    <div>
    <h4>Cadastrar pedido de Pesquisa</h4>
      <form onSubmit={handleSubmit(submitData)} >
        <div className="input-register-container">
          <label htmlFor="numpesquisa">Numero da pesquisa</label>
          <input
            {...register("numpesquisa")}
            className="input-register"
            id="numpesquisa"
            type="text"
            onChange={handleChanges}
          />
          {errors.numpesquisa && <span data-testid="error-message-numpesquisa" style={{color: "red"}}>{errors.numpesquisa.message}</span>}
        </div>
        <div className="input-register-container">
          <label htmlFor="nprocesso" >Nº do processo</label>
          <input
            {...register("numprocesso")}
            className="input-register"
            id="nprocesso"
            type="text"
            onChange={handleChanges}
          />
          {errors.numprocesso && <span data-testid="error-message-numprocesso" style={{color: "red"}}>{errors.numprocesso.message}</span>}
        </div>
        <div className="input-register-container">
          <label htmlFor="anexoPesquisa" className="label-anexos">
            Anexos:
          </label>
          <input
            className="input-register"
            value={anexos}
            name="anexo-pesquisa"
            id="anexoPesquisa"
            type="text"
            onChange={handleAnexos}
          />
          <div>
            <label>
              <MdOutlineAddBox
                data-testid="addanexos"
                className="addAnexos"
                onClick={() => addAnexos()}
              />
            </label>
          </div>
        </div>
        <div className="list-container">
          Processos Anexos:
          {arrayAnexos.map((anexo, key) => (
            <ul className="horizontal-list" key={key}>
              <li>{anexo}</li>
            </ul>
          ))}
        </div>
        <div className="input-register-container">
          <label htmlFor="date" >Data que foi pedido</label>
          <input
            {...register("date")}
            className="input-register"
            type="date"
            id="date"
            pattern="\d{4}-\d{2}-\d{2}"
            onChange={handleChanges}
          />
          {errors.date && <span data-testid="error-message-date" style={{color: "red"}}>{errors.date.message}</span>}
        </div>
        <div className="input-register-container">
          <label htmlFor="nome" >Nome</label>
          <input
            {...register("name")}
            className="input-register"
            name="name"
            id="nome"
            type="text"
            onChange={handleChanges}
          />
          {errors.name && <span data-testid="error-message-nome" style={{color: "red"}}>{errors.name.message}</span>}
        </div>
        <button type="submit">Enviar</button>
        <ToastContainer />
      </form>
    </div>
  );
}
