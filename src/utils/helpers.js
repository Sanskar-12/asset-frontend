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

export const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
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
