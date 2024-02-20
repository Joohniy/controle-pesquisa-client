import { screen, render, waitFor } from "../../test-utils/index";
import userEvent from "@testing-library/user-event";
import TablePesquisas from "../TablePesquisas";
import axios from "axios";

jest.mock("axios");

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
}

test("render table correctly", async () => {
  await mockedData()
  render(<TablePesquisas />);
  expect(await screen.findByText("Any")).toBeInTheDocument();
});

test("observacao modal is open", async () => {
  await mockedData();
  const user = userEvent.setup();
  render(<TablePesquisas />); 
  expect(await screen.findByText("Any")).toBeInTheDocument(); 
  const iconObservacoes = await screen.findByTestId("icon-observacoes");
  expect(iconObservacoes).toBeInTheDocument();
  await user.click(iconObservacoes);
  expect(await screen.findByText("Modal observaçoes")).toBeInTheDocument();
  //fazer a chamada axios.get que traz as observacoes
});

test('edit modal is open', async () => {
  await mockedData();
  const user = userEvent.setup();
  render(<TablePesquisas/>);
  expect(await screen.findByText("Any")).toBeInTheDocument();
  const iconEdit = await screen.findByTestId("icon-edit");
  expect(iconEdit).toBeInTheDocument();
  await user.click(iconEdit);
  expect(await screen.findByText("Edição de campos")).toBeInTheDocument(); 
  //fazer a chamada axios.get que traz os campos para ediçao
});
