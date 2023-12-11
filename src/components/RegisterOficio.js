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

export default function RegisterOficio({ tipoRequer }) {
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
    secretaria: z.string().min(1, "Campo obrigatório"),
    numoficio: z.string().min(1, "Campo obrigatório"),
    date: z.string().min(1, "Campo obrigatório"),
    numprocesso: z.string().min(1, "Campo obrigatório"),
    name: z.string().min(1, "Campo obrigatório")
  })

  const { register, handleSubmit, formState: { errors }} = useForm({
    resolver: zodResolver(validateSchema)
  });
 
  const submitData = () => {
    axios
      .post("http://localhost:3030/register/oficio", {
        tipo_requer: tipoRequer,
        secretaria: values.secretaria,
        numoficio: values.numoficio,
        date: values.date,
        numprocesso: values.numprocesso,
        name: values.name,
        anexos: arrayAnexos,
      })
      .then((res) => {
        toast.success(res.data)
        navigate("/main");
      })
      .catch((error) => {
        console.log(error);
        toast.error(error);
        navigate("/register");
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
      <h4>Register Oficio</h4>
      <form onSubmit={handleSubmit(submitData)} data-testid="register-form">
        <div className="input-register-container">
          <label htmlFor="numoficio">Numero do Oficio</label>
          <input
            {...register("numoficio")}
            className="input-register"
            id="numoficio"
            type="text"
            onChange={handleChanges}
          />
          {errors.numoficio && <span data-testid="error-message-numoficio" style={{color: "red"}}>{errors.numoficio.message}</span>}
        </div>
        <div className="input-register-container">
          <label htmlFor="secretaria">Secretaria</label>
          <input
            {...register("secretaria")}
            className="input-register"
            id="secretaria"
            type="text"
            onChange={handleChanges}
          />
          {errors.secretaria && <span data-testid="error-message-secretaria" style={{color: "red"}}>{errors.secretaria.message}</span>}
        </div>
        <div className="input-register-container">
          <label htmlFor="numprocesso">Nº do processo</label>
          <input
            {...register("numprocesso")}
            className="input-register"
            id="numprocesso"
            type="text"
            onChange={handleChanges}
          />
          {errors.numprocesso && <span data-testid="error-message-numprocesso" style={{color: "red"}}>{errors.numprocesso.message}</span>}
        </div>
        <div className="input-register-container">
          <label htmlFor="anexoOficio" className="label-anexos">
            Anexos:
          </label>
          <input
            className="input-register"
            value={anexos}
            name="anexo-oficio"
            id="anexoOficio"
            type="text"
            onChange={handleAnexos}
          />
        </div>
        <div>
          <label>
            <MdOutlineAddBox
              data-testid="addanexos"
              className="addAnexos"
              onClick={() => addAnexos()}
            />
          </label>
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
          {errors.date && <span data-testid="error-message-date" style={{color: "red"}} >{errors.date.message}</span>}
        </div>
        <div className="input-register-container">
          <label htmlFor="nome">Quem pediu</label>
          <input
            {...register("name")}
            className="input-register"
            id="nome"
            type="text"
            onChange={handleChanges}
          />
          {errors.name && <span data-testid="error-message-nome" style={{color: "red"}} >{errors.name.message}</span>}
        </div>
        <div className="button-register-container">
          <button className="button-register" type="submit" data-testid="button-submit">
            Enviar
          </button>
        </div>
      <ToastContainer />
      </form>
    </div>
  );
}
