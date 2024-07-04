import { useState } from "react";
import Button from "../../ui/button/button";
import CloseButton from "../../ui/close-button/close-button";
import Input from "../../ui/input/input";
import "./create-modal.sass";
import postCreate from "../../services/post-create";

const CreateModal = ({ isOpen, handlerClose }) => {
  const [name, setName] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const createUser = (e) => {
    e.preventDefault();
    postCreate({ name, login, password })
      .then(() => console.log("success"))
      .catch(() => console.log("error"));
  };

  return (
    <div
      className={`create-modal ${isOpen ? "create-modal_open" : ""}`}
      onClick={handlerClose}
      data-close
    >
      <div className="create-modal__wrapper">
        <form action="#" className="create-modal__form" onSubmit={createUser}>
          <div className="create-modal__title">Name</div>
          <div className="create-modal__input">
            <Input value={name} setValue={setName} />
          </div>
          <div className="create-modal__title">Login</div>
          <div className="create-modal__input">
            <Input value={login} setValue={setLogin} />
          </div>
          <div className="create-modal__title">Password</div>
          <div className="create-modal__input">
            <Input value={password} setValue={setPassword} />
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
