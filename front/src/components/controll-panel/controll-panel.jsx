import "./controll-panel.sass";

import Button from "../../ui/button/button";
import Input from "../../ui/input/input";
import PopupFilter from "../popup-filter/popup-filter";
import DatePickerCustom from "../date-picker-custom/date-picker-custom";

const ControllPanel = ({ isLogs, handlerOpenCreateModal }) => {
  const tabsNames = isLogs
    ? ["Status", "Context", "ID", "Description"]
    : ["Name", "Login", "Domain", "ID"];

  const buttons = isLogs ? (
    <DatePickerCustom />
  ) : (
    <>
      <Button color={"red"}>Remove marked</Button>
      <Button color={"blue"} onClick={handlerOpenCreateModal}>
        Create
      </Button>
    </>
  );

  return (
    <div className={`controll-panel ${isLogs ? "controll-panel_w700" : ""}`}>
      <PopupFilter tabsNames={tabsNames} />
      <div className="controll-panel__search">
        <Input placeholder="Search" isSearch />
      </div>
      {buttons}
    </div>
  );
};

export default ControllPanel;
