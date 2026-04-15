import React, { useEffect, useState } from "react";
import { assignmentAPI, authAPI, assetAPI } from "../services/api";
import Modal from "../components/Modal";
import StatusBadge from "../components/StatusBadge";
import { formatDate } from "../utils/helpers";

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [users, setUsers] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [returnRemarks, setReturnRemarks] = useState("");

  const [assignmentForm, setAssignmentForm] = useState({
    assetId: "",
    assignedToId: "",
    expectedReturnDate: "",
    purpose: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [assignRes, usersRes, assetsRes] = await Promise.all([
        assignmentAPI.getAllAssignments(),
        authAPI.getUsers(),
        assetAPI.getAllAssets(),
      ]);
      setAssignments(assignRes.data);
      setUsers(usersRes.data);
      setAssets(assetsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReturnAsset = async () => {
    try {
      await assignmentAPI.returnAsset(selectedAssignment._id, returnRemarks);
      setShowReturnModal(false);
      setReturnRemarks("");
      setSelectedAssignment(null);
      fetchData();
    } catch (error) {
      alert("Error returning asset: " + error.message);
    }
  };

  const handleAssignmentFormChange = (e) => {
    const { name, value } = e.target;
    setAssignmentForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitAssignment = async () => {
    try {
      await assignmentAPI.createAssignment(assignmentForm);
      setShowAssignModal(false);
      setAssignmentForm({
        assetId: "",
        assignedToId: "",
        expectedReturnDate: "",
        purpose: "",
      });
      fetchData();
    } catch (error) {
      alert("Error creating assignment: " + error.message);
    }
  };

  const activeAssignments = assignments.filter((a) => a.status === "Active");
  const returnedAssignments = assignments.filter(
    (a) => a.status === "Returned",
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Asset Assignments</h1>
        <button
          onClick={() => setShowAssignModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Assign Asset
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <p className="text-gray-600 text-sm">Active Assignments</p>
          <p className="text-3xl font-bold text-blue-600">
            {activeAssignments.length}
          </p>
        </div>
        <div className="card">
          <p className="text-gray-600 text-sm">Returned Assets</p>
          <p className="text-3xl font-bold text-green-600">
            {returnedAssignments.length}
          </p>
        </div>
        <div className="card">
          <p className="text-gray-600 text-sm">Total Users</p>
          <p className="text-3xl font-bold text-purple-600">{users.length}</p>
        </div>
      </div>

      {/* Active Assignments */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Active Assignments
        </h2>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : activeAssignments.length === 0 ? (
          <p className="text-gray-500">No active assignments</p>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Assigned To</th>
                  <th>Issued Date</th>
                  <th>Expected Return</th>
                  <th>Purpose</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeAssignments.map((assignment) => (
                  <tr key={assignment._id}>
                    <td className="font-semibold text-gray-800">
                      {assignment.asset.name}
                    </td>
                    <td className="text-gray-600">
                      {assignment.assignedTo.name}
                    </td>
                    <td className="text-gray-600 text-sm">
                      {formatDate(assignment.dateIssued)}
                    </td>
                    <td className="text-gray-600 text-sm">
                      {formatDate(assignment.expectedReturnDate) || "Not set"}
                    </td>
                    <td className="text-gray-600 text-sm">
                      {assignment.purpose}
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          setSelectedAssignment(assignment);
                          setShowReturnModal(true);
                        }}
                        className="text-red-600 hover:text-red-800 font-semibold"
                      >
                        Return
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Returned Assignments */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Returned Assignments
        </h2>
        {returnedAssignments.length === 0 ? (
          <p className="text-gray-500">No returned assignments yet</p>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Was Assigned To</th>
                  <th>Issued Date</th>
                  <th>Returned Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {returnedAssignments.slice(0, 10).map((assignment) => (
                  <tr key={assignment._id}>
                    <td className="font-semibold text-gray-800">
                      {assignment.asset.name}
                    </td>
                    <td className="text-gray-600">
                      {assignment.assignedTo.name}
                    </td>
                    <td className="text-gray-600 text-sm">
                      {formatDate(assignment.dateIssued)}
                    </td>
                    <td className="text-gray-600 text-sm">
                      {formatDate(assignment.actualReturnDate)}
                    </td>
                    <td>
                      <StatusBadge status={assignment.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Assign Asset Modal */}
      <Modal
        isOpen={showAssignModal}
        title="Assign Asset to Employee"
        onClose={() => {
          setShowAssignModal(false);
          setAssignmentForm({
            assetId: "",
            assignedToId: "",
            expectedReturnDate: "",
            purpose: "",
          });
        }}
      >
        <form className="space-y-4">
          <div className="form-group">
            <label className="form-label">Select Asset *</label>
            <select
              name="assetId"
              value={assignmentForm.assetId}
              onChange={handleAssignmentFormChange}
              required
              className="form-select"
            >
              <option value="">-- Select Asset --</option>
              {assets.map((asset) => (
                <option key={asset._id} value={asset._id}>
                  {asset.name} ({asset.assetCode})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Select Employee *</label>
            <select
              name="assignedToId"
              value={assignmentForm.assignedToId}
              onChange={handleAssignmentFormChange}
              required
              className="form-select"
            >
              <option value="">-- Select Employee --</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Purpose of Assignment *</label>
            <textarea
              name="purpose"
              value={assignmentForm.purpose}
              onChange={handleAssignmentFormChange}
              required
              className="form-textarea"
              placeholder="e.g., Development work"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Expected Return Date</label>
            <input
              type="date"
              name="expectedReturnDate"
              value={assignmentForm.expectedReturnDate}
              onChange={handleAssignmentFormChange}
              className="form-input"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowAssignModal(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmitAssignment}
              className="btn-primary"
            >
              Assign Asset
            </button>
          </div>
        </form>
      </Modal>

      {/* Return Asset Modal */}
      <Modal
        isOpen={showReturnModal}
        title={`Return - ${selectedAssignment?.asset?.name}`}
        onClose={() => {
          setShowReturnModal(false);
          setSelectedAssignment(null);
          setReturnRemarks("");
        }}
      >
        <form className="space-y-4">
          <p className="text-gray-700">
            <strong>Assigned To:</strong> {selectedAssignment?.assignedTo?.name}
          </p>
          <p className="text-gray-700">
            <strong>Issued Date:</strong>{" "}
            {formatDate(selectedAssignment?.dateIssued)}
          </p>

          <div className="form-group">
            <label className="form-label">Return Remarks</label>
            <textarea
              value={returnRemarks}
              onChange={(e) => setReturnRemarks(e.target.value)}
              className="form-textarea"
              placeholder="Any notes about the asset condition or return"
              rows="3"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => {
                setShowReturnModal(false);
                setSelectedAssignment(null);
                setReturnRemarks("");
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleReturnAsset}
              className="btn-primary"
            >
              Confirm Return
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
