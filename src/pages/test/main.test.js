import { screen, render } from "../../test-utils/index";
import Main from "../js/main";
import userEvent from "@testing-library/user-event";

test('component renders correctly', () => {
   render(<Main />);
   const title = screen.getByRole('heading', { name: /solicitados/i });
   expect(title).toBeInTheDocument();
});

/*test('renders the component to edit the cell, and whether the cell is correctly edited', async () => {
   render(<Main />);
   const editIcon = screen.getByTestId("icon-edit-main");
   expect(editIcon).toBeInTheDocument()
});
*/

//todo: Passar o componente Table, dentro do main, para um componente para assim testa-lo devidamente.