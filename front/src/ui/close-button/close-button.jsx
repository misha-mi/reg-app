import "./close-button.sass";

const CloseButton = () => {
  return (
    <button className="close-button" data-close>
      <div className="close-button__span" data-close></div>
      <div className="close-button__span" data-close></div>
    </button>
  );
};

export default CloseButton;
