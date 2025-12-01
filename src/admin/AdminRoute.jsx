export default function AdminRoute({ children }) {
  const token = localStorage.getItem("adminToken");
  const user = JSON.parse(localStorage.getItem("weglowUser"));

  if (!token || !user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
}
