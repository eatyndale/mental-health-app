import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { progressService } from '../services/progressService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Progress = () => {
  const [moodData, setMoodData] = useState([]);
  const [anxietyData, setAnxietyData] = useState([]);
  const [depressionData, setDepressionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mood, anxiety, depression] = await Promise.all([
          progressService.getMoodHistory(),
          progressService.getAnxietyHistory(),
          progressService.getDepressionHistory(),
        ]);
        setMoodData(mood);
        setAnxietyData(anxiety);
        setDepressionData(depression);
      } catch (err) {
        setError('Failed to load progress data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
      },
    },
  };

  const createChartData = (data, label, color) => ({
    labels: data.map(d => new Date(d.date).toLocaleDateString()),
    datasets: [
      {
        label,
        data: data.map(d => d.score),
        borderColor: color,
        backgroundColor: color + '40',
        tension: 0.4,
      },
    ],
  });

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-8">{error}</div>;

  return (
    <div className="min-h-screen bg-primary-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-primary-800 mb-8">Your Progress</h1>
        
        <div className="grid gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-primary-700 mb-4">Mood Tracking</h2>
            <Line
              options={chartOptions}
              data={createChartData(moodData, 'Mood Score', '#4F46E5')}
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-primary-700 mb-4">Anxiety Levels</h2>
            <Line
              options={chartOptions}
              data={createChartData(anxietyData, 'Anxiety Score', '#EF4444')}
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-primary-700 mb-4">Depression Screening</h2>
            <Line
              options={chartOptions}
              data={createChartData(depressionData, 'Depression Score', '#10B981')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress; 