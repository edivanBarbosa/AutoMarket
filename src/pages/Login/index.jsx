import { supabase } from '../../services/supabase';
import './Login.css';

const Login = () => {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin // Volta para a home após o login
      }
    });

    if (error) {
      console.error('Erro ao fazer login:', error.message);
      alert('Erro ao conectar com o Google');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Bem-vindo ao <span>AutoCAR</span></h1>
        <p>Para anunciar seu veículo ou entrar em contato, conecte-se com sua conta.</p>
        
        <button className="google-btn" onClick={handleGoogleLogin}>
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google" 
          />
          Entrar com Google
        </button>

        <a href="/" className="back-link">Voltar para o início</a>
      </div>
    </div>
  );
};

export default Login;