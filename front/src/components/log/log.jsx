import "./log.sass";

const Log = ({ time, serverId, sourceId, description, isColumnName }) => {
  return (
    <div className={`log ${isColumnName ? "log_columns-names" : ""}`}>
      <div className="log__time">{time}</div>
      <div className="log__server-id">{serverId}</div>
      <div className="log__source-id">{sourceId}</div>
      <div className="log__description">{description}</div>
    </div>
  );
};

export default Log;
