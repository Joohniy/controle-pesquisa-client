import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Main from "../js/main";

test("render main component", () => {
  render(<Main />);
  const hello = screen.getByText("Hello");
  expect(hello).toBeInTheDocument();
});

test("options in select", async () => {
  const user = userEvent.setup();
  render(<Main />);
  const selectLength = screen.getAllByRole("option").length;
  expect(selectLength).toBe(3);
  const select = screen.getByRole("combobox", { name: "Filtrar por" });
  const selectOptionTodos = screen.getByRole("option", { name: "Todos" });
  const selectOptionOficio = screen.getByRole("option", { name: "Oficio" });
  const selectOptionPesquisa = screen.getByRole("option", { name: "Pesquisa" });

  await user.click(selectOptionTodos);
  await user.selectOptions(select, selectOptionTodos);
  expect(selectOptionTodos.selected).toBeTruthy();
  expect(selectOptionOficio.selected).toBeFalsy();
  expect(selectOptionPesquisa.selected).toBeFalsy();
  const tableTodosOficio = await screen.findByText("Oficio PGM");
  expect(tableTodosOficio).toBeVisible();
  const tableTodosPesquisa = await screen.findByText("Pesquisa 14");
  expect(tableTodosPesquisa).toBeVisible();

  await user.click(selectOptionOficio);
  await user.selectOptions(select, selectOptionOficio);
  expect(selectOptionTodos.selected).toBeFalsy();
  expect(selectOptionOficio.selected).toBeTruthy();
  expect(selectOptionPesquisa.selected).toBeFalsy();
  const tableOnlyOficio = await screen.findByText("Oficio PGM");
  expect(tableOnlyOficio).toBeVisible();

  await user.click(selectOptionPesquisa);
  await user.selectOptions(select, selectOptionPesquisa);
  expect(selectOptionTodos.selected).toBeFalsy();
  expect(selectOptionOficio.selected).toBeFalsy();
  expect(selectOptionPesquisa.selected).toBeTruthy();
  const tableOnlyPesquisa = await screen.findByText("Pesquisa 14");
  expect(tableOnlyPesquisa).toBeVisible();
});