import { useState } from "react";
import ControllPanel from "../../components/controll-panel/controll-panel";
import CreateModal from "../../components/create-modal/create-modal";
import User from "../../components/user/user";
import "./users-page.sass";
import InfoModal from "../../components/info-modal/info-modal";
import Button from "../../ui/button/button";

const UsersPage = () => {
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  const [isOpenInfoModal, setIsOpenInfoModal] = useState(false);

  const handlerClose = (e) => {
    if (e.target.getAttribute("data-close")) {
      setIsOpenCreateModal(false);
      setIsOpenInfoModal(false);
    }
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
        <User
          name={"Pasha"}
          login={"Login"}
          domain={"Domain"}
          id={"0b09f17d-4407-48f1..."}
          handlerRemove={setIsOpenInfoModal}
        />
        <User
          name={"Max"}
          login={"Login"}
          domain={"Domain"}
          id={"5c15e656-e67d-4ca9..."}
          handlerRemove={setIsOpenInfoModal}
        />
        <User
          name={"Anton"}
          login={"Login"}
          domain={"Domain"}
          id={"66ac9f63-03ec-4120..."}
          handlerRemove={setIsOpenInfoModal}
        />
        <User
          name={"Kate"}
          login={"Login"}
          domain={"Domain"}
          id={"0b09f17d-4407-48f1..."}
          handlerRemove={setIsOpenInfoModal}
        />
      </div>
      <CreateModal isOpen={isOpenCreateModal} handlerClose={handlerClose} />
      <InfoModal
        desc={`Are you sure you want to delete the user ${isOpenInfoModal}`}
        handlerClose={handlerClose}
        isOpen={isOpenInfoModal}
      >
        <div className="info-modal__buttons">
          <Button color={"red"}>Remove</Button>
          <Button color={"green"} onClick={() => setIsOpenInfoModal(false)}>
            No
          </Button>
        </div>
      </InfoModal>
    </>
  );
};

export default UsersPage;
