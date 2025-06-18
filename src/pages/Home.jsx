import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary-50 p-6">
      <h1 className="text-4xl font-bold text-primary-800 mb-4">Welcome to the EFT Anxiety Support Chatbot</h1>
      <p className="mb-8 text-lg text-primary-700 text-center max-w-xl">
        Manage your anxiety and stress with AI-powered support, personalized assessments, guided EFT tapping, and crisis resources.
      </p>
      <div className="flex flex-col gap-4 w-full max-w-md">
        <Link to="/assessment" className="btn-primary text-center">Take Assessment</Link>
        <Link to="/tapping" className="btn-secondary text-center">Start Tapping Session</Link>
        <Link to="/progress" className="btn-primary text-center">View Progress</Link>
        <Link to="/crisis" className="btn-secondary text-center">Crisis Support</Link>
      </div>
    </div>
  );
};

export default Home; 