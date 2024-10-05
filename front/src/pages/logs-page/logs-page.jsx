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
          .map((log) => {
            const { id, time, serverIp, sourceIp, desc } = log;
            if (log.desc.includes(searchValue)) {
              return (
                <Log
                  key={id}
                  time={new Date(time).toLocaleDateString("en-US", optionDate)}
                  serverId={serverIp}
                  sourceId={sourceIp}
                  description={desc}
                />
              );
            }
          })
          .reverse()}
      </div>
    </div>
  );
};

export default LogsPage;
