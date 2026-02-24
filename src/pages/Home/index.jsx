import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [veiculos, setVeiculos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVeiculos = async () => {
    try {
      setLoading(true);
      // Buscamos da tabela oficial 'veiculos'
      const { data, error } = await supabase
        .from('veiculos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVeiculos(data);
    } catch (error) {
      console.error('Erro ao buscar dados:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVeiculos();
  }, []);

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>AutoCAR</h1>
        <nav>
          <Link to="/">Início</Link>
          <Link to="/cadastrar-veiculo">Anunciar carro</Link>
          <Link to="/login" className="btn-outline">Entrar</Link>
        </nav>
      </header>

      <section className="hero">
        <h2>Encontre o carro dos seus <span>sonhos</span></h2>
        <p>Compre direto do proprietário. Sem intermediários.</p>
        <div className="search-box">
          <input type="text" placeholder="Buscar por marca, modelo ou ano" />
          <button>Buscar</button>
        </div>
      </section>

      <section className="car-list">
        <h3>Carros disponíveis</h3>

        <div className="car-grid">
          {loading ? (
            <p>Carregando veículos do banco...</p>
          ) : (
            veiculos.map((v) => (
              <div className="car-card" key={v.id}>
                {/* Lógica de imagem: Prioriza o array 'fotos', senão usa placeholder */}
                <img
                  src={v.fotos && v.fotos.length > 0 ? v.fotos[0] : 'https://via.placeholder.com/400x300?text=Sem+Foto'}
                  alt={v.titulo}
                />
                
                <div className="car-card-content">
                  <h4>{v.titulo}</h4>
                  <p className="price">R$ {Number(v.preco).toLocaleString('pt-BR')}</p>
                  
                  <div className="car-footer">
                    <span>{v.cidade}</span>
                    {v.contato && (
                      <a
                        href={`https://wa.me/55${v.contato.replace(/\D/g, '')}?text=Olá! Vi o anúncio do ${v.titulo} no AutoCAR.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-whats-mini"
                      >
                        WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}

          {!loading && veiculos.length === 0 && (
            <p>Nenhum veículo encontrado no momento.</p>
          )}
        </div>
      </section>

      <footer className="home-footer">
        <p>© 2026 AutoCAR — Venda seu carro com segurança</p>
      </footer>
    </div>
  );
};

export default Home;