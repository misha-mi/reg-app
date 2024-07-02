import "./input.sass";

const Input = ({ placeholder = "", value, setValue, isSearch }) => {
  let searchIcon = null;
  if (isSearch) {
    searchIcon = <label className="input__label" htmlFor="input"></label>;
  }

  const handlerSetValue = (e) => {
    setValue(e.target.value);
  };

  return (
    <div className="input">
      {searchIcon}
      <input
        id="input"
        type="text"
        className={`input__input ${isSearch ? "input_pl43" : ""}`}
        placeholder={placeholder}
        autoComplete="off"
        value={value}
        onChange={handlerSetValue}
      />
    </div>
  );
};

export default Input;
