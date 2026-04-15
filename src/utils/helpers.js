export const getStatusBadgeColor = (status) => {
  const statusColors = {
    Available: "badge-success",
    Assigned: "badge-info",
    "In Use": "badge-info",
    Maintenance: "badge-warning",
    Damaged: "badge-danger",
    Lost: "badge-danger",
    Retired: "badge-secondary",
    Active: "badge-success",
    Returned: "badge-secondary",
    Transferred: "badge-info",
  };
  return statusColors[status] || "badge-secondary";
};

export const getStatusColor = (status) => {
  const colors = {
    Available: "#10b981",
    Assigned: "#3b82f6",
    "In Use": "#3b82f6",
    Maintenance: "#f59e0b",
    Damaged: "#ef4444",
    Lost: "#ef4444",
    Retired: "#6b7280",
  };
  return colors[status] || "#6b7280";
};

export const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDateTime = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getCategoryIcon = (category) => {
  const icons = {
    Electronics: "💻",
    Furniture: "🪑",
    Machinery: "⚙️",
    Vehicles: "🚗",
    "Office Equipment": "📠",
    Software: "📦",
  };
  return icons[category] || "📦";
};

export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          if (typeof value === "string" && value.includes(",")) {
            return `"${value}"`;
          }
          return value;
        })
        .join(","),
    ),
  ].join("\n");

  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(csvContent),
  );
  element.setAttribute("download", `${filename}.csv`);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export const getAuthToken = () => localStorage.getItem("token");

export const setAuthToken = (token) => localStorage.setItem("token", token);

export const removeAuthToken = () => localStorage.removeItem("token");

export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const setUser = (user) =>
  localStorage.setItem("user", JSON.stringify(user));

export const removeUser = () => localStorage.removeItem("user");
