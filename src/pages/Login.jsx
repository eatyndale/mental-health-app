import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import useSessionStore from '../state/useSessionStore';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSessionStore();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div>
      {location.state?.message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{location.state.message}</span>
        </div>
      )}
      <AuthForm mode="login" />
    </div>
  );
};

export default Login; 