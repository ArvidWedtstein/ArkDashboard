import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { toISODate } from "src/lib/formatters";

type DateContextValue = [string, (date: string | Date) => void, () => void];
let DateContext = createContext<DateContextValue>(["2021-07-09", () => null, () => null]);

let today = new Date();
export function DateProvider({ children }: { children: React.ReactNode | React.ReactNode[] }) {
  let [calOpen, setCalOpen] = useState<boolean>(false);
  let [date, setDate] = useState(() => toISODate(today));

  let handleDateChange = useCallback(function handleDateChange(date) {
    if (typeof date === "string") {
      setDate(date);
    } else {
      let isoDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
        date.getDate(),
      ).padStart(2, "0")}`;
      setDate(isoDate);
    }
    setCalOpen(false);
  }, []);

  let value = useMemo<DateContextValue>(
    () => [
      date,
      handleDateChange,
      function selectDate() {
        setCalOpen(true);
      },
    ],
    [date, handleDateChange],
  );

  return (
    <DateContext.Provider value={value}>
      {children}

    </DateContext.Provider>
  )
}

export function useDate() {
  return useContext(DateContext);
}