import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = ({ isRights, to }) => {
  if (isRights) {
    return <Outlet />;
  } else {
    return <Navigate to={to} />;
  }
};

export default AdminRoute;
