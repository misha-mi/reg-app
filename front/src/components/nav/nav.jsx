import "./nav.sass";

import { useState } from "react";
import { Link, Outlet } from "react-router-dom";

const Nav = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="nav">
      <div
        className={`nav__tab ${activeTab === 0 ? " nav_active" : ""}`}
        onClick={() => setActiveTab(0)}
      >
        <Link to="/">Users</Link>
      </div>
      <div
        className={`nav__tab ${activeTab === 1 ? " nav_active" : ""}`}
        onClick={() => setActiveTab(1)}
      >
        <Link to="/logs">Logs</Link>
      </div>
    </div>
  );
};

export default Nav;
