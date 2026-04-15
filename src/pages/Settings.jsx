import React, { useState, useEffect } from "react";
import { getUser, setUser } from "../utils/helpers";

export default function Settings() {
  const user = getUser();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    department: user?.department || "",
    role: user?.role || "",
  });

  const [showBarcodeModal, setShowBarcodeModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Update user in localStorage
    const updatedUser = { ...user, ...formData };
    setUser(updatedUser);
    alert("Settings saved successfully!");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Settings</h1>

      {/* User Profile Settings */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 max-w-2xl">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Profile Information
        </h2>

        <div className="space-y-4">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled
              className="form-input bg-gray-100"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled
              className="form-input bg-gray-100"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              disabled
              className="form-input bg-gray-100"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Role</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled
              className="form-input bg-gray-100 capitalize"
            />
          </div>

          <button onClick={handleSave} className="btn-primary">
            Save Changes
          </button>
        </div>
      </div>

      {/* Barcode Scanner Setup */}
      <div className="bg-blue-50 rounded-lg shadow-md p-6 border-2 border-blue-200">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-blue-900 mb-2">
              🔄 Scanner Integration (Coming Soon)
            </h2>
            <p className="text-blue-800 text-sm mb-4">
              The barcode/QR code scanner functionality is being prepared for
              future release.
            </p>
            <p className="text-blue-700 text-xs mb-3">
              <strong>Current Status:</strong> Database and architecture are
              ready for scanner integration. The system is prepared with barcode
              fields and will support scanning in the next version.
            </p>
            <button
              onClick={() => setShowBarcodeModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Learn More
            </button>
          </div>
          <span className="text-4xl">📱</span>
        </div>
      </div>

      {/* System Information */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          System Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600 text-sm">Application Name</p>
            <p className="text-xl font-semibold text-gray-800">
              Asset Management System
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Version</p>
            <p className="text-xl font-semibold text-gray-800">1.0.0</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Environment</p>
            <p className="text-xl font-semibold text-gray-800">
              Production Ready
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Last Update</p>
            <p className="text-xl font-semibold text-gray-800 capitalize">
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Features Overview */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Available Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-semibold text-gray-800">Asset Management</p>
              <p className="text-sm text-gray-600">
                Full CRUD operations on assets
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-semibold text-gray-800">Asset Assignment</p>
              <p className="text-sm text-gray-600">
                Assign and track assets to employees
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-semibold text-gray-800">Activity Logs</p>
              <p className="text-sm text-gray-600">
                Complete history of all asset changes
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-semibold text-gray-800">Reports & Analytics</p>
              <p className="text-sm text-gray-600">
                Generate and export reports
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-semibold text-gray-800">Dashboard</p>
              <p className="text-sm text-gray-600">
                Real-time asset statistics and charts
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔄</span>
            <div>
              <p className="font-semibold text-gray-800">Barcode Scanner</p>
              <p className="text-sm text-gray-600">Coming in next release</p>
            </div>
          </div>
        </div>
      </div>

      {/* Barcode Modal */}
      {showBarcodeModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowBarcodeModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Barcode Scanner Integration
              </h2>
              <button
                onClick={() => setShowBarcodeModal(false)}
                className="text-gray-600 hover:text-gray-800 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-bold mb-2">📊 Current Status</h3>
                <p className="text-sm">
                  The system is fully prepared for barcode and QR code scanning.
                  The database structure is ready with dedicated barcode number
                  and QR code fields for every asset.
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-2">🔍 What's Ready</h3>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Barcode number field in asset database</li>
                  <li>QR code field for future integration</li>
                  <li>Scan history table structure</li>
                  <li>API endpoints prepared</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold mb-2">🚀 Coming Soon</h3>
                <p className="text-sm">
                  In the next version, this system will support live barcode/QR
                  code scanning for quick asset identification and tracking.
                  This will enable faster asset check-ins, check-outs, and
                  inventory management.
                </p>
              </div>

              <div className="bg-blue-50 p-3 rounded border border-blue-200">
                <p className="text-xs text-blue-800">
                  <strong>Pro Tip:</strong> When adding new assets, fill in the
                  "Barcode Number" field to prepare them for scanner integration
                  once it's available!
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-2 justify-end">
              <button
                onClick={() => setShowBarcodeModal(false)}
                className="btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
