import ControllPanel from "../../components/controll-panel/controll-panel";
import User from "../../components/user/user";
import "./users-page.sass";

const UsersPage = () => {
  return (
    <div className="users-page">
      <ControllPanel />
      <User
        name={"Name"}
        login={"Login"}
        domain={"Domain"}
        id={"ID"}
        isColumnName
      />
      <User
        name={"Name"}
        login={"Login"}
        domain={"Domain"}
        id={"0b09f17d-4407-48f1..."}
      />
      <User
        name={"Name"}
        login={"Login"}
        domain={"Domain"}
        id={"5c15e656-e67d-4ca9..."}
      />
      <User
        name={"Name"}
        login={"Login"}
        domain={"Domain"}
        id={"66ac9f63-03ec-4120..."}
      />
      <User
        name={"Name"}
        login={"Login"}
        domain={"Domain"}
        id={"0b09f17d-4407-48f1..."}
      />
    </div>
  );
};

export default UsersPage;
