import "./info-modal.sass";

const InfoModal = ({ children, desc, isOpen, handlerClose }) => {
  return (
    <div
      className={`info-modal ${isOpen ? "info-modal_open" : ""}`}
      onClick={handlerClose}
      data-close
    >
      <div className="info-modal__wrapper">
        <div className="info-modal__desc">{desc}</div>
        {children}
      </div>
    </div>
  );
};

export default InfoModal;
