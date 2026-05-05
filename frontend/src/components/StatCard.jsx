function StatCard({ title, value }) {
  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-5 rounded-2xl shadow-lg hover:scale-105 transition-transform">
      <h2 className="text-sm text-gray-200">{title}</h2>
      <p className="text-3xl font-bold text-white mt-2">{value}</p>
    </div>
  );
}

export default StatCard;
