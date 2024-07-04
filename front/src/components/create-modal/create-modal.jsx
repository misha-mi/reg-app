import { useState } from "react";
import Button from "../../ui/button/button";
import CloseButton from "../../ui/close-button/close-button";
import Input from "../../ui/input/input";
import "./create-modal.sass";
import postCreate from "../../services/post-create";

const CreateModal = ({ isOpen, handlerClose, openInfoModal, setUsers }) => {
  const [name, setName] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const createUser = (e) => {
    e.preventDefault();
    setErrors([]);
    setIsLoading(true);
    postCreate({ name, login, password })
      .then(({ data }) => {
        openInfoModal("The account was created successfully");
        setUsers((state) => [...state, data]);
      })
      .catch((res) => setErrors(res.response.data.error.split(",")))
      .finally(() => setIsLoading(false));
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
            <Input
              value={name}
              setValue={setName}
              error={errors.filter((item) => item.includes("name"))[0]}
            />
          </div>
          <div className="create-modal__title">Login</div>
          <div className="create-modal__input">
            <Input
              value={login}
              setValue={setLogin}
              error={errors.filter((item) => item.includes("login"))[0]}
            />
          </div>
          <div className="create-modal__title">Password</div>
          <div className="create-modal__input">
            <Input
              value={password}
              setValue={setPassword}
              error={errors.filter((item) => item.includes("password"))[0]}
            />
          </div>
          <div className="create-modal__error">
            {errors.filter((item) => item.includes("already"))[0]}
          </div>
          <div className="create-modal__button">
            <Button
              classNames={["button_w215"]}
              color={"blue"}
              isLoading={isLoading}
            >
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
