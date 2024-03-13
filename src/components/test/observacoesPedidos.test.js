import { screen, render, waitFor } from "../../test-utils/index";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { toast } from "react-toastify";
import Observacoes from "../Observacoes";

jest.mock("axios");

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
});

async function mockData() {
  const dataMock = [
    {
      id: 69,
      observacao: "Solicitado Novamente",
      date: "2020-08-03",
    },
  ];
  return axios.get.mockResolvedValueOnce({ data: { observacoes: [dataMock] } });
}

test("render correctly", async () => {
  await mockData();
  render(<Observacoes tipoRequer={"Oficio"} />);
  expect(
    await screen.findByText("Solicitado Novamente em: 2020-08-03.")
  ).toBeInTheDocument();
});

test("add observacoes modal open", async () => {
  await mockData();
  const user = userEvent.setup();
  render(<Observacoes tipoRequer={"Pesquisa"} />);
  expect(
    await screen.findByText("Solicitado Novamente em: 2020-08-03.")
  ).toBeInTheDocument();
  const addObservacoesButton = await screen.findByRole("button", {
    name: "Adicionar Observação",
  });
  expect(addObservacoesButton).toBeInTheDocument();
  await user.click(addObservacoesButton);
  expect(await screen.findByText("Adicionar Observaçoes")).toBeInTheDocument();
});

test("message if there are no observacoes in the modal", async () => {
  axios.get.mockResolvedValueOnce({ data: [] });
  render(<Observacoes tipoRequer={"Oficio"} />);
  expect(
    await screen.findByText("Não há observações para este pedido.")
  ).toBeInTheDocument();
});

test("add a observacao correctly", async () => {
  await mockData();
  axios.post.mockResolvedValueOnce({ data: "Observação adicionada" });
  const user = userEvent.setup();
  render(<Observacoes tipoRequer={"Pesquisa"} />);
  expect(
    await screen.findByText("Solicitado Novamente em: 2020-08-03.")
  ).toBeInTheDocument();
  const buttonAddObservacao = await screen.findByRole("button", {
    name: "Adicionar Observação",
  });
  await user.click(buttonAddObservacao);
  expect(await screen.findByText("Adicionar Observaçoes")).toBeInTheDocument();
  const selectObservacoes = await screen.findByRole("combobox");
  await user.click(selectObservacoes);
  await user.selectOptions(selectObservacoes, "Solicitado Novamente");
  expect(selectObservacoes.value).toBe("Solicitado Novamente");
  const inputDate = await screen.findByTestId("date-input");
  expect(inputDate).toBeInTheDocument();
  await user.type(inputDate, "2021-08-03");
  expect(inputDate.value).toBe("2021-08-03");
  const buttonConfirmar = await screen.findByRole("button", { name: /confirmar/i });
  await user.click(buttonConfirmar);
  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith("http://localhost:3030/observacoes",
      { tipo_requer: "Pesquisa", observacao: "Solicitado Novamente", dateObs: "2021-08-03" }
    );
  });
});

test('observacao successfully deleted', async () => {
   await mockData();
   axios.delete.mockResolvedValueOnce({ data: "Observacao Oficio excluida." });
   const user = userEvent.setup();
   render(<Observacoes tipoRequer={"Oficio"}/>);
   expect(await screen.findByText("Solicitado Novamente em: 2020-08-03.")).toBeInTheDocument();
   const iconDeleteObservacao = await screen.findByTestId("delete-obs-main");
   expect(iconDeleteObservacao).toBeInTheDocument();
   await user.click(iconDeleteObservacao); 
   await waitFor(() => {
    expect(axios.delete).toHaveBeenCalledWith("http://localhost:3030/observacoes/delete/Oficio/69"); 
   });
});
