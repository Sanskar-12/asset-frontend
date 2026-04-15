import { getStatusBadgeColor } from "../utils/helpers";

export default function StatusBadge({ status }) {
  return (
    <span className={`badge ${getStatusBadgeColor(status)}`}>{status}</span>
  );
}
