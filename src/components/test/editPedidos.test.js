import { screen, render, waitFor, findByText } from "../../test-utils/index";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { toast } from "react-toastify";
import CellEdit from "../CellEdit";

jest.mock("axios");
jest.mock("react-toastify");

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
});

const dataMockOficio = {
  tipo_requer: "Oficio",
  id: 203,
  date: "2024-02-23",
  name: "Any",
  numero: "87982546",
  numprocesso: "2444/2023",
  sec: "SA",
};

const dataMockPesquisa = {
  tipo_requer: "Pesquisa",
  id: 147,
  date: "2024-02-17",
  name: "Any",
  numero: "2023222454",
  numprocesso: "8712/2024",
  sec: null,
};

async function mockAnexos() {
  const dataAnexosMock = [
    {
      id_processo_principal_oficio: 203,
      id_processos_anexosoficio: 136,
      processo_anexo: "1",
    },
  ];
  return axios.get.mockResolvedValueOnce({ data: { anexos: [dataAnexosMock] } });
};

test("render component correctly type Pesquisa", async () => {
  await mockAnexos();
  render(<CellEdit editingItem={dataMockPesquisa} />);
  expect(await screen.findByText("Edição de informações")).toBeInTheDocument();
  expect(
    await screen.findByLabelText("Número de Pesquisa")
  ).toBeInTheDocument();
});

test("render component correctly type Oficio", async () => {
  await mockAnexos();
  render(<CellEdit editingItem={dataMockOficio} />);
  expect(await screen.findByText("Edição de informações")).toBeInTheDocument();
  expect(await screen.findByLabelText("Número de Oficio")).toBeInTheDocument();
});

test("inputs have the correct values to edit Pesquisa", async () => {
  await mockAnexos();
  render(<CellEdit editingItem={dataMockPesquisa} />);
  expect(await screen.findByText("Edição de informações")).toBeInTheDocument();
  const inputDate = await screen.findByLabelText("Data");
  const inputNumPesquisa = await screen.findByLabelText("Número de Pesquisa");
  const inputNumProcesso = await screen.findByLabelText("Número do Processo");
  const inputNome = await screen.findByLabelText("Nome");
  expect(inputDate.value).toBe("2024-02-17");
  expect(inputNumPesquisa.value).toBe("2023222454");
  expect(inputNumProcesso.value).toBe("8712/2024");
  expect(inputNome.value).toBe("Any");
});

test("inputs have the correct values to edit Oficio", async () => {
  await mockAnexos();
  render(<CellEdit editingItem={dataMockOficio} />);
  expect(await screen.findByText("Edição de informações")).toBeInTheDocument();
  const inputDate = await screen.findByLabelText("Data");
  const inputSecretaria = await screen.findByLabelText("Secretaria");
  const inputNumOficio = await screen.findByLabelText("Número de Oficio");
  const inputNumProcesso = await screen.findByLabelText("Número do Processo");
  const inputNome = await screen.findByLabelText("Nome");
  expect(inputDate.value).toBe("2024-02-23");
  expect(inputSecretaria.value).toBe("SA");
  expect(inputNumOficio.value).toBe("87982546");
  expect(inputNumProcesso.value).toBe("2444/2023");
  expect(inputNome.value).toBe("Any");
});

