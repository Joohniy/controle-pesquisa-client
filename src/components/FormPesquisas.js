import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BiCheckboxChecked } from 'react-icons/bi';
import { MdOutlineAddBox } from 'react-icons/md';
import axios from "axios";

export default function FormPesquisas() {
  const [values, setValues] = useState({
    requerente: "",
    endereco: "",
    numero: "",
    numdigital: "",
    nprocesso: "",
  });
  const [hiddenProcessoInput, setHiddenProcessoInput] = useState(true);
  const [arrayAnexos, setArrayAnexos] = useState([])
  const [anexos, setAnexos] = useState("");

  const handleValues = (e) => {
    setValues((prevValues) => ({
      ...prevValues,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAnexos = (e) => {
    setAnexos(e.target.value);
  };

  const addAnexos = () => {
    setArrayAnexos([...arrayAnexos, anexos]);
    setAnexos("");
  };

  const submit = () => {
    axios.post("http://localhost:3030/pesquisas/register", {
        requerente: values.requerente,
        endereco: values.endereco,
        numero: values.numero,
        numdigital: values.numdigital,
        nprocesso: values?.nprocesso,
        anexos: arrayAnexos,
    })
    .then((response) => {
        console.log(response)
        clearInputs()
    })
    .catch((error) => console.log(error))
  };

  const validateSchema = z.object({
    requerente: z.string().min(1, "Preencha este campo"),
    endereco: z.string().min(1, "Preencha este campo"),
    numero: z.string().min(1, "Preencha este campo"),
    numdigital: z.string().min(1, "Preencha este campo"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validateSchema),
  });

  const clearInputs = () => {
    setValues((values) => ({
        ...values,
        requerente: "",
        endereco: "",
        numero: "",
        nprocesso: "",
        numdigital: "",
    }))
    setArrayAnexos([])
  }

  return (
    <div>
      <form onSubmit={handleSubmit(submit)}>
        <div>
          <h2>Cadastrar</h2>
          <div className="input-register-container">
            <label htmlFor="requerente">Requerente</label>
            <input
              type="text"
              id="requerente"
              className="input-register"
              value={values.requerente}
              {...register("requerente")}
              onChange={handleValues}
            />
            {errors.requerente && (
              <p className="FieldErrors" style={{ color: "red" }}>
                {errors.requerente.message}
              </p>
            )}
          </div>
          <div className="input-register-container">
            <label htmlFor="endereco">Endereço</label>
            <input
              type="text"
              id="endereco"
              className="input-register"
              value={values.endereco}
              {...register("endereco")}
              onChange={handleValues}
            />
            {errors.endereco && (
              <p className="FieldErrors" style={{ color: "red" }}>
                {errors.endereco.message}
              </p>
            )}
          </div>
          <div className="input-register-container">
            <label htmlFor="numero">Nº</label>
            <input
              type="text"
              id="numero"
              className="input-register"
              value={values.numero}
              {...register("numero")}
              onChange={handleValues}
            />
            {errors.numero && (
              <p className="FieldErrors" style={{ color: "red" }}>
                {errors.numero.message}
              </p>
            )}
          </div>
          <div className="input-register-container">
            <label htmlFor="numdigital">Nº Protocolo Digital</label>
            <input
            type="text"
            id="numdigital"
            className="input-register"
            values={values.numdigital}
            {...register("numdigital")}
            onChange={handleValues} 
            />
            {errors.numdigital && <p className="FieldError" style={{ color: "red" }}>{errors.numdigital.message}</p>}
          </div>
          <div>
            <label>Possui numero de processo?</label>
            <BiCheckboxChecked 
            size={32} 
            onClick={() => setHiddenProcessoInput(false)} 
            />
          </div>
          <div className="input-register-container" hidden={hiddenProcessoInput}>
            <label htmlFor="nprocesso">Numero de processo</label>
            <input
              type="text"
              id="nprocesso"
              className="input-register"
              value={values.nprocesso}
              {...register("nprocesso")}
              onChange={handleValues}
            />
            <label>Anexos</label>
            <input
             type="text" 
             className="input-register" 
             value={anexos} 
             onChange={handleAnexos}
             />
            <MdOutlineAddBox 
            size={25} 
            onClick={() => addAnexos()}
            />
            <div className="list-container" hidden={arrayAnexos.length === 0}>
             {arrayAnexos.map((anexos, key) => (
               <ul className="horizontal-list" key={key}>
                 <li value={anexos}>{anexos}</li>
                </ul> 
             ))}
            </div>
          </div>
          <div>
            <button className="button-register" type="submit">
              Enviar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
