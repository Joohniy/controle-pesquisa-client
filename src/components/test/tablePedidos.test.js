import { screen, render, waitFor,  } from "../../test-utils/index";
import TablePedidos from "../TablePedidos";
import axios from "axios";
import userEvent from "@testing-library/user-event";
import { toast } from "react-toastify";

jest.mock("axios");
jest.mock("react-toastify");

beforeEach(() => {
  jest.clearAllMocks();
});

test("component render correctly when type is Oficio", async () => {
  const dataMock = [
    {
      id: 164,
      tipo_requer: "Oficio",
      sec: "STR",
      numero: "20230312345",
      numprocesso: "1445/2023",
      name: "Any",
      date: "2023-12-05",
    },
  ];
  const dataAnexoMock = [{ processo_anexo: "1", id_anexo: 164 }];
  axios.get
    .mockResolvedValueOnce({ data: { dataValues: [dataMock] } })
    .mockResolvedValueOnce({ data: { anexos: [dataAnexoMock] } });
  render(<TablePedidos type={"Oficio"} />);
  expect(await screen.findByText("Oficio STR")).toBeInTheDocument();
});

test("component render correctly when type is Pesquisa", async () => {
  const dataMock = [
    {
      id: 144,
      tipo_requer: "Pesquisa",
      name: "Any",
      numero: "12",
      numprocesso: "4555/2023",
      sec: null,
      date: "2023-12-05",
    },
  ];
  const dataAnexoMock = [{ processo_anexo: "7888/2023", id_anexo: 144 }];
  axios.get
    .mockResolvedValueOnce({ data: { dataValues: [dataMock] } })
    .mockResolvedValueOnce({ data: { anexos: [dataAnexoMock] } });
  render(<TablePedidos type={"Pesquisa"} />);
  expect(await screen.findByText("Pesquisa 12")).toBeInTheDocument();
});

test("component render correctly when type is Todos", async () => {
  const dataMock = [
    {
      id: 164,
      tipo_requer: "Oficio",
      sec: "STR",
      numero: "20230312345",
      numprocesso: "1445/2023",
      name: "Any",
      date: "2023-12-05",
    },
    {
      id: 144,
      tipo_requer: "Pesquisa",
      name: "Any",
      numero: "12",
      numprocesso: "4555/2023",
      sec: null,
      date: "2023-12-05",
    },
  ];
  const dataAnexoOficioMock = [{ processo_anexo: "1", id_anexo: 164 }];
  const dataAnexoPesquisaMock = [
    { processo_anexo: "7888/2023", id_anexo: 144 },
  ];
  axios.get
    .mockResolvedValueOnce({ data: { dataValues: [dataMock] } })
    .mockResolvedValueOnce({ data: { anexos: [dataAnexoOficioMock] } })
    .mockResolvedValueOnce({ data: { anexos: [dataAnexoPesquisaMock] } });
  render(<TablePedidos type={"Todos"} />);
  expect(await screen.findByText("Oficio STR")).toBeInTheDocument();
  expect(await screen.findByText("Pesquisa 12")).toBeInTheDocument();
});

test("table cell oficio is successfully removed from the table", async () => {
  const dataMock = [
    {
      id: 20,
      tipo_requer: "Oficio",
      sec: "DUS",
      numero: "20230312345",
      numprocesso: "1445/2023",
      name: "Any",
      date: "2023-12-05",
    },
  ];
  const dataAnexoMock = [{ processo_anexo: "1", id_anexo: 20 }];
  axios.get
    .mockResolvedValueOnce({ data: { dataValues: [dataMock] } })
    .mockResolvedValueOnce({ data: { anexos: [dataAnexoMock] } });
  axios.delete.mockResolvedValueOnce({
    data: "Pedido de Oficio deletado com sucesso",
  });
  const user = userEvent.setup();
  render(<TablePedidos type={"Todos"} />);
  expect(await screen.findByText("Oficio DUS")).toBeInTheDocument();
  const deleteIcon = await screen.findByTestId("icon-deletecell-main");
  expect(deleteIcon).toBeInTheDocument();
  await user.click(deleteIcon);
  await waitFor(() => {
    expect(axios.delete).toHaveBeenCalledWith(
      "http://localhost:3030/main/delete/20/Oficio"
    );
  });
  await waitFor(() => {
    expect(toast.success).toHaveBeenCalledWith(
      "Pedido de Oficio deletado com sucesso"
    );
  });
});

