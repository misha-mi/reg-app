import Spinner from "../spinner/spinner";
import "./button.sass";

const Button = ({
  children,
  color,
  onClick,
  classNames,
  isLoading,
  disabled,
}) => {
  const className = `button button_${color} ${
    classNames?.length ? classNames : ""
  }`;

  return (
    <button
      className={className}
      onClick={onClick}
      disabled={isLoading || disabled}
    >
      {!isLoading ? (
        children
      ) : (
        <div className="button__spinner">
          <Spinner />
        </div>
      )}
    </button>
  );
};

export default Button;
