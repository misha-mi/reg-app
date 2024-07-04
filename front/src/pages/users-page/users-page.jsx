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
      setIsOpenInfoModal(false);
    }
  };

  const handlerDelete = () => {
    deleteUser(isOpenInfoModal)
      .then(() => console.log("succes remove"))
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
          handlerRemove={setIsOpenInfoModal}
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
              handlerRemove={setIsOpenInfoModal}
            />
          );
        })}
      </div>
      <CreateModal isOpen={isOpenCreateModal} handlerClose={handlerClose} />
      <InfoModal
        desc={`Are you sure you want to delete the user ${isOpenInfoModal}`}
        handlerClose={handlerClose}
        isOpen={isOpenInfoModal}
      >
        <div className="info-modal__buttons">
          <Button color={"red"} onClick={handlerDelete}>
            Remove
          </Button>
          <Button color={"green"} onClick={() => setIsOpenInfoModal(false)}>
            No
          </Button>
        </div>
      </InfoModal>
    </>
  );
};

export default UsersPage;
