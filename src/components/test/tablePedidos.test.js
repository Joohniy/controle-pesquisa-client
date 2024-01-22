import { screen, render, waitFor, act, findByText } from "../../test-utils/index";
import TablePedidos from "../TablePedidos";
import axios from "axios";

jest.mock("axios")

beforeEach(() => {
  jest.clearAllMocks();
});

test("component render correctly", async () => {
  const dataMock = [
    {
      id: 164,
      tipo_requer: 'Oficio',
      sec: 'STR',
      numero: '20230312345',
      numprocesso: '1445/2023',
      name: 'Any',
      date: '2023-12-05'
    },
  ];
  const dataAnexoMock = [ { processo_anexo: '1', id_anexo: 173 } ]
  const fetchAnexosMock = jest.fn().mockResolvedValue({ data: { anexos: [dataAnexoMock] } })
  axios.get
  .mockResolvedValueOnce({ data: { dataValues: [dataMock] } })
  .mockImplementationOnce(fetchAnexosMock)
    render(<TablePedidos type={"Todos"} />);
      expect(await screen.findByText(/Oficio STR/)).toBeInTheDocument();
});

