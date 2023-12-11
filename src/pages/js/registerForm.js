import React, { useState } from "react";
import "../css/register.css";
import RegisterOficio from "../../components/RegisterOficio";
import RegisterPesquisa from "../../components/RegisterPesquisa";

export default function Register() {
  const [checkboxStatusPesquisa, setCheckboxStatusPesquisa] = useState(false);
  const [checkboxStatusOf, setCheckboxStatusOf] = useState(false);
  const [checkBoxValue, setCheckBoxValue] = useState(null);

  return (
    <div>
      <div className="checkbox-container" >
      <h1>Hello World</h1>
      <label htmlFor="pesquisa-checkbox">Pesquisa</label>
      <input
        className="input-checkbox"
        name="checkbox"
        value={"Pesquisa"}
        id="pesquisa-checkbox"
        type="checkbox"
        onChange={(e) => setCheckboxStatusPesquisa(e.target.checked)}
        onClick={(e) =>setCheckBoxValue(e.target.value)}
        disabled={checkboxStatusOf}
      />
      </div>
      <div className="checkbox-container" >
      <label htmlFor="oficio-checkbox">Oficio</label>
      <input
        className="input-checkbox"
        name="checkbox"
        value={"Oficio"}
        id="oficio-checkbox"
        type="checkbox"
        onChange={(e) => setCheckboxStatusOf(e.target.checked)}
        onClick={(e) =>setCheckBoxValue(e.target.value)}
        disabled={checkboxStatusPesquisa}
      />
      </div>
      <div>
        {checkboxStatusOf && <RegisterOficio tipoRequer={checkBoxValue} />}
        {checkboxStatusPesquisa && <RegisterPesquisa tipoRequer={checkBoxValue}/>}
       </div>
    </div>
  );
}
