import { screen, render, waitFor } from "../../test-utils/index";
import FormPesquisas from "../FormPesquisas";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { toast } from "react-toastify";

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
});

jest.mock("axios");
jest.mock("react-toastify");
const mockUseNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockUseNavigate,
}));

test("component renders correctly", () => {
  render(<FormPesquisas />);
  const title = screen.getByText("Cadastrar");
  expect(title).toBeInTheDocument();
});

test("show input processo and anexos", async () => {
  const user = userEvent.setup();
  render(<FormPesquisas />);
  const iconShowInputs = screen.getByTestId("icon-processo-input");
  expect(iconShowInputs).toBeInTheDocument();
  await user.click(iconShowInputs);
  const inputNumProcesso = screen.getByLabelText(/numero de processo/i);
  const inputAnexos = screen.getByLabelText(/anexos/i);
  expect(inputNumProcesso).toBeInTheDocument();
  expect(inputAnexos).toBeInTheDocument();
});

test("submit form is sent successfully", async () => {
  axios.post.mockResolvedValue({ data: "Cadastrado com sucesso" });
  const user = userEvent.setup();
  render(<FormPesquisas />);
  async function testInputValues(label, fakeValue) {
    const input = screen.getByLabelText(label);
    await user.type(input, fakeValue);
    expect(input).toHaveValue(fakeValue);
  }
  await testInputValues("Requerente", "Joao");
  await testInputValues("Endereço", "São Paulo");
  await testInputValues("Nº", "1");
  await testInputValues("Nº Protocolo Digital", "202303123456");
  const submitButton = screen.getByRole("button", { name: "Enviar" });
  await user.click(submitButton);
  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:3030/pesquisas/register",
      {
        requerente: "Joao",
        endereco: "São Paulo",
        numero: "1",
        numdigital: "202303123456",
        nprocesso: "",
        anexos: [],
      }
    );
  });
  await waitFor(() => {
    expect(toast.success).toHaveBeenCalledWith("Cadastrado com sucesso");
  });
  await waitFor(() => {
    expect(mockUseNavigate).toHaveBeenCalledWith("/pesquisas");
  });
});

test("error in axios request", async () => {
  axios.post.mockRejectedValue({ response: { data: "Server error" } });
  const user = userEvent.setup();
  render(<FormPesquisas />);
  async function testInputValues(label, fakeValue) {
    const input = screen.getByLabelText(label);
    await user.type(input, fakeValue);
    expect(input).toHaveValue(fakeValue);
  }
  await testInputValues("Requerente", "Joao");
  await testInputValues("Endereço", "São Paulo");
  await testInputValues("Nº", "1");
  await testInputValues("Nº Protocolo Digital", "202303123456");
  const submitButton = screen.getByRole("button", { name: "Enviar" });
  await user.click(submitButton);
  await waitFor(() => {
    expect(axios.post).toHaveBeenCalled();
  });
  await waitFor(() => {
    expect(toast.error).toHaveBeenCalledWith("Server error");
  });
  await waitFor(() => {
    expect(mockUseNavigate).toHaveBeenCalledWith("/pesquisas/register");
  });
});

test("inputs are correctly cleaned", async () => {
  axios.post.mockResolvedValue({ data: "Cadastrado com sucesso" });
  const user = userEvent.setup();
  render(<FormPesquisas />);
  const inputRequerente = screen.getByLabelText("Requerente");
  await user.type(inputRequerente, "nome requerente");
  expect(inputRequerente).toHaveValue("nome requerente");
  const inputEndereco = screen.getByLabelText("Endereço");
  await user.type(inputEndereco, "endereco requerente");
  expect(inputEndereco).toHaveValue("endereco requerente");
  const inputNumero = screen.getByLabelText("Nº");
  await user.type(inputNumero, "numero casa requerente");
  expect(inputNumero).toHaveValue("numero casa requerente");
  const inputNumDigital = screen.getByLabelText("Nº Protocolo Digital");
  await user.type(inputNumDigital, "numero digital");
  expect(inputNumDigital).toHaveValue("numero digital");
  const buttonSubmit = screen.getByRole("button", { name: "Enviar" });
  await user.click(buttonSubmit);
  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledTimes(1);
  });
  await waitFor(() => {
    expect(toast.success).toHaveBeenCalledWith("Cadastrado com sucesso");
  });
  async function expectEmptyValues(...input) {
    const inputArray = input.map((inputs) => {
      return expect(inputs).toHaveValue("");
    });
    return inputArray;
  }
  await expectEmptyValues(inputRequerente, inputEndereco, inputNumero, inputNumDigital);
});

test("error message in case empty inputs", async () => {
  const user = userEvent.setup();
  render(<FormPesquisas />);
  async function testErrorMessage(inputLabel, testid) {
     const input = screen.getByLabelText(inputLabel);
     expect(input).toHaveValue("");
     const buttonSubmit = screen.getByRole("button", { name: "Enviar" });
     await user.click(buttonSubmit);
     await waitFor(() => {
        const errorMessage = screen.getByTestId(testid);
        expect(errorMessage).toBeInTheDocument();
     });
     await waitFor(() => {
      const errorMessage = screen.getByTestId(testid);
      expect(errorMessage).toHaveTextContent("Preencha este campo")
     });
  };
  await testErrorMessage("Requerente", "error-message-requerente");
  await testErrorMessage("Endereço", "error-message-endereco");
  await testErrorMessage("Nº", "error-message-numero");
  await testErrorMessage("Nº Protocolo Digital", "error-message-numdigital");
});
