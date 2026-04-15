import React, { useState } from "react";
import { assetAPI } from "../services/api";

const CATEGORIES = [
  "Electronics",
  "Furniture",
  "Machinery",
  "Vehicles",
  "Office Equipment",
  "Software",
];

const CONDITIONS = ["Excellent", "Good", "Fair", "Poor"];

const STATUSES = [
  "Available",
  "Assigned",
  "In Use",
  "Maintenance",
  "Damaged",
  "Lost",
  "Retired",
];

export default function AssetForm({
  onSubmit,
  initialData = null,
  users = [],
}) {
  const [formData, setFormData] = useState(
    initialData || {
      name: "",
      category: "Electronics",
      type: "",
      brand: "",
      model: "",
      barcodeNumber: "",
      purchaseDate: "",
      purchaseCost: "",
      vendorName: "",
      warrantyExpiry: "",
      status: "Available",
      location: "Headquarters",
      condition: "Good",
      remarks: "",
      serialNumber: "",
    },
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (initialData) {
        await assetAPI.updateAsset(initialData._id, formData);
      } else {
        await assetAPI.createAsset(formData);
      }
      onSubmit();
    } catch (err) {
      setError(err.response?.data?.message || "Error saving asset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="form-group">
          <label className="form-label">Asset Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="e.g., Dell Laptop"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="form-select"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Type *</label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="e.g., Laptop"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Brand</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="form-input"
            placeholder="e.g., Dell"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Model</label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
            className="form-input"
            placeholder="e.g., XPS 13"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Barcode Number (Future Scanner)</label>
          <input
            type="text"
            name="barcodeNumber"
            value={formData.barcodeNumber}
            onChange={handleChange}
            className="form-input"
            placeholder="e.g., BARCODE001"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Serial Number</label>
          <input
            type="text"
            name="serialNumber"
            value={formData.serialNumber}
            onChange={handleChange}
            className="form-input"
            placeholder="e.g., SN12345001"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Purchase Date *</label>
          <input
            type="date"
            name="purchaseDate"
            value={formData.purchaseDate?.split("T")[0] || ""}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Purchase Cost *</label>
          <input
            type="number"
            name="purchaseCost"
            value={formData.purchaseCost}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="0.00"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Vendor Name</label>
          <input
            type="text"
            name="vendorName"
            value={formData.vendorName}
            onChange={handleChange}
            className="form-input"
            placeholder="e.g., Tech Supplies Inc"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Warranty Expiry</label>
          <input
            type="date"
            name="warrantyExpiry"
            value={formData.warrantyExpiry?.split("T")[0] || ""}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="form-select"
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Location</label>
          <select
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="form-select"
          >
            <option value="Headquarters">Headquarters</option>
            <option value="Branch Office">Branch Office</option>
            <option value="Remote">Remote</option>
            <option value="Storage">Storage</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Condition</label>
          <select
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            className="form-select"
          >
            {CONDITIONS.map((cond) => (
              <option key={cond} value={cond}>
                {cond}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Remarks</label>
        <textarea
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
          className="form-textarea"
          placeholder="Additional notes or remarks"
          rows="3"
        />
      </div>

      <div className="flex gap-2 justify-end">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading
            ? "Saving..."
            : initialData
              ? "Update Asset"
              : "Create Asset"}
        </button>
      </div>
    </form>
  );
}
