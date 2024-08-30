import "./logs-page.sass";
import ControllPanel from "../../components/controll-panel/controll-panel";
import Log from "../../components/log/log";
import { useState } from "react";

const LogsPage = () => {
  const [searchBy, setSearchBy] = useState("description");
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="logs-page">
      <ControllPanel
        isLogs
        searchBy={searchBy}
        setSearchBy={setSearchBy}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
      />
      <Log
        time={"Date"}
        serverId={"Server IP"}
        sourceId={"Source IP"}
        description={"Description"}
        isColumnName
      />
      <div className="logs-page__logs">
        <Log
          time={"6/26/2024, 2:37:31 PM"}
          serverId={"192.168.2.10"}
          sourceId={"192.168.2.10"}
          description={
            "The configuration file has been transferred. (id: da402c68-babd-40eb-ab78-3c380edccfe1)"
          }
        />
        <Log
          time={"6/26/2024, 2:37:31 PM"}
          serverId={"192.168.2.10"}
          sourceId={"192.168.2.10"}
          description={"Successful connection to the database"}
        />
        <Log
          time={"6/26/2024, 2:37:31 PM"}
          serverId={"192.168.2.10"}
          sourceId={"192.168.2.10"}
          description={"Successful connection to the database"}
        />
      </div>
    </div>
  );
};

export default LogsPage;
