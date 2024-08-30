import "./logs-page.sass";
import ControllPanel from "../../components/controll-panel/controll-panel";
import Log from "../../components/log/log";
import { useState } from "react";

const LogsPage = () => {
  const [searchBy, setSearchBy] = useState("status");

  return (
    <div className="logs-page">
      <ControllPanel isLogs searchBy={searchBy} setSearchBy={setSearchBy} />
      <Log
        time={"Date"}
        status={"Status"}
        context={"Context"}
        userId={"UserId"}
        description={"Description"}
        isColumnName
      />
      <div className="logs-page__logs">
        <Log
          time={"6/26/2024, 2:37:31 PM"}
          status={"SUCCESS"}
          context={"SQL"}
          userId={"0b09f17d-4407-48f1..."}
          description={
            "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eaque provident labore ducimus ad illo quae magnam quis veritatis, repudiandae rerum, enim officia, cupiditate pariatur obcaecati possimus culpa aliquid sint alias."
          }
        />
        <Log
          time={"6/26/2024, 2:37:31 PM"}
          status={"LOG"}
          context={"SQL"}
          userId={"0b09f17d-4407-48f1..."}
          description={"Successful connection to the database"}
        />
        <Log
          time={"6/26/2024, 2:37:31 PM"}
          status={"ERORR"}
          context={"SQL"}
          userId={"0b09f17d-4407-48f1..."}
          description={"Successful connection to the database"}
        />
      </div>
    </div>
  );
};

export default LogsPage;
