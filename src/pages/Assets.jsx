import { useEffect, useState } from "react";
import { assetAPI } from "../services/api";
import Modal from "../components/Modal";
import AssetForm from "../components/AssetForm";
import StatusBadge from "../components/StatusBadge";
import { getCategoryIcon } from "../utils/helpers";

export default function Assets() {
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);

  const CATEGORIES = [
    "Electronics",
    "Furniture",
    "Machinery",
    "Vehicles",
    "Office Equipment",
    "Software",
  ];

  const STATUSES = [
    "Available",
    "Assigned",
    "In Use",
    "Maintenance",
    "Damaged",
    "Lost",
    "Retired",
  ];

  const LOCATIONS = ["Headquarters", "Branch Office", "Remote", "Storage"];

  useEffect(() => {
    fetchAssets();
  }, []);

  useEffect(() => {
    filterAssets();
  }, [assets, searchTerm, categoryFilter, statusFilter, locationFilter]);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const response = await assetAPI.getAllAssets({});
      setAssets(response.data);
    } catch (error) {
      console.error("Error fetching assets:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAssets = () => {
    let filtered = assets;

    if (searchTerm) {
      filtered = filtered.filter(
        (asset) =>
          asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.assetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (asset.barcodeNumber &&
            asset.barcodeNumber
              .toLowerCase()
              .includes(searchTerm.toLowerCase())),
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter((asset) => asset.category === categoryFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter((asset) => asset.status === statusFilter);
    }

    if (locationFilter) {
      filtered = filtered.filter((asset) => asset.location === locationFilter);
    }

    setFilteredAssets(filtered);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this asset?")) {
      try {
        await assetAPI.deleteAsset(id);
        fetchAssets();
      } catch (error) {
        alert("Error deleting asset: " + error.message);
      }
    }
  };

  const handleEdit = (asset) => {
    setEditingAsset(asset);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingAsset(null);
    setShowModal(true);
  };

  const handleFormSubmit = () => {
    setShowModal(false);
    setEditingAsset(null);
    fetchAssets();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Assets Management</h1>
        <button
          onClick={handleAddNew}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add New Asset
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Search by name, ID, or barcode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input rounded-lg"
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="form-select"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
          >
            <option value="">All Status</option>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="form-select"
          >
            <option value="">All Locations</option>
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setSearchTerm("");
              setCategoryFilter("");
              setStatusFilter("");
              setLocationFilter("");
            }}
            className="btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Assets Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading assets...</div>
        ) : filteredAssets.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No assets found</div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Asset ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>Condition</th>
                  <th>Value</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((asset) => (
                  <tr key={asset._id}>
                    <td>
                      <span className="font-mono text-sm text-blue-600">
                        {asset.assetId}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {getCategoryIcon(asset.category)}
                        </span>
                        <span className="font-semibold text-gray-800">
                          {asset.name}
                        </span>
                      </div>
                    </td>
                    <td className="text-gray-600">{asset.category}</td>
                    <td className="text-gray-600 text-sm">{asset.type}</td>
                    <td>
                      <StatusBadge status={asset.status} />
                    </td>
                    <td className="text-gray-600 text-sm">{asset.location}</td>
                    <td className="text-sm">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          asset.condition === "Excellent"
                            ? "bg-green-100 text-green-800"
                            : asset.condition === "Good"
                              ? "bg-blue-100 text-blue-800"
                              : asset.condition === "Fair"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                        }`}
                      >
                        {asset.condition}
                      </span>
                    </td>
                    <td className="font-semibold text-gray-800">
                      ${asset.purchaseCost}
                    </td>
                    <td className="text-sm space-x-2">
                      <button
                        onClick={() => handleEdit(asset)}
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(asset._id)}
                        className="text-red-600 hover:text-red-800 font-semibold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-gray-600 text-sm">Total Assets</p>
          <p className="text-3xl font-bold text-blue-600">{assets.length}</p>
        </div>
        <div className="card">
          <p className="text-gray-600 text-sm">Search Results</p>
          <p className="text-3xl font-bold text-green-600">
            {filteredAssets.length}
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
        <div className="card">
          <p className="text-gray-600 text-sm">Available</p>
          <p className="text-3xl font-bold text-emerald-600">
            {assets.filter((a) => a.status === "Available").length}
          </p>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        title={editingAsset ? "Edit Asset" : "Add New Asset"}
        onClose={() => {
          setShowModal(false);
          setEditingAsset(null);
        }}
      >
        <AssetForm onSubmit={handleFormSubmit} initialData={editingAsset} />
      </Modal>
    </div>
  );
}