test("table cell pesquisa is successfully removed from the table", async () => {
  const dataMock = [
    {
      id: 144,
      tipo_requer: "Pesquisa",
      name: "Any",
      numero: "12",
      numprocesso: "4555/2023",
      sec: null,
      date: "2023-12-05",
    },
  ];
  const dataAnexoMock = [{ processo_anexo: "7888/2023", id_anexo: 144 }];
  axios.get
    .mockResolvedValueOnce({ data: { dataValues: [dataMock] } })
    .mockResolvedValueOnce({ data: { anexos: [dataAnexoMock] } });
  axios.delete.mockResolvedValueOnce({
    data: "Pedido de Pesquisa deletado com sucesso",
  });
  const user = userEvent.setup();
  render(<TablePedidos type={"Pesquisa"} />);
  expect(await screen.findByText("Pesquisa 12")).toBeInTheDocument();
  const deleteIcon = await screen.findByTestId("icon-deletecell-main");
  await user.click(deleteIcon);
  await waitFor(() => {
    expect(axios.delete).toHaveBeenCalledWith(
      "http://localhost:3030/main/delete/144/Pesquisa"
    );
  });
  await waitFor(() => {
    expect(toast.success).toHaveBeenCalledWith(
      "Pedido de Pesquisa deletado com sucesso"
    );
  });
});

test("pesquisa cell are edited correctly", async () => {
  const dataMock = [
    {
      id: 144,
      tipo_requer: "Pesquisa",
      name: "Any",
      numero: "12",
      numprocesso: "4555/2023",
      sec: null,
      date: "2023-12-05",
    },
  ];
  /*const dataMockEdited = [
    {
      id: 144,
      tipo_requer: "Pesquisa",
      name: "Any",
      numero: "20",
      numprocesso: "4555/2023",
      sec: null,
      date: "2023-12-05",
    },
  ];
  */
  const dataAnexoMock = [{ processo_anexo: "7888/2023", id_anexo: 144 }];
  axios.get
  .mockResolvedValueOnce({ data: { dataValues: [dataMock] } })
  .mockResolvedValue({ data: { anexos: [dataAnexoMock] } })
  axios.post
  .mockResolvedValueOnce({ data: "Editado com sucesso" });
  const user = userEvent.setup();
  render(<TablePedidos type={"Pesquisa"} />);
  expect(await screen.findByText("Pesquisa 12")).toBeInTheDocument();
  const editIcon = await screen.findByTestId("icon-edit-main");
  await user.click(editIcon);
  expect(await screen.findByText("Edição de infomações")).toBeInTheDocument();
  const editNumPesquisaField = await screen.findByLabelText(
    "Número de Pesquisa"
  );
  await user.clear(editNumPesquisaField);
  await user.type(editNumPesquisaField, "20");
  const confirmEditButton = await screen.findByRole("button", {
    name: "Confirmar",
  });
  await user.click(confirmEditButton);
  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledTimes(1);
  });
  //expect(await screen.findByText("Pesquisa 20")).toBeInTheDocument();
});

test.only('oficio cell are edited correctly', async () => {
  const dataMockOficio = [
    {
      id: 20,
      tipo_requer: "Oficio",
      sec: "DUS",
      numero: "20230312345",
      numprocesso: "1445/2023",
      name: "Any",
      date: "2023-12-05",
    },
  ];
  const dataAnexoMock = [{ processo_anexo: "1788/2023", id_anexo: 20 }];
  axios.get
  .mockResolvedValueOnce({ data: { dataValues: [dataMockOficio] } })
  .mockResolvedValue({ data: { anexos: [dataAnexoMock] } })
  axios.post.mockResolvedValueOnce({ data: "Editado com sucesso" })
  const dataMockOficioEdited = [
    {
      id: 20,
      tipo_requer: "Oficio",
      sec: "PGM",
      numero: "20230312345",
      numprocesso: "1445/2023",
      name: "Any",
      date: "2023-12-05",
    },
  ];
  const dataAnexoMockEdited = [{ processo_anexo: "1788/2023", id_anexo: 20 }];
  axios.get
  .mockResolvedValue({ data: { dataValues: [dataMockOficioEdited] } })
  .mockResolvedValue({ data: { anexos: [dataAnexoMockEdited] } }) 

  const user = userEvent.setup();
   render(<TablePedidos type={"Oficio"}/>);
   expect(await screen.findByText("Oficio DUS")).toBeInTheDocument();
   const editIcon = await screen.findByTestId("icon-edit-main");
   await user.click(editIcon);
   expect(await screen.findByText("Edição de infomações")).toBeInTheDocument();
   const inputSecretaria = await screen.findByLabelText("Secretaria");
   await user.clear(inputSecretaria);
   await user.type(inputSecretaria, "PGM");
   const confirmEditButton = await screen.findByRole("button", { name: "Confirmar" });
   await user.click(confirmEditButton); 
   await waitFor(() => {
    expect(axios.post).toHaveBeenCalledTimes(1); 
   });
   //expect(await screen.findByText("Oficio PGM")).toBeInTheDocument()
});
