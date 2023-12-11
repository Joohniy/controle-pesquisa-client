import React, { useState } from "react";
import { MdOutlineAddBox } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
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
            console.log(res.data);
            navigate("/main");
          })
          .catch((error) => {
            console.log(error, "Algo deu errado no registro");
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
    <h4>Register Pesquisa</h4>
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
          {errors.numpesquisa && <span style={{color: "red"}}>{errors.numpesquisa.message}</span>}
        </div>
        <div className="input-register-container">
          <label>Nº do processo</label>
          <input
            {...register("numprocesso")}
            className="input-register"
            type="text"
            onChange={handleChanges}
          />
          {errors.numprocesso && <span style={{color: "red"}}>{errors.numprocesso.message}</span>}
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
          <label>Data que foi pedido</label>
          <input
            {...register("date")}
            className="input-register"
            type="date"
            pattern="\d{4}-\d{2}-\d{2}"
            onChange={handleChanges}
          />
          {errors.date && <span style={{color: "red"}}>{errors.date.message}</span>}
        </div>
        <div className="input-register-container">
          <label>Quem pediu?</label>
          <input
            {...register("name")}
            className="input-register"
            name="name"
            type="text"
            onChange={handleChanges}
          />
          {errors.name && <span style={{color: "red"}}>{errors.name.message}</span>}
        </div>
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}
