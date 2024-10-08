import { useEffect, useState } from "react";
import ControllPanel from "../../components/controll-panel/controll-panel";
import CreateModal from "../../components/create-modal/create-modal";
import User from "../../components/user/user";
import "./users-page.sass";
import InfoModal from "../../components/info-modal/info-modal";
import Button from "../../ui/button/button";
import getUsers from "../../services/get-users";
import deleteUser from "../../services/delete-user";
import deleteUsers from "../../services/delete-users";

const UsersPage = () => {
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isOpenDeleteMarkedModal, setIsOpenDeleteMarkedModal] = useState(false);
  const [isOpenInfoModal, setIsOpenInfoModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [idMarkedUsers, setIdMarkedUsers] = useState([]);
  const [searchBy, setSearchBy] = useState("name");
  const [searchValue, setSearchValue] = useState("");

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
      setIsOpenDeleteMarkedModal(false);
      setIsOpenInfoModal(false);
    }
  };

  const openInfoModal = (message) => {
    setIsOpenDeleteModal(false);
    setIsOpenCreateModal(false);
    setIsOpenDeleteMarkedModal(false);
    setIsOpenInfoModal(message);
  };

  const handlerDelete = () => {
    deleteUser(isOpenDeleteModal)
      .then(({ data }) => {
        openInfoModal("The account was deleted successfully");
        setUsers((state) => state.filter((item) => item.id !== data));
      })
      .catch(() => console.log("error"));
  };

  const handlerDeleteMarked = async () => {
    deleteUsers(idMarkedUsers)
      .then(() => {
        openInfoModal("The accounts was deleted successfully");
        setUsers((state) =>
          state.filter((item) => !idMarkedUsers.includes(item.id))
        );
        setIdMarkedUsers([]);
      })
      .catch(console.log);
  };

  return (
    <>
      <div className="users-page">
        <ControllPanel
          handlerOpenCreateModal={() => setIsOpenCreateModal(true)}
          searchBy={searchBy}
          setSearchBy={setSearchBy}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          setIsOpenDeleteModal={setIsOpenDeleteMarkedModal}
          isDisableRemoveButton={!idMarkedUsers.length}
        />
        <User
          name={"Name"}
          login={"Login"}
          domain={"Domain"}
          number={"SIP"}
          id={"ID"}
          isColumnName
        />
        <div className="users-page__users">
          {users.map((user) => {
            const { id, login, name, domain, number } = user;
            if (user[searchBy].includes(searchValue))
              return (
                <User
                  name={name}
                  login={login}
                  domain={domain}
                  number={number}
                  id={id}
                  key={id}
                  handlerRemove={setIsOpenDeleteModal}
                  setCheck={setIdMarkedUsers}
                  check={idMarkedUsers.includes(id)}
                />
              );
          })}
        </div>
      </div>
      <CreateModal
        isOpen={isOpenCreateModal}
        handlerClose={handlerClose}
        openInfoModal={openInfoModal}
        setUsers={setUsers}
        openRemoveModal={() => setIsOpenDeleteModal(false)}
      />
      <InfoModal
        desc={`Are you sure you want to delete the user ${isOpenDeleteModal}?`}
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
        desc={`Are you sure you want to delete the marked user?`}
        handlerClose={handlerClose}
        isOpen={isOpenDeleteMarkedModal}
      >
        <div className="info-modal__buttons">
          <Button color={"red"} onClick={handlerDeleteMarked}>
            Remove
          </Button>
          <Button
            color={"green"}
            onClick={() => setIsOpenDeleteMarkedModal(false)}
          >
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
