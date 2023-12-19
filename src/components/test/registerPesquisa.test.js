import { render, screen, waitFor } from "../../test-utils/index";
import userEvent from "@testing-library/user-event";
import RegisterPesquisa from "../RegisterPesquisa";
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

test("check if the component is rendered", () => {
  render(<RegisterPesquisa tipoRequer={"Pesquisa"} />);
  const pageTitle = screen.getByText(/cadastrar pedido de pesquisa/i);
  expect(pageTitle).toBeInTheDocument();
});

test("submit form is sent successfully", async () => {
  axios.post.mockResolvedValue({ data: "Pedido de pesquisa cadastrado com sucesso" });
  const user = userEvent.setup();
  render(<RegisterPesquisa tipoRequer={"Pesquisa"} />);
  const inputNumPesquisa = screen.getByLabelText(/numero da pesquisa/i);
  await user.click(inputNumPesquisa);
  await user.type(inputNumPesquisa, "30");
  expect(inputNumPesquisa).toHaveValue("30");
  const inputNumProcesso = screen.getByLabelText(/nº do processo/i);
  await user.click(inputNumProcesso);
  await user.type(inputNumProcesso, "4555/2013");
  expect(inputNumProcesso).toHaveValue("4555/2013");
  const inputDate = screen.getByLabelText(/data que foi pedido/i);
  await user.click(inputDate);
  await user.type(inputDate, "2023-04-12");
  expect(inputDate).toHaveValue("2023-04-12");
  const inputNome = screen.getByLabelText(/nome/i);
  await user.click(inputNome);
  await user.type(inputNome, "Any");
  expect(inputNome).toHaveValue("Any");
  await userEvent.click(screen.getByRole("button", { name: /enviar/i }));
  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:3030/register/pesquisa",
      {
        tipo_requer: "Pesquisa",
        numpesquisa: "30",
        date: "2023-04-12",
        numprocesso: "4555/2013",
        name: "Any",
        anexos: [],
      }
    )});
  await waitFor(() => {
    expect(toast.success).toHaveBeenCalledWith("Pedido de pesquisa cadastrado com sucesso")
  });
  await waitFor(() => {
    expect(mockUseNavigate).toHaveBeenCalledWith("/main");
  }); 
});

test("error in axios request", async () => {
  axios.post.mockRejectedValue({ response: { data: "Erro no servidor" } });
  const user = userEvent.setup();
  render(<RegisterPesquisa tipoRequer={"Pesquisa"}/>);
  const inputNumPesquisa = screen.getByLabelText(/numero da pesquisa/i);
  await user.click(inputNumPesquisa);
  await user.type(inputNumPesquisa, "30");
  expect(inputNumPesquisa).toHaveValue("30");
  const inputNumProcesso = screen.getByLabelText(/nº do processo/i);
  await user.click(inputNumProcesso);
  await user.type(inputNumProcesso, "4555/2013");
  expect(inputNumProcesso).toHaveValue("4555/2013");
  const inputDate = screen.getByLabelText(/data que foi pedido/i);
  await user.click(inputDate);
  await user.type(inputDate, "2023-04-12");
  expect(inputDate).toHaveValue("2023-04-12");
  const inputNome = screen.getByLabelText(/nome/i);
  await user.click(inputNome);
  await user.type(inputNome, "Any");
  expect(inputNome).toHaveValue("Any");
  await userEvent.click(screen.getByRole("button", { name: /enviar/i }));
  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledTimes(1);
  });
  await waitFor(() => {
    expect(toast.error).toHaveBeenCalledWith("Erro no servidor");
  });
  await waitFor(() => {
    expect(mockUseNavigate).toHaveBeenCalledWith("/register/pesquisa");
  });
});

test("add anexos", async () => {
  const user = userEvent.setup();
  render(<RegisterPesquisa tipoRequer={"Pesquisa"}/>);
  const anexosInput = screen.getByLabelText(/anexos:/i);
  const addAnexosButton = screen.getByTestId("addanexos");
  await user.type(anexosInput, "12345/2023");
  await user.click(addAnexosButton);
  expect(anexosInput).toHaveValue("");
  await user.type(anexosInput, "7897/2023");
  await user.click(addAnexosButton);
  expect(anexosInput).toHaveValue("");
  await user.type(anexosInput, "4455/2023");
  await user.click(addAnexosButton);
  expect(anexosInput).toHaveValue("");
  expect(screen.getByText("12345/2023")).toBeInTheDocument();
  expect(screen.getByText("7897/2023")).toBeInTheDocument();
  expect(screen.getByText("4455/2023")).toBeInTheDocument();
});

test('error message when clicking in submit button when fields are empty', async () => {
  render(<RegisterPesquisa tipoRequer={"Pesquisa"}/>);
  async function testInputErrorMessage(label, testId) {
    const user = userEvent.setup();
    const submitButton = screen.getByRole("button", { name: /enviar/i });
    await user.click(submitButton);
    const input = screen.getByLabelText(label);
    expect(input).toHaveValue("");
    const errorMessage = screen.getByTestId(testId);
    expect(errorMessage).toHaveTextContent("Campo Obrigatório");
  };
  await testInputErrorMessage("Numero da pesquisa", "error-message-numpesquisa");
  await testInputErrorMessage("Nº do processo", "error-message-numprocesso");
  await testInputErrorMessage("Data que foi pedido", "error-message-date");
  await testInputErrorMessage("Nome", "error-message-nome");
});
