import { useState } from "react";

const DatePicker = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const getNextMonth = () => {
    const nextDate = new Date(currentDate);
    nextDate.setMonth(nextDate.getMonth() + 1);
    setCurrentDate(nextDate);
  };

  const getPrevMonth = () => {
    const prevDate = new Date(currentDate);
    prevDate.setMonth(prevDate.getMonth() - 1);
    setCurrentDate(prevDate);
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = endOfMonth.getDate();

    const weeks = [];
    let week = [];
    let day = new Date(startOfMonth);

    // Add empty cells for the days before the start of the month
    // add empty cells for the days before the start of the year (if the week starts on a sunday)
    if (startOfMonth.getDay() === 0) {
      for (let i = 0; i < 6; i++) {
        week.push(<div key={`empty-${i}`} className="flex-1 h-10"></div>);
      }
    } else {
      for (let i = 0; i < startOfMonth.getDay() - 1; i++) {
        week.push(<div key={`empty-${i}`} className="flex-1 h-10"></div>);
      }
    }

    // Render the days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const weekday = new Date(year, month, i).toLocaleDateString('en-US', { weekday: 'short' });
      week.push(
        <div key={`day-${i}`} className="flex-1 flex flex-col items-center">
          <div className="text-xs text-gray-500">{weekday}</div>
          <div className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-zinc-300 select-none">
            {i}
          </div>
        </div>
      );

      // Start a new week when reaching the end of the current week
      if (day.getDay() === 0) {
        weeks.push(<div key={`week-${day}`} className="flex">{week}</div>);
        week = [];
      }

      day.setDate(day.getDate() + 1);
    }

    // Add empty cells for the days after the end of the month
    // add empty cells for the days after the end of the year (if the week ends on a sunday)

    if (endOfMonth.getDay() !== 0) {
      for (let i = endOfMonth.getDay(); i < 7; i++) {
        week.push(
          <div key={`empty-${i}`} className="flex-1 h-10"></div>
        );
      }
    } else {
      for (let i = 0; i < 6; i++) {
        week.push(<div key={`empty-${i}`} className="flex-1 h-10"></div>);
      }
    }

    weeks.push(<div key={`week-${day}`} className="flex">{week}</div>);

    return weeks;
  };

  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="max-w-md mx-auto">
      <div className="flex justify-between mb-4">
        <button className="px-2 py-1 bg-blue-500 text-white rounded" onClick={getPrevMonth}>
          Previous Month
        </button>
        <div className="text-lg text-white">{monthYear}</div>
        <button className="px-2 py-1 bg-blue-500 text-white rounded" onClick={getNextMonth}>
          Next Month
        </button>
      </div>
      <div className="bg-gray-200 p-4">
        <div className="flex mb-2">
          <div className="flex-1 text-center">Mon</div>
          <div className="flex-1 text-center">Tue</div>
          <div className="flex-1 text-center">Wed</div>
          <div className="flex-1 text-center">Thu</div>
          <div className="flex-1 text-center">Fri</div>
          <div className="flex-1 text-center">Sat</div>
          <div className="flex-1 text-center">Sun</div>
        </div>
        {renderCalendar()}
      </div>
    </div>
  );
};

export default DatePicker
