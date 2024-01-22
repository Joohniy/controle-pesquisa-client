import { screen, render, waitFor } from "../../test-utils/index";
import TablePesquisas from "../TablePesquisas";
import axios from "axios";

beforeEach(() => {
  jest.clearAllMocks();
});


test("render correctly", async () => {
  render(<TablePesquisas />);
  await waitFor(() => {
    const endereco = screen.queryAllByText("Requerente");
    expect(endereco.length).toBe(2)
  });
});
