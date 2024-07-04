import { useEffect, useState } from "react";
import ControllPanel from "../../components/controll-panel/controll-panel";
import CreateModal from "../../components/create-modal/create-modal";
import User from "../../components/user/user";
import "./users-page.sass";
import InfoModal from "../../components/info-modal/info-modal";
import Button from "../../ui/button/button";
import getUsers from "../../services/get-users";
import deleteUser from "../../services/delete-user";

const UsersPage = () => {
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isOpenInfoModal, setIsOpenInfoModal] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers()
      .then((res) => {
        setUsers(res.data.users);
      })
      .catch(() => console.log("error"));
  }, []);

  const handlerClose = (e) => {
    if (e.target.getAttribute("data-close")) {
      setIsOpenCreateModal(false);
      setIsOpenDeleteModal(false);
      setIsOpenInfoModal(false);
    }
  };

  const openInfoModal = (message) => {
    console.log(123);
    setIsOpenDeleteModal(false);
    setIsOpenCreateModal(false);
    setIsOpenInfoModal(message);
  };

  const handlerDelete = () => {
    deleteUser(isOpenDeleteModal)
      .then(() => {
        openInfoModal("The account was deleted successfully");
      })
      .catch(() => console.log("error"));
  };

  return (
    <>
      <div className="users-page">
        <ControllPanel
          handlerOpenCreateModal={() => setIsOpenCreateModal(true)}
        />
        <User
          name={"Name"}
          login={"Login"}
          domain={"Domain"}
          id={"ID"}
          isColumnName
        />
        {users.map(({ id, login, name }) => {
          const [loginName, domain] = login.split("@");
          return (
            <User
              name={name}
              login={loginName}
              domain={domain}
              id={id}
              key={id}
              handlerRemove={setIsOpenDeleteModal}
            />
          );
        })}
      </div>
      <CreateModal
        isOpen={isOpenCreateModal}
        handlerClose={handlerClose}
        openInfoModal={openInfoModal}
      />
      <InfoModal
        desc={`Are you sure you want to delete the user ${isOpenDeleteModal}`}
        handlerClose={handlerClose}
        isOpen={isOpenDeleteModal}
      >
        <div className="info-modal__buttons">
          <Button color={"red"} onClick={handlerDelete}>
            Remove
          </Button>
          <Button color={"green"} onClick={() => setIsOpenDeleteModal(false)}>
            No
          </Button>
        </div>
      </InfoModal>
      <InfoModal
        desc={isOpenInfoModal}
        handlerClose={handlerClose}
        isOpen={isOpenInfoModal}
      >
        <div className="info-modal_tac">
          <Button
            color={"green"}
            onClick={() => setIsOpenInfoModal(false)}
            classNames={["button_w215"]}
          >
            Ok
          </Button>
        </div>
      </InfoModal>
    </>
  );
};

export default UsersPage;
