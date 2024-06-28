import "./button.sass";

const Button = ({ children, color, onClick, classNames }) => {
  const className = `button button_${color} ${
    classNames?.length ? classNames : ""
  }`;

  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