test("all values are edited Pesquisa", async () => {
  await mockAnexos();
  axios.post.mockResolvedValueOnce({ data: "Editado com sucesso" });
  function closeModalEditMock(boolean) { return boolean }
  const user = userEvent.setup();
  render(<CellEdit editingItem={dataMockPesquisa} closeModalEdit={() => closeModalEditMock(true)} />);
  expect(await screen.findByText("Edição de informações")).toBeInTheDocument();
  const inputDate = await screen.findByLabelText("Data");
  const inputNumPesquisa = await screen.findByLabelText("Número de Pesquisa");
  const inputNumProcesso = await screen.findByLabelText("Número do Processo");
  const inputNome = await screen.findByLabelText("Nome");
  expect(inputDate.value).toBe("2024-02-17");
  expect(inputNumPesquisa.value).toBe("2023222454");
  expect(inputNumProcesso.value).toBe("8712/2024");
  expect(inputNome.value).toBe("Any");
  await user.clear(inputDate);
  await user.type(inputDate, "2024-03-18");
  expect(inputDate.value).toBe("2024-03-18");
  await user.clear(inputNumPesquisa);
  await user.type(inputNumPesquisa, "20");
  expect(inputNumPesquisa.value).toBe("20");
  await user.clear(inputNumProcesso);
  await user.type(inputNumProcesso, "78999/2023");
  expect(inputNumProcesso.value).toBe("78999/2023");
  await user.clear(inputNome);
  await user.type(inputNome, "John");
  expect(inputNome.value).toBe("John");
  const confirmEditButton = await screen.findByRole("button", { name: "Confirmar" });
  await user.click(confirmEditButton);
  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith("http://localhost:3030/main/edit", {
      id: 147,
      tipo_requer: "Pesquisa",
      newDate: "2024-03-18",
      newSecretaria: undefined,
      newNumOficio: undefined,
      newNumProcesso: "78999/2023",
      newName: "John",
      newNumPesquisa: "20",
      existingValues: {
        tipo_requer: "Pesquisa",
        id: 147,
        date: "2024-02-17",
        name: "Any",
        numero: "2023222454",
        numprocesso: "8712/2024",
        sec: null,
      },
    });
  });
  await waitFor(() => {
    expect(toast.success).toHaveBeenCalledWith("Editado com sucesso");
  });
});

test("all values are edited Oficio", async () => {
  await mockAnexos();
  axios.post.mockResolvedValueOnce({ data: "Editado com sucesso" });
  function closeModalEditMock(boolean) { return boolean }
  const user = userEvent.setup();
  render(<CellEdit editingItem={dataMockOficio} closeModalEdit={() => closeModalEditMock(true)} />);
  const inputDate = await screen.findByLabelText("Data");
  const inputSecretaria = await screen.findByLabelText("Secretaria");
  const inputNumOficio = await screen.findByLabelText("Número de Oficio");
  const inputNumProcesso = await screen.findByLabelText("Número do Processo");
  const inputNome = await screen.findByLabelText("Nome");
  expect(inputDate.value).toBe("2024-02-23");
  expect(inputSecretaria.value).toBe("SA");
  expect(inputNumOficio.value).toBe("87982546");
  expect(inputNumProcesso.value).toBe("2444/2023");
  expect(inputNome.value).toBe("Any");
  await user.clear(inputDate);
  await user.type(inputDate, "2024-03-25");
  expect(inputDate.value).toBe("2024-03-25");
  await user.clear(inputSecretaria);
  await user.type(inputSecretaria, "SEHAB");
  expect(inputSecretaria.value).toBe("SEHAB");
  await user.clear(inputNumOficio);
  await user.type(inputNumOficio, "203333");
  expect(inputNumOficio.value).toBe("203333");
  await user.clear(inputNumProcesso);
  await user.type(inputNumProcesso, "7899/2011");
  expect(inputNumProcesso.value).toBe("7899/2011")
  await user.clear(inputNome);
  await user.type(inputNome, "John Doe");
  expect(inputNome.value).toBe("John Doe");
  const confirmEditButton = await screen.findByRole("button", { name: "Confirmar" });
  await user.click(confirmEditButton);
  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith("http://localhost:3030/main/edit", {
      id: 203,
      tipo_requer: "Oficio",
      newDate: "2024-03-25",
      newSecretaria: "SEHAB",
      newNumOficio: "203333",
      newNumProcesso: "7899/2011",
      newName: "John Doe",
      newNumPesquisa: undefined,
      existingValues: {
        tipo_requer: "Oficio",
        id: 203,
        date: "2024-02-23",
        name: "Any",
        numero: "87982546",
        numprocesso: "2444/2023",
        sec: "SA",      
      },
    });
  });
  await waitFor(() => {
    expect(toast.success).toHaveBeenCalledWith("Editado com sucesso");
  });
});