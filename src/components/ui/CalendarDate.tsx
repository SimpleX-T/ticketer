export const CalendarDate = ({ date }: { date: string }) => {
  const eventDate = new Date(date);
  const month = eventDate
    .toLocaleString("en-US", { month: "short" })
    .toUpperCase();
  const day = eventDate.getDate();

  return (
    <div className="flex flex-col items-center overflow-hidden w-12 h-14 rounded-md shadow-md border border-secondary">
      <span className="text-[10px] font-bold bg-primary-200 flex items-center justify-center w-full h-4 py-2">
        {month}
      </span>
      <span className="text-lg font-bold">{day}</span>
    </div>
  );
};
