import { useEffect, useState } from "react";
import API from "../services/api";
import { FiExternalLink } from "react-icons/fi";

function Problems() {
  const [showModal, setShowModal] = useState(false);
  const [topics, setTopics] = useState([]);
  const [problems, setProblems] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    difficulty: "Easy",
    topic_id: "",
    link: "",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  useEffect(() => {
    fetchTopics();
    fetchProblems();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await API.get("/topics/");
      setTopics(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProblems = async () => {
    try {
      const response = await API.get("/problems/");
      setProblems(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/problems/", formData);
      fetchProblems();
      setMessage("Problem added successfully!");
      setIsError(false);
      setTimeout(() => {
        setShowModal(false);

        setFormData({
          title: "",
          difficulty: "Easy",
          topic_id: "",
          link: "",
        });

        setMessage("");
      }, 2000);
    } catch (error) {
      console.error(error);
      console.log(error.response?.data || error.message);
      setMessage("Failed to add problem");
      setIsError(true);
    }
  };

  const toggleSolved = async (id) => {
    setProblems((prevProblems) =>
      prevProblems.map((problem) =>
        problem.id === id
          ? { ...problem, is_solved: !problem.is_solved }
          : problem,
      ),
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Problems</h1>

          <p className="text-gray-400 mt-1">
            Track and manage your DSA journey
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl font-semibold transition"
        >
          + Add Problem
        </button>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-2xl w-full max-w-lg p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Add Problem</h2>

                <button
                  onClick={() => {
                    setShowModal(false);
                    setMessage("");
                  }}
                  className="text-gray-400 hover:text-white text-xl"
                >
                  ✕
                </button>
              </div>

              {message && (
                <div
                  className={`mt-4 mb-4 p-3 rounded-lg text-sm text-center ${
                    isError
                      ? "bg-red-500/20 text-red-400"
                      : "bg-green-500/20 text-green-400"
                  }`}
                >
                  {message}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {" "}
                <input
                  type="text"
                  name="title"
                  placeholder="Problem Title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-gray-700 p-3 rounded-xl outline-none"
                />
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="w-full bg-gray-700 p-3 rounded-xl outline-none"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
                <select
                  name="topic_id"
                  value={formData.topic_id}
                  onChange={handleChange}
                  className="w-full bg-gray-700 p-3 rounded-xl outline-none"
                >
                  <option value="">Select Topic</option>

                  {topics.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  name="link"
                  placeholder="Problem Link"
                  value={formData.link}
                  onChange={handleChange}
                  className="w-full bg-gray-700 p-3 rounded-xl outline-none"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-xl font-semibold"
                >
                  Save Problem
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {problems.length === 0 ? (
        <div className="bg-gray-800 rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-semibold mb-3">No Problems Yet</h2>

          <p className="text-gray-400">
            Start adding problems to track your progress.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {problems.map((problem) => (
            <div
              key={problem.id}
              className="bg-gray-800 rounded-2xl p-5 shadow-lg"
            >
              <div className="flex items-center justify-between gap-4">
                {/* Left */}
                <div className="flex items-center gap-3">
                  <div
                    onClick={() => toggleSolved(problem.id)}
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer transition ${
                      problem.is_solved
                        ? "bg-green-500 border-green-500"
                        : "bg-gray-700 border-gray-500"
                    }`}
                  >
                    {problem.is_solved && (
                      <span className="text-white text-xs">✓</span>
                    )}
                  </div>

                  <h2
                    className={`text-lg md:text-xl font-semibold ${
                      problem.is_solved ? "text-gray-200" : "text-white"
                    }`}
                  >
                    {problem.title}
                  </h2>
                </div>

                {/* Right */}
                <div className="flex items-center gap-3">
                  {/* Link Icon */}
                  <a
                    href={problem.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition"
                  >
                    <FiExternalLink size={20} />
                  </a>

                  {/* Difficulty */}
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      problem.difficulty === "Easy"
                        ? "bg-green-500/20 text-green-400"
                        : problem.difficulty === "Medium"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {problem.difficulty}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Problems;
