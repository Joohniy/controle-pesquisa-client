import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/js/registerForm";
import Main from "./pages/js/main";
import Observacoes from "./pages/js/observacoes";
import Pesquisas from "./pages/js/pesquisas";
import FormPesquisas from "./components/FormPesquisas";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div>
        <Router>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/main" element={<Main />} />
            <Route path="/observacoes" element={<Observacoes />} />
            <Route path="/pesquisas/register" element={<FormPesquisas />} />
            <Route path="/pesquisas" element={<Pesquisas />} />
          </Routes>
        </Router>
        <ToastContainer />
    </div>
  );
}

export default App;
