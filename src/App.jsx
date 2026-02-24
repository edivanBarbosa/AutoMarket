import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
// O NOVO IMPORT VAI AQUI:
import CadastrarVeiculo from "./pages/Veiculos";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        {/* E A ROTA VAI AQUI: */}
        <Route path="/cadastrar-veiculo" element={<CadastrarVeiculo />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
