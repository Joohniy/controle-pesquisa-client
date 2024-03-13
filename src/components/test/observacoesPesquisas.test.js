import { screen, render, waitFor, findByText } from "../../test-utils/index";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { toast } from "react-toastify";
import ObservacoesPesquisa from "../ObservacoesPesquisa";

jest.mock("axios");

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
});

async function mockData() {
  const dataMock = [
    {
      date: "2024-03-09",
      id_requerimento_cadastrado: 62,
      id_requerimento_observacoes: 15,
      observacao: "Encaminhado",
    },
  ];
  return axios.get.mockResolvedValueOnce({ data: { observacoes: [dataMock] } });
}

async function selectValue(value) {
  const user = userEvent.setup();
  const select = await screen.findByRole("combobox");
  await user.click(select);
  await user.selectOptions(select, value);
  return expect(select.value).toBe(value);
}

test("component render correctly", async () => {
  await mockData();
  const editingItemIdMock = { id: 62 };
  render(<ObservacoesPesquisa editingItem={editingItemIdMock} />);
  expect(
    await screen.findByText("Encaminhado em: 2024-03-09")
  ).toBeInTheDocument();
});

test("add observacoes modal open", async () => {
  await mockData();
  const editingItemIdMock = { id: 62 };
  const user = userEvent.setup();
  render(<ObservacoesPesquisa editingItem={editingItemIdMock} />);
  expect(
    await screen.findByText("Encaminhado em: 2024-03-09")
  ).toBeInTheDocument();
  const addButton = await screen.findByRole("button", {
    name: "Adicionar Observacao",
  });
  await user.click(addButton);
  expect(
    await screen.findByText("Adicionar observação referente a pesquisa:")
  ).toBeInTheDocument();
});

test("message if there are no observacoes in the modal", async () => {
  axios.get.mockResolvedValueOnce({ data: [] });
  const editingItemIdMock = { id: 62 };
  render(<ObservacoesPesquisa editingItem={editingItemIdMock} />);
  expect(
    await screen.findByText("Não existem observacoes")
  ).toBeInTheDocument();
});

test("select option has the correct value", async () => {
  await mockData();
  const editingItemIdMock = { id: 62 };
  const user = userEvent.setup();
  render(<ObservacoesPesquisa editingItem={editingItemIdMock} />);
  expect(
    await screen.findByText("Encaminhado em: 2024-03-09")
  ).toBeInTheDocument();
  const addButton = await screen.findByRole("button", {
    name: "Adicionar Observacao",
  });
  await user.click(addButton);
  expect(
    await screen.findByText("Adicionar observação referente a pesquisa:")
  ).toBeInTheDocument();
  await selectValue("Entrou em contato");
  await selectValue("Tirou copias");
  await selectValue("Encaminhado");
  await selectValue("Teve vistas do processo");
  await selectValue("Municipe informado");
  await selectValue("Municipe Ligou");
});

test("add a observacao correctly", async () => {
  await mockData();
  const editingItemIdMock = { id: 62 };
  axios.post.mockResolvedValueOnce({
    data: "Observação cadastrada com sucesso",
  });
  const user = userEvent.setup();
  render(<ObservacoesPesquisa editingItem={editingItemIdMock} />);
  expect(
    await screen.findByText("Encaminhado em: 2024-03-09")
  ).toBeInTheDocument();
  const addButton = await screen.findByRole("button", {
    name: "Adicionar Observacao",
  });
  await user.click(addButton);
  expect(
    await screen.findByText("Adicionar observação referente a pesquisa:")
  ).toBeInTheDocument();
  const selectBox = await screen.findByRole("combobox");
  await user.selectOptions(selectBox, "Teve vistas do processo");
  expect(selectBox.value).toBe("Teve vistas do processo");
  const dateInput = await screen.findByTestId("input-date");
  expect(dateInput).toBeInTheDocument();
  await user.type(dateInput, "2024-03-09");
  expect(dateInput.value).toBe("2024-03-09");
  const confirmButton = await screen.findByRole("button", { name: "Adicionar" });
  await user.click(confirmButton);
  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:3030/pesquisas/observacoes", 
      {
        requerimentoId: 62,
        observacao: "Teve vistas do processo",
        date: "2024-03-09",
      }
    );
  });
});

test('observacao successfully deleted', async () => {
  await mockData();
  const editingItemIdMock = { id: 62 };
  axios.delete.mockResolvedValueOnce({ data: "Observacao excluida com sucesso" })
  const user = userEvent.setup();
  render(<ObservacoesPesquisa editingItem={editingItemIdMock} />);
  expect(await screen.findByText("Encaminhado em: 2024-03-09")).toBeInTheDocument();
  const iconDelete = await screen.findByTestId("icon-delete-obs");
  expect(iconDelete).toBeInTheDocument();
  await user.click(iconDelete);
  await waitFor(() => {
    expect(axios.delete).toHaveBeenCalledTimes(1);
  });
});
