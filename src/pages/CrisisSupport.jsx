import { useState, useEffect } from 'react';
import { crisisService } from '../services/crisisService';

const CrisisSupport = () => {
  const [hotlines, setHotlines] = useState([]);
  const [resources, setResources] = useState([]);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hotlinesData, resourcesData, contactsData] = await Promise.all([
          crisisService.getHotlines(),
          crisisService.getResources(),
          crisisService.getEmergencyContacts(),
        ]);
        setHotlines(hotlinesData);
        setResources(resourcesData);
        setEmergencyContacts(contactsData);
      } catch (err) {
        setError('Failed to load crisis resources');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-8">{error}</div>;

  return (
    <div className="min-h-screen bg-primary-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-8">
          <h1 className="text-2xl font-bold text-red-700">Emergency Support</h1>
          <p className="text-red-600">
            If you're experiencing a life-threatening emergency, please call 911 or your local emergency services immediately.
          </p>
        </div>

        <div className="grid gap-8">
          {/* Crisis Hotlines */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-primary-700 mb-4">24/7 Crisis Hotlines</h2>
            <div className="space-y-4">
              {hotlines.map((hotline) => (
                <div key={hotline.id} className="border-b pb-4 last:border-b-0">
                  <h3 className="font-medium text-gray-800">{hotline.name}</h3>
                  <p className="text-gray-600 mb-2">{hotline.description}</p>
                  <a
                    href={`tel:${hotline.phone}`}
                    className="inline-block bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition-colors"
                  >
                    {hotline.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-primary-700 mb-4">Emergency Contacts</h2>
            <div className="space-y-4">
              {emergencyContacts.map((contact) => (
                <div key={contact.id} className="border-b pb-4 last:border-b-0">
                  <h3 className="font-medium text-gray-800">{contact.name}</h3>
                  <p className="text-gray-600">{contact.phone}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Resources */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-primary-700 mb-4">Additional Resources</h2>
            <div className="space-y-4">
              {resources.map((resource) => (
                <div key={resource.id} className="border-b pb-4 last:border-b-0">
                  <h3 className="font-medium text-gray-800">{resource.title}</h3>
                  <p className="text-gray-600 mb-2">{resource.description}</p>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700"
                  >
                    Learn More →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrisisSupport; 