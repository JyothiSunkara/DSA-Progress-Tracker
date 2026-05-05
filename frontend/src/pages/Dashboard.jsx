import { useEffect, useState } from "react";
import {
  getOverallStats,
  getWeakTopics,
  getStrongTopics,
  getRecommendations,
} from "../services/api";
import StatCard from "../components/StatCard";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [weakTopics, setWeakTopics] = useState([]);
  const [strongTopics, setStrongTopics] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const statsRes = await getOverallStats();
      const weakRes = await getWeakTopics();
      const strongRes = await getStrongTopics();
      const recRes = await getRecommendations();

      setStats(statsRes.data);
      setWeakTopics(weakRes.data);
      setStrongTopics(strongRes.data);
      setRecommendations(recRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  // RETURN MUST BE INSIDE FUNCTION
  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-semibold mb-3 border-b border-gray-800 pb-2">
        Dashboard
      </h1>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-6 gap-4 mb-6">
          <StatCard title="Total Attempts" value={stats.total_attempts} />
          <StatCard title="Solved" value={stats.total_solved} />
          <StatCard title="Accuracy" value={`${stats.accuracy}%`} />
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Strong Topics</h2>
        {strongTopics.map((topic, index) => (
          <div key={index} className="bg-gray-800 p-3 rounded mb-2">
            {topic.topic} — {topic.accuracy}%
          </div>
        ))}
      </div>

      {/* Weak Topics */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3 border-b border-gray-700 pb-2">
          Weak Topics
        </h2>
        {weakTopics.length === 0 ? (
          <p>No weak topics 🎉</p>
        ) : (
          weakTopics.map((topic, index) => (
            <div key={index} className="bg-gray-800 p-4 rounded-xl shadow mb-2">
              {topic.topic} — {topic.accuracy}%
            </div>
          ))
        )}
      </div>

      {/* Recommendations */}
      <div>
        <h2 className="text-xl font-semibold mb-3 border-b border-gray-700 pb-2">
          Recommended Problems
        </h2>
        {recommendations.map((rec, index) => (
          <div key={index} className="bg-gray-800 p-4 rounded-xl shadow mb-2">
            {rec.title} ({rec.topic}) - {rec.difficulty}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
