import React, { useState } from 'react';
import { format, } from 'date-fns'
import CalenderPresentational from './calender-presentational';

const CalenderFunctional = ({}) => {
    const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"))
    return <CalenderPresentational {...{ selectedDate, setSelectedDate }} />;
};

export default CalenderFunctional;
