import Button from "../../ui/button/button";
import Search from "../../ui/search/search";
import "./controll-panel.sass";

const ControllPanel = () => {
  return (
    <div className="controll-panel">
      <Button>Search by name</Button>
      <div className="controll-panel__search">
        <Search />
      </div>
      <Button color={"red"}>Remove marked</Button>
      <Button color={"blue"}>Create</Button>
    </div>
  );
};

export default ControllPanel;
