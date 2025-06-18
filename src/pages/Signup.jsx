import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import useSessionStore from '../state/useSessionStore';

const Signup = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSessionStore();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return <AuthForm mode="signup" />;
};

export default Signup; 