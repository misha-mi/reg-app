import { useState } from "react";
import "./nav.sass";

const Nav = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="nav">
      <button
        className={`nav__tab ${activeTab === 0 ? " nav_active" : ""}`}
        onClick={() => setActiveTab(0)}
      >
        Users
      </button>
      <button
        className={`nav__tab ${activeTab === 1 ? " nav_active" : ""}`}
        onClick={() => setActiveTab(1)}
      >
        Logs
      </button>
    </div>
  );
};

export default Nav;
