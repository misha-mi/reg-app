import { useState } from "react";
import "./App.sass";
import PrivateRoute from "./HOC/private-route";
import Nav from "./components/nav/nav";
import AuthPage from "./pages/auth-page/auth-page";
import LogsPage from "./pages/logs-page/logs-page";
import UsersPage from "./pages/users-page/users-page";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import DownloadPage from "./pages/download-page/download-page";
import AdminRoute from "./HOC/admin-route";

const Pages = () => {
  return (
    <>
      <Nav />
      <div className="app__pages">
        <Outlet />
      </div>
    </>
  );
};

const App = () => {
  const [role, setRole] = useState();
  const [password, setPassword] = useState("");
  const [id, setId] = useState("");

  return (
    <div className="app">
      <div className="container">
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute forAuthorized setRole={setRole} role={role} />
              }
            >
              <Route
                path="/"
                element={
                  <AdminRoute isRights={role === "admin"} to={"/download"} />
                }
              >
                <Route path="/" element={<Pages />}>
                  <Route path="" element={<UsersPage />} />
                  <Route path="logs" element={<LogsPage />} />
                </Route>
              </Route>

              <Route
                path="/"
                element={<AdminRoute isRights={role === "user"} to="/" />}
              >
                <Route
                  path="download"
                  element={<DownloadPage password={password} id={id} />}
                />
              </Route>
            </Route>

            <Route
              path="/"
              element={<PrivateRoute setRole={setRole} />}
              isRights={true}
            >
              <Route
                path="/auth"
                element={
                  <AuthPage
                    setRole={setRole}
                    setId={setId}
                    password={password}
                    setPassword={setPassword}
                  />
                }
              />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
};

export default App;
