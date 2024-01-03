import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BiCheckboxChecked } from "react-icons/bi";
import { MdOutlineAddBox } from "react-icons/md";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function FormPesquisas() {
  const [values, setValues] = useState({
    requerente: "",
    endereco: "",
    numero: "",
    numdigital: "",
    nprocesso: "",
  });
  const [hiddenProcessoInput, setHiddenProcessoInput] = useState(true);
  const [arrayAnexos, setArrayAnexos] = useState([]);
  const [anexos, setAnexos] = useState("");

  const navigate = useNavigate();

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
    if (anexos === "") {
      return "Não é possivel adicionar um anexo sem valor";
      //tratar essa condicao com o zod
    } else {
      setArrayAnexos([...arrayAnexos, anexos]);
      setAnexos("");
    }
  };

  const submit = () => {
    axios
      .post("http://localhost:3030/pesquisas/register", {
        requerente: values.requerente,
        endereco: values.endereco,
        numero: values.numero,
        numdigital: values.numdigital,
        nprocesso: values?.nprocesso,
        anexos: arrayAnexos,
      })
      .then((response) => {
        toast.success(response.data);
        clearInputs();
        navigate("/pesquisas");
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data);
        navigate("/pesquisas/register");
      });
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
    }));
  };

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
              <p data-testid="error-message-requerente" className="FieldErrors" style={{ color: "red" }}>
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
              <p data-testid="error-message-endereco" className="FieldErrors" style={{ color: "red" }}>
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
              <p data-testid="error-message-numero" className="FieldErrors" style={{ color: "red" }}>
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
              value={values.numdigital}
              {...register("numdigital")}
              onChange={handleValues}
            />
            {errors.numdigital && (
              <p data-testid="error-message-numdigital" className="FieldError" style={{ color: "red" }}>
                {errors.numdigital.message}
              </p>
            )}
          </div>

          <div>
            <label>Possui numero de processo?</label>
            <BiCheckboxChecked
              data-testid="icon-processo-input"
              size={32}
              onClick={() => setHiddenProcessoInput(false)}
            />
          </div>
          <div
            className="input-register-container"
            hidden={hiddenProcessoInput}
          >
            <label htmlFor="nprocesso">Numero de processo</label>
            <input
              type="text"
              id="nprocesso"
              className="input-register"
              value={values.nprocesso}
              {...register("nprocesso")}
              onChange={handleValues}
            />

            <label htmlFor="anexos">Anexos</label>
            <input
              type="text"
              className="input-register"
              id="anexos"
              value={anexos}
              onChange={handleAnexos}
            />
            <MdOutlineAddBox size={25} onClick={() => addAnexos()} />
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
        <ToastContainer />
      </form>
    </div>
  );
}
