import "./date-picker-custom.sass";
import "react-datepicker/src/stylesheets/datepicker.scss"
import date from "../../assets/icons/date.png";

import Button from "../../ui/button/button";
import { useState } from "react";
import DatePicker from "react-datepicker";

const DatePickerCustom = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const popupClass = `date-picker-custom__popup ${isOpen? "date-picker-custom_open": ""}`;

  return (
    <div className="date-picker-custom">
      <Button 
        onClick={() => setIsOpen(status => !status)}
        color={isOpen? "blue": ""}
      >
        <img src={date} alt="date" className="button__img" />
      </Button>
      <div className={popupClass}>
        <DatePicker
          selected={startDate}
          onChange={onChange}
          startDate={startDate}
          maxDate={new Date()}
          endDate={endDate}
          selectsRange
          inline
        />
      </div>
    </div>
  );
};

export default DatePickerCustom;
