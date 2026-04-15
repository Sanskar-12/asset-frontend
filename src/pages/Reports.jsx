import React, { useEffect, useState } from "react";
import { assetAPI } from "../services/api";
import StatusBadge from "../components/StatusBadge";
import { exportToCSV, formatDate } from "../utils/helpers";

export default function Reports() {
  const [assets, setAssets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const [assetsRes, statsRes] = await Promise.all([
        assetAPI.getAllAssets({}),
        assetAPI.getAssetStats(),
      ]);
      setAssets(assetsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = (reportType) => {
    let data = [];
    let filename = "assets-report";

    switch (reportType) {
      case "all":
        data = assets.map((a) => ({
          "Asset ID": a.assetId,
          Name: a.name,
          Category: a.category,
          Type: a.type,
          Status: a.status,
          Location: a.location,
          Condition: a.condition,
          "Purchase Cost": a.purchaseCost,
          "Purchase Date": formatDate(a.purchaseDate),
          Barcode: a.barcodeNumber || "N/A",
        }));
        filename = "all-assets-report";
        break;

      case "assigned":
        data = assets
          .filter((a) => ["Assigned", "In Use"].includes(a.status))
          .map((a) => ({
            "Asset ID": a.assetId,
            Name: a.name,
            "Assigned To": a.assignedTo?.name || "N/A",
            Status: a.status,
            Location: a.location,
            "Purchase Date": formatDate(a.purchaseDate),
            Value: a.purchaseCost,
          }));
        filename = "assigned-assets-report";
        break;

      case "damaged":
        data = assets
          .filter((a) => ["Damaged", "Lost", "Maintenance"].includes(a.status))
          .map((a) => ({
            "Asset ID": a.assetId,
            Name: a.name,
            Category: a.category,
            Status: a.status,
            Condition: a.condition,
            Location: a.location,
            Remarks: a.remarks || "N/A",
            "Last Updated": formatDate(a.updatedAt),
          }));
        filename = "damaged-assets-report";
        break;

      case "category":
        data =
          stats?.categoryStats.map((item) => ({
            Category: item._id,
            "Asset Count": item.count,
            Percentage: `${((item.count / assets.length) * 100).toFixed(2)}%`,
          })) || [];
        filename = "category-report";
        break;

      default:
        return;
    }

    if (data.length > 0) {
      exportToCSV(data, filename);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Reports</h1>
      </div>

      {/* Report Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-gray-600 text-sm">Total Assets</p>
          <p className="text-3xl font-bold text-blue-600">
            {stats?.totalAssets || 0}
          </p>
        </div>
        <div className="card">
          <p className="text-gray-600 text-sm">Assigned Assets</p>
          <p className="text-3xl font-bold text-green-600">
            {stats?.assignedAssets || 0}
          </p>
        </div>
        <div className="card">
          <p className="text-gray-600 text-sm">Damaged/Lost</p>
          <p className="text-3xl font-bold text-red-600">
            {stats?.damagedAssets || 0}
          </p>
        </div>
        <div className="card">
          <p className="text-gray-600 text-sm">Total Value</p>
          <p className="text-3xl font-bold text-purple-600">
            $
            {assets
              .reduce((sum, a) => sum + (a.purchaseCost || 0), 0)
              .toLocaleString()}
          </p>
        </div>
      </div>

      {/* Report Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Assets Report */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            📦 Total Assets Report
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Generate a comprehensive report of all assets with details including
            status, location, and value.
          </p>
          <button
            onClick={() => handleExportCSV("all")}
            className="btn-primary w-full"
          >
            Export as CSV
          </button>
        </div>

        {/* Assigned Assets Report */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            👥 Assigned Assets Report
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Get a list of all assets currently assigned or in use by employees.
          </p>
          <button
            onClick={() => handleExportCSV("assigned")}
            className="btn-primary w-full"
          >
            Export as CSV
          </button>
        </div>

        {/* Damaged Assets Report */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            ⚠️ Damaged/Lost Assets Report
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Report on assets that are damaged, lost, or under maintenance.
          </p>
          <button
            onClick={() => handleExportCSV("damaged")}
            className="btn-primary w-full"
          >
            Export as CSV
          </button>
        </div>

        {/* Category Report */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            📊 Category Analysis Report
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Analyze asset distribution across different categories and segments.
          </p>
          <button
            onClick={() => handleExportCSV("category")}
            className="btn-primary w-full"
          >
            Export as CSV
          </button>
        </div>
      </div>

      {/* Category Breakdown */}
      {stats?.categoryStats && stats.categoryStats.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Category Breakdown
          </h2>
          <div className="space-y-3">
            {stats.categoryStats.map((cat) => (
              <div key={cat._id} className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">{cat._id}</span>
                <div className="flex items-center gap-3 flex-1 ml-4">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(cat.count / stats.totalAssets) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-gray-600 font-semibold w-16 text-right">
                    {cat.count} (
                    {((cat.count / stats.totalAssets) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status Breakdown */}
      {stats?.statusStats && stats.statusStats.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Status Distribution
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stats.statusStats.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200"
              >
                <div>
                  <p className="text-gray-700 font-medium">{item._id}</p>
                  <p className="text-gray-600 text-sm">
                    {((item.count / stats.totalAssets) * 100).toFixed(1)}% of
                    total
                  </p>
                </div>
                <p className="text-2xl font-bold text-blue-600">{item.count}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
