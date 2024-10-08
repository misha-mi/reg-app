import "./user.sass";
import trash from "../../assets/icons/trash.png";

import Button from "../../ui/button/button";

const User = ({
  name,
  login,
  domain,
  id,
  isColumnName,
  handlerRemove,
  setCheck,
  check,
  number,
}) => {
  const changeCheck = () => {
    setCheck((state) => {
      if (check) {
        return state.filter((item) => item !== id);
      } else {
        return [...state, id];
      }
    });
  };

  return (
    <div className={`user${isColumnName ? " user__column-name" : ""}`}>
      <label className="user__check">
        <input type="checkbox" checked={check} onChange={changeCheck} />
        <span className="user__checkmark"></span>
      </label>
      <div className="user__info">
        <div className="user__name user__text">{name}</div>
        <div className="user__login user__text">{login}</div>
        <div className="user__domain user__text">{domain}</div>
        <div className="user__number user__text">{number}</div>
        <div className="user__id user__text">{id}</div>
      </div>
      <div className="user__buttons">
        <Button color={"blue"}>Logs</Button>
        <Button color={"red"} onClick={() => handlerRemove(id)}>
          <img src={trash} alt="trash" className="button__img" />
        </Button>
      </div>
    </div>
  );
};

export default User;
