import "./popup-filter.sass";
import Button from "../../ui/button/button";
import { useState } from "react";

const PopupFilter = ({ tabsNames }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="popup-filter">
      <Button
        color={isOpen ? "blue" : ""}
        onClick={() => setIsOpen((state) => !state)}
        classNames={["button_w215"]}
      >
        Search by {tabsNames[activeTab].toLowerCase()}
      </Button>
      <div
        className={`popup-filter__wrapper ${isOpen ? "popup-filter_open" : ""}`}
      >
        {tabsNames.map((item, id) => {
          return (
            <button
              className={`popup-filter__tab ${
                activeTab === id ? "popup-filter_active" : ""
              }`}
              onClick={() => {
                setActiveTab(id);
                setIsOpen(false);
              }}
              key={id}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PopupFilter;
