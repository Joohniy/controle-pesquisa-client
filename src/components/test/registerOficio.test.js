import { render, screen, waitFor } from "../../test-utils/index";
import userEvent from "@testing-library/user-event";
import RegisterOficio from "../RegisterOficio";
import axios from "axios";
import { toast } from "react-toastify";


jest.mock("axios");
jest.mock("react-toastify");
const mockedUseNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUseNavigate, 
}));

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks()
});

test("check if the component is rendered", () => {
  render(<RegisterOficio tipoRequer={"Oficio"} />);
  const pageTitle = screen.getByText(/cadastrar pedido de oficio/i);
  expect(pageTitle).toBeInTheDocument();
})

test("submit form is sent successfully", async () => {
  axios.post.mockResolvedValue({
    data: "Pedido de oficio cadastrado com sucesso",
  });
  const user = userEvent.setup();
  render(<RegisterOficio tipoRequer={"Oficio"} />);
  const inputNumOficio = screen.getByLabelText(/numero do oficio/i);
  await user.type(inputNumOficio, "20230312345");
  expect(inputNumOficio).toHaveValue("20230312345");
  const inputSecretaria = screen.getByLabelText(/secretaria/i);
  await user.type(inputSecretaria, "PGM");
  expect(inputSecretaria).toHaveValue("PGM");
  const inputNumProcesso = screen.getByLabelText(/nº do processo/i);
  await user.type(inputNumProcesso, "1445/2023");
  expect(inputNumProcesso).toHaveValue("1445/2023");
  const inputDate = screen.getByLabelText(/data que foi pedido/i);
  await user.click(inputDate);
  await user.type(inputDate, "2023-12-05");
  expect(inputDate).toHaveValue("2023-12-05");
  const inputNome = screen.getByLabelText(/quem pediu/i);
  await user.type(inputNome, "Any");
  expect(inputNome).toHaveValue("Any");
  await userEvent.click(screen.getByRole("button", { name: /enviar/i }));
  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:3030/register/oficio",
      {
        tipo_requer: "Oficio",
        secretaria: "PGM",
        numoficio: "20230312345",
        date: "2023-12-05",
        numprocesso: "1445/2023",
        name: "Any",
        anexos: [],
      }
    );
  });
  await waitFor(() => {
    expect(toast.success).toHaveBeenCalledWith(
      "Pedido de oficio cadastrado com sucesso"
    );
  });
  await waitFor(() => {
    expect(mockedUseNavigate).toHaveBeenCalledWith("/main");
  });
});

test("error in axios request", async () => {
  axios.post.mockRejectedValue({ response: { data: "Erro no servidor" }});
  const user = userEvent.setup();
  render(<RegisterOficio tipoRequer={"Oficio"} />);
  const inputNumOficio = screen.getByLabelText(/numero do oficio/i);
  await user.type(inputNumOficio, "20230312345");
  expect(inputNumOficio).toHaveValue("20230312345");
  const inputSecretaria = screen.getByLabelText(/secretaria/i);
  await user.type(inputSecretaria, "PGM");
  expect(inputSecretaria).toHaveValue("PGM");
  const inputNumProcesso = screen.getByLabelText(/nº do processo/i);
  await user.type(inputNumProcesso, "1445/2023");
  expect(inputNumProcesso).toHaveValue("1445/2023");
  const inputDate = screen.getByLabelText(/data que foi pedido/i);
  await user.click(inputDate);
  await user.type(inputDate, "2023-12-05");
  expect(inputDate).toHaveValue("2023-12-05");
  const inputNome = screen.getByLabelText(/quem pediu/i);
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
    expect(mockedUseNavigate).toHaveBeenCalledWith("/register");
  })
});

test("add anexos", async () => {
  const user = userEvent.setup();
  render(<RegisterOficio />);
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

test("error message when clicking in submit button when fields are empty", async () => {
  render(<RegisterOficio tipoRequer={"Oficio"} />);
  async function testInputFields(inputLabel, testId) {
    const user = userEvent.setup();
    const submitButton = screen.getByRole("button", { name: /enviar/i });
    const inputField = screen.getByLabelText(inputLabel);
    expect(inputField).toHaveValue("");
    await user.click(submitButton);
    await waitFor(() => {
      const errorMessage = screen.getByTestId(testId);
      expect(errorMessage).toBeInTheDocument();
    });
    await waitFor(() => {
      const errorMessage = screen.getByTestId(testId);
      expect(errorMessage).toHaveTextContent("Campo obrigatório");
    });
  }
  await testInputFields(
    "Numero do Oficio",
    "error-message-numoficio", 
  );
  await testInputFields(
    "Secretaria",
    "error-message-secretaria",
  );
  await testInputFields(
    "Nº do processo",
    "error-message-numprocesso",
  );
  await testInputFields(
    "Data que foi pedido",
    "error-message-date",
  );
  await testInputFields(
    "Quem pediu",
    "error-message-nome",
  );
});
