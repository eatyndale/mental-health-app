import { useState } from 'react';
import { eftService } from '../services/eftService';

const TappingGuide = () => {
  const [step, setStep] = useState(0);
  const [problem, setProblem] = useState('');
  const [initialIntensity, setInitialIntensity] = useState('');
  const [setupStatements, setSetupStatements] = useState([]);
  const [reminderPhrases, setReminderPhrases] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [finalIntensity, setFinalIntensity] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleStart = async (e) => {
    e.preventDefault();
    setError('');
    if (!problem || !initialIntensity) {
      setError('Please describe your problem and rate your initial intensity.');
      return;
    }
    setLoading(true);
    try {
      const response = await eftService.startSession(problem, parseFloat(initialIntensity));
      setSetupStatements(response.setup_statements);
      setReminderPhrases(response.reminder_phrases);
      setSessionId(response.id);
      setStep(1);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to start session.');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (e) => {
    e.preventDefault();
    setError('');
    if (!finalIntensity) {
      setError('Please enter your final intensity.');
      return;
    }
    setLoading(true);
    try {
      const response = await eftService.completeSession(sessionId, parseFloat(finalIntensity));
      setResult(response);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to complete session.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-xl">
      <h2 className="text-2xl font-bold mb-6 text-primary-800">Guided EFT Tapping Session</h2>
      {step === 0 && (
        <form onSubmit={handleStart} className="space-y-6">
          <div>
            <label className="block font-medium text-gray-800 mb-2">Describe your problem or feeling:</label>
            <textarea
              className="input-field"
              rows={3}
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-medium text-gray-800 mb-2">Initial Intensity (0-10):</label>
            <input
              type="number"
              min="0"
              max="10"
              step="0.1"
              className="input-field"
              value={initialIntensity}
              onChange={(e) => setInitialIntensity(e.target.value)}
              required
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Starting...' : 'Start Tapping Session'}
          </button>
        </form>
      )}
      {step === 1 && (
        <div>
          <h3 className="text-xl font-semibold mb-4 text-primary-700">Setup Statements</h3>
          <ul className="mb-4 list-disc pl-6">
            {setupStatements.map((s, i) => (
              <li key={i} className="mb-2">{s}</li>
            ))}
          </ul>
          <h3 className="text-xl font-semibold mb-4 text-primary-700">Reminder Phrases</h3>
          <ul className="mb-4 list-disc pl-6">
            {reminderPhrases.map((p, i) => (
              <li key={i} className="mb-2">{p}</li>
            ))}
          </ul>
          <div className="mb-4 text-gray-700">
            <p>Follow the setup statements and reminder phrases as you tap through the points. When finished, rate your final intensity below.</p>
          </div>
          <form onSubmit={handleComplete} className="space-y-4">
            <div>
              <label className="block font-medium text-gray-800 mb-2">Final Intensity (0-10):</label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                className="input-field"
                value={finalIntensity}
                onChange={(e) => setFinalIntensity(e.target.value)}
                required
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Submitting...' : 'Complete Session'}
            </button>
          </form>
        </div>
      )}
      {step === 2 && result && (
        <div className="text-center">
          <div className="text-2xl font-bold text-primary-700 mb-2">Session Complete!</div>
          <div className="mb-2">Initial Intensity: <span className="font-semibold">{result.initial_intensity}</span></div>
          <div className="mb-2">Final Intensity: <span className="font-semibold">{result.final_intensity}</span></div>
          <div className="mb-4">Problem: <span className="italic">{result.problem_description}</span></div>
          <div className="text-primary-600">Well done! You can start another session or return to the dashboard.</div>
        </div>
      )}
    </div>
  );
};

export default TappingGuide; 