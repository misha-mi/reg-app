import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import getUser from "../services/get-user";

const PrivateRoute = ({ forAuthorized, setRole, role }) => {
  const to = forAuthorized ? "/auth" : "/";
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    getUser()
      .then((res) => {
        if (res.data.role === "admin") {
          setRole(res.data.role);
          setIsAuth(true);
        }
      })
      .catch(() => console.log("error"))
      .finally(() => {
        setIsLoading(false);
      });
  }, [role]);

  if (!(isAuth ^ forAuthorized)) {
    return <Outlet />;
  } else {
    return <Navigate to={to} />;
  }
};

export default PrivateRoute;
