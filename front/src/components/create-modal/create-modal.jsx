import Button from "../../ui/button/button";
import CloseButton from "../../ui/close-button/close-button";
import Input from "../../ui/input/input";
import "./create-modal.sass";

const CreateModal = ({ isOpen, handlerClose }) => {
  return (
    <div
      className={`create-modal ${isOpen ? "create-modal_open" : ""}`}
      onClick={handlerClose}
      data-close
    >
      <div className="create-modal__wrapper">
        <form action="#" className="create-modal__form">
          <div className="create-modal__title">Name</div>
          <div className="create-modal__input">
            <Input />
          </div>
          <div className="create-modal__title">Login</div>
          <div className="create-modal__input">
            <Input />
          </div>
          <div className="create-modal__title">Password</div>
          <div className="create-modal__input">
            <Input />
          </div>
          <div className="create-modal__button">
            <Button classNames={["button_w215"]} color={"blue"}>
              Create
            </Button>
          </div>
        </form>
        <div className="create-modal__close">
          <CloseButton />
        </div>
      </div>
    </div>
  );
};

export default CreateModal;
