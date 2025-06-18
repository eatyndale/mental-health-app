import { useState } from 'react';
import useSessionStore from '../state/useSessionStore';
import axios from 'axios';

const PHQ9_QUESTIONS = [
  'Little interest or pleasure in doing things',
  'Feeling down, depressed, or hopeless',
  'Trouble falling or staying asleep, or sleeping too much',
  'Feeling tired or having little energy',
  'Poor appetite or overeating',
  'Feeling bad about yourself — or that you are a failure or have let yourself or your family down',
  'Trouble concentrating on things, such as reading the newspaper or watching television',
  'Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual',
  'Thoughts that you would be better off dead or of hurting yourself in some way',
];

const ANSWERS = [
  { value: 0, label: 'Not at all' },
  { value: 1, label: 'Several days' },
  { value: 2, label: 'More than half the days' },
  { value: 3, label: 'Nearly every day' },
];

const AssessmentForm = () => {
  const { token } = useSessionStore();
  const [answers, setAnswers] = useState(Array(9).fill(null));
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (qIdx, value) => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[qIdx] = value;
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    if (answers.some((a) => a === null)) {
      setError('Please answer all questions.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/assessment/submit`,
        {
          answers: answers.map((a, i) => ({ question_id: i + 1, answer: a })),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Submission failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-xl">
      <h2 className="text-2xl font-bold mb-6 text-primary-800">PHQ-9 Anxiety Assessment</h2>
      {result ? (
        <div className="text-center">
          <div className="text-3xl font-bold text-primary-700 mb-2">Score: {result.total_score}</div>
          <div className="text-xl text-primary-600 mb-4">Severity: {result.severity_level}</div>
          <div className="text-gray-600 mb-4">Thank you for completing the assessment.</div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {PHQ9_QUESTIONS.map((q, i) => (
            <div key={i} className="mb-4">
              <label className="block font-medium text-gray-800 mb-2">
                {i + 1}. {q}
              </label>
              <div className="flex gap-4">
                {ANSWERS.map((a) => (
                  <label key={a.value} className="flex items-center gap-1">
                    <input
                      type="radio"
                      name={`q${i}`}
                      value={a.value}
                      checked={answers[i] === a.value}
                      onChange={() => handleChange(i, a.value)}
                      className="form-radio text-primary-600"
                    />
                    <span className="text-sm">{a.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="btn-primary w-full mt-4"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Assessment'}
          </button>
        </form>
      )}
    </div>
  );
};

export default AssessmentForm; 