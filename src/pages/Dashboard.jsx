import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { assetAPI, historyAPI } from "../services/api";
import StatusBadge from "../components/StatusBadge";
import { formatDate } from "../utils/helpers";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentAssets, setRecentAssets] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, recentRes, monthlyRes] = await Promise.all([
        assetAPI.getAssetStats(),
        assetAPI.getRecentAssets(),
        historyAPI.getMonthlyActivityData(),
      ]);

      setStats(statsRes.data);
      setRecentAssets(recentRes.data);
      setMonthlyData(monthlyRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Assets",
      value: stats?.totalAssets || 0,
      icon: "📦",
      color: "from-blue-50 to-blue-100",
      borderColor: "border-blue-600",
    },
    {
      title: "Assigned Assets",
      value: stats?.assignedAssets || 0,
      icon: "👥",
      color: "from-green-50 to-green-100",
      borderColor: "border-green-600",
    },
    {
      title: "Available Assets",
      value: stats?.availableAssets || 0,
      icon: "✅",
      color: "from-emerald-50 to-emerald-100",
      borderColor: "border-emerald-600",
    },
    {
      title: "Under Maintenance",
      value: stats?.maintenanceAssets || 0,
      icon: "🔧",
      color: "from-yellow-50 to-yellow-100",
      borderColor: "border-yellow-600",
    },
    {
      title: "Damaged/Lost",
      value: stats?.damagedAssets || 0,
      icon: "⚠️",
      color: "from-red-50 to-red-100",
      borderColor: "border-red-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${card.color} rounded-lg p-6 border-l-4 ${card.borderColor}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  {card.title}
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {card.value}
                </p>
              </div>
              <span className="text-4xl">{card.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Assets by Category
          </h3>
          {stats?.categoryStats && stats.categoryStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.categoryStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {stats.categoryStats.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500">No data available</p>
          )}
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Assets by Status
          </h3>
          {stats?.statusStats && stats.statusStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={stats.statusStats}
                margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="_id"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500">No data available</p>
          )}
        </div>
      </div>

      {/* Monthly Activity Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Monthly Activity
        </h3>
        {monthlyData && monthlyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="activities"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">No activity data available</p>
        )}
      </div>

      {/* Recent Assets */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Recently Added Assets
        </h3>
        {recentAssets && recentAssets.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Asset ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>Added Date</th>
                </tr>
              </thead>
              <tbody>
                {recentAssets.slice(0, 8).map((asset) => (
                  <tr key={asset._id}>
                    <td className="font-mono text-sm text-blue-600">
                      {asset.assetId}
                    </td>
                    <td className="font-semibold text-gray-800">
                      {asset.name}
                    </td>
                    <td className="text-gray-600">{asset.category}</td>
                    <td>
                      <StatusBadge status={asset.status} />
                    </td>
                    <td className="text-gray-600">{asset.location}</td>
                    <td className="text-gray-600 text-sm">
                      {formatDate(asset.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No recent assets</p>
        )}
      </div>
    </div>
  );
}
