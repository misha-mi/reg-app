import "./controll-panel.sass";

import Button from "../../ui/button/button";
import Search from "../../ui/search/search";
import PopupFilter from "../popup-filter/popup-filter";
import DatePickerCustom from "../date-picker-custom/date-picker-custom";

const ControllPanel = ({ isLogs }) => {
  const tabsNames = isLogs
    ? ["Status", "Context", "ID", "Description"]
    : ["Name", "Login", "Domain", "ID"];

  const buttons = isLogs ? (
    <DatePickerCustom />
  ) : (
    <>
      <Button color={"red"}>Remove marked</Button>
      <Button color={"blue"}>Create</Button>
    </>
  );

  return (
    <div className={`controll-panel ${isLogs ? "controll-panel_w700" : ""}`}>
      <PopupFilter tabsNames={tabsNames} />
      <div className="controll-panel__search">
        <Search />
      </div>
      {buttons}
    </div>
  );
};

export default ControllPanel;
