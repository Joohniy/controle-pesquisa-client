import { screen, render, waitFor } from "../../test-utils/index";
import userEvent from "@testing-library/user-event";
import TablePesquisas from "../TablePesquisas";
import axios from "axios";
import { toast } from "react-toastify"; 

jest.mock("axios");
jest.mock("react-toastify");

beforeEach(() => {
  jest.clearAllMocks();
});

async function mockedData() {
  const dataMock = [
    {
      id: 30,
      requerente: "Any",
      endereco: "Coronel domingos ramos",
      numero_imovel: "37",
      numero_processo: "13011/2024",
      numdigital: "2023031114547",
    },
  ];
  const anexosMock = [{ id_anexo: 30, anexos: "2555/2023" }];
  return axios.get
    .mockResolvedValueOnce({ data: { pesquisas: [dataMock] } })
    .mockResolvedValue({ data: { anexos: [anexosMock] } });
};

async function inputsEditModal(inputLabel, defaultValue) {
  const input = await screen.findByLabelText(inputLabel);
  expect(input).toBeInTheDocument();
  expect(input).toHaveValue(defaultValue);
};

test("render table correctly", async () => {
  await mockedData();
  render(<TablePesquisas />);
  expect(await screen.findByText("Any")).toBeInTheDocument();
});

test("observacao modal is open", async () => {
  await mockedData();
  const mockObservacoesPesquisas = [
    {
      id_requerimento_cadastrado: 30,
      id_requerimento_observacoes: 1,
      date: "2023-11-20",
      observacao: "Entrou em contato",
    },
  ];
  axios.get.mockResolvedValue({
    data: { observacoes: [mockObservacoesPesquisas] },
  });
  const user = userEvent.setup();
  render(<TablePesquisas />);
  expect(await screen.findByText("Any")).toBeInTheDocument();
  const iconObservacoes = await screen.findByTestId("icon-observacoes");
  expect(iconObservacoes).toBeInTheDocument();
  await user.click(iconObservacoes);
  expect(await screen.findByText("Modal observaçoes")).toBeInTheDocument();
  expect(await screen.findByText("Entrou em contato em: 2023-11-20")).toBeInTheDocument();
});

test("edit modal is open", async () => {
  await mockedData();
  axios.post.mockResolvedValueOnce({ data: "Valores Atualizados" }); 
  const user = userEvent.setup();
  render(<TablePesquisas />);
  expect(await screen.findByText("Any")).toBeInTheDocument();
  const iconEdit = await screen.findByTestId("icon-edit");
  expect(iconEdit).toBeInTheDocument();
  await user.click(iconEdit);
  expect(await screen.findByText("Edição de campos")).toBeInTheDocument();
  await inputsEditModal("Alterar requerente:", "Any");
  await inputsEditModal("Alterar endereço:", "Coronel domingos ramos");
  await inputsEditModal("Alterar nº imóvel:", "37");
  await inputsEditModal("Alterar numero protocolo digital:", "2023031114547");
  await inputsEditModal("Alterar processo:", "13011/2024");
  //as linhas debaixos funcionam melhor na hora de testar o componente de edit. TODO
  const input = await screen.findByLabelText("Alterar requerente:");
  await user.click(input);
  await user.clear(input);
  expect(input).toHaveValue("");
  await user.type(input, "john");
  const confirmButton = await screen.findByRole("button", { name: "Confirmar" });
  await user.click(confirmButton);
  await waitFor(() => {
    expect(toast.success).toHaveBeenCalledWith("Valores Atualizados"); 
  });
  await waitFor(() => {
    expect(axios.post).toHaveBeenCalled(); 
  });
});

test('table cell is successfully deleted', async () => {
  await mockedData();
  axios.delete.mockResolvedValueOnce({ data: "Celula deletada com sucesso" });
  const user = userEvent.setup();
  render(<TablePesquisas />);
  expect(await screen.findByText("Any")).toBeInTheDocument();
  const deleteIcon = await screen.findByTestId("icon-delete");
  await user.click(deleteIcon);
  await waitFor(() => {
    expect(axios.delete).toHaveBeenCalled(); 
  });
  await waitFor(() => {
    expect(toast.success).toHaveBeenCalledWith("Celula deletada com sucesso");
  }); 
});
