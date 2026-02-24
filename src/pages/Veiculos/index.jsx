import { useState, useEffect } from "react";
import { supabase } from "../../services/supabase";
import { useNavigate } from "react-router-dom";
import "./style.css";

const CadastrarVeiculo = () => {
  const navigate = useNavigate();

  // Estados existentes
  const [user, setUser] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [ano, setAno] = useState("");
  const [preco, setPreco] = useState("");
  const [descricao, setDescricao] = useState("");

  // NOVOS Estados
  const [contato, setContato] = useState("");
  const [imagens, setImagens] = useState([]);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
      } else {
        setUser(user);
      }
    };
    getUser();
  }, [navigate]);

 const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Você precisa estar logado para cadastrar um veículo.");
      return;
    }

    setCarregando(true);

    try {
      let urlsImagens = [];

      // 1. Lógica de Upload REAL das Imagens para o Storage
      if (imagens.length > 0) {
        for (const file of imagens) {
          // Criamos um nome único para o arquivo usando o timestamp
          const nomeArquivo = `${Date.now()}_${file.name}`;
          const caminhoArquivo = `${user.id}/${nomeArquivo}`;

          const { data, error: uploadError } = await supabase.storage
            .from('veiculos_fotos') // Certifique-se que o nome do Bucket é este
            .upload(caminhoArquivo, file);

          if (uploadError) throw uploadError;

          // Pegamos a URL pública para salvar no banco de dados
          const { data: { publicUrl } } = supabase.storage
            .from('veiculos_fotos')
            .getPublicUrl(caminhoArquivo);

          urlsImagens.push(publicUrl);
        }
      }

      // 2. Inserção no Banco de Dados (Agora com Contato e Fotos)
      const { error } = await supabase.from("veiculos").insert([
        {
          usuario_id: user.id,
          titulo,
          marca,
          modelo,
          ano: parseInt(ano),
          preco: parseFloat(preco),
          descricao,
          contato, // Salva o WhatsApp/Telefone
          fotos: urlsImagens // Salva a lista de links das fotos
        }
      ]);

      if (error) throw error;

      alert("Veículo publicado com sucesso!");
      navigate("/");
    } catch (error) {
      alert("Erro ao cadastrar: " + error.message);
      console.error("Detalhes do erro:", error);
    } finally {
      setCarregando(false);
    }
  };
  
  return (
    <div className="container-cadastro">
      <h2>Publicar Novo Anúncio</h2>

      <form className="form-veiculo" onSubmit={handleSubmit}>
        <div className="group">
          <label>Informações Básicas</label>
          <input type="text" placeholder="Título do Anúncio (Ex: Honda Civic Conservado)" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
          
          <div className="row">
            <input type="text" placeholder="Marca" value={marca} onChange={(e) => setMarca(e.target.value)} required />
            <input type="text" placeholder="Modelo" value={modelo} onChange={(e) => setModelo(e.target.value)} required />
          </div>

          <div className="row">
            <input type="number" placeholder="Ano" value={ano} onChange={(e) => setAno(e.target.value)} required />
            <input type="number" placeholder="Preço (R$)" value={preco} onChange={(e) => setPreco(e.target.value)} required />
          </div>
        </div>

        <div className="group">
          <label>Detalhes e Contato</label>
          <textarea placeholder="Descreva detalhes como quilometragem, cor e opcionais..." value={descricao} onChange={(e) => setDescricao(e.target.value)} />
          
          <input 
            type="tel" 
            placeholder="WhatsApp para Contato (DDD + Número)" 
            value={contato} 
            onChange={(e) => setContato(e.target.value)} 
            required 
          />
        </div>

        <div className="group">
          <label>Fotos do Veículo</label>
          <div className="file-input-wrapper">
            <input 
              type="file" 
              accept="image/*" 
              multiple 
              onChange={(e) => setImagens([...e.target.files])} 
            />
            <p>{imagens.length} arquivos selecionados</p>
          </div>
        </div>

        <button type="submit" className="btn-cadastrar" disabled={carregando}>
          {carregando ? "Publicando..." : "Finalizar Anúncio"}
        </button>
      </form>
    </div>
  );
};

export default CadastrarVeiculo;