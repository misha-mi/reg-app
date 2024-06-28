import "./log.sass";

const Log = ({ time, status, context, userId, description, isColumnName }) => {
  let classColor = "";

  switch (status) {
    case "ERORR":
      classColor = "log_red log_fw900";
      break;
    case "LOG":
      classColor = "log_blue log_fw900";
      break;
    case "SUCCESS":
      classColor = "log_green log_fw900";
      break;
  }

  return (
    <div className={`log ${isColumnName ? "log_columns-names" : ""}`}>
      <div className="log__time">{time}</div>
      <div className={`log__status ${classColor}`}>{status}</div>
      <div className="log__context">{context}</div>
      <div className="log__user-id">{userId}</div>
      <div className="log__description">{description}</div>
    </div>
  );
};

export default Log;
