import "./modal-info.sass";

const ModalInfo = ({ children, desc }) => {
  return (
    <div className="modal-info">
      <div className="modal-info__desc">{desc}</div>
      {children}
    </div>
  );
};

export default ModalInfo;
