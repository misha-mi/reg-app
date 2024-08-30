import "./logs-page.sass";
import ControllPanel from "../../components/controll-panel/controll-panel";
import Log from "../../components/log/log";
import { useEffect, useState } from "react";
import getLogs from "../../services/get-logs";

const LogsPage = () => {
  const [searchBy, setSearchBy] = useState("description");
  const [searchValue, setSearchValue] = useState("");
  const [logs, setLogs] = useState([]);
  const optionDate = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };

  useEffect(() => {
    getLogs()
      .then((res) => setLogs(res.data))
      .catch(console.log);
  }, []);

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
        {logs
          .map((log) => (
            <Log
              key={log.id}
              time={new Date(log.time).toLocaleDateString("en-US", optionDate)}
              serverId={log.serverIp}
              sourceId={log.sourceIp}
              description={log.desc}
            />
          ))
          .reverse()}

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
