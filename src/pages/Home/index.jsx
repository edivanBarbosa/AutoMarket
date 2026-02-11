import { useEffect, useState } from 'react';
// Se o supabase.js está na pasta 'src' e este arquivo em 'src/pages/Home'
// use '../../supabase' (dois níveis para cima)
import { supabase } from '../../services/supabase';
import './Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCars = async () => {
    try {
      setLoading(true);
      // Aqui buscamos os dados REAIS do seu banco
      const { data, error } = await supabase
        .from('cars')
        .select('*');

      if (error) throw error;

      setCars(data);
      console.log('Dados carregados com sucesso:', data);
    } catch (error) {
      console.error('Erro ao buscar dados:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>AutoCAR</h1>
        <nav>
          <a href="#">Início</a>
          <a href="#">Anunciar carro</a>
          <Link to="/login" className="btn-outline">Entrar</Link>
          <button className="btn-primary">Cadastrar</button>
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
            cars.map((car) => (
              <div className="car-card" key={car.id}>
                {/* Agora usamos o link que está na sua coluna image_url */}
                <img src={car.image_url} alt={car.title} />
                <h4>{car.title}</h4>
                <p>R$ {Number(car.price).toLocaleString('pt-BR')}</p>
                <span>{car.city}</span>
              </div>
            ))
          )}

          {!loading && cars.length === 0 && (
            <p>Nenhum carro encontrado. Verifique o RLS no Supabase!</p>
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