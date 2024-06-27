import "./button.sass";

const Button = ({ children, color }) => {
  return <button className={`button button_${color}`}>{children}</button>;
};

export default Button;
