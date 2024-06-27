import "./user.sass";
import Button from "../../ui/button/button";

const User = ({ name, login, domain, id, isColumnName }) => {
  return (
    <div className={`user${isColumnName ? " user__column-name" : ""}`}>
      <label className="user__check">
        <input type="checkbox" />
        <span className="user__checkmark"></span>
      </label>
      <div className="user__info">
        <div className="user__name user__text">{name}</div>
        <div className="user__login user__text">{login}</div>
        <div className="user__domain user__text">{domain}</div>
        <div className="user__id user__text">{id}</div>
      </div>
      <div className="user__buttons">
        <Button color={"blue"}>Logs</Button>
        <Button color={"red"}>
          <div className="button__img"></div>
        </Button>
      </div>
    </div>
  );
};

export default User;
