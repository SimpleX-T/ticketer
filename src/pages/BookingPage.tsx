import Booking from "../components/bookings";

export default function BookingPage() {
  return <Booking />;
}

const EventDescription = ({
  event,
  withTitle,
}: {
  event: Event;
  withTitle?: boolean;
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  return (
    <div>
      {withTitle && (
        <h2 className="text-lg font-bold mb-2 text-secondary">Description</h2>
      )}

      <p
        className={`text-secondary-100 text-sm ${
          isCollapsed ? "line-clamp-1" : ""
        }`}
      >
        {event.description}
      </p>
      <button
        onClick={toggleCollapse}
        className="text-secondary text-xs flex items-center gap-1"
      >
        {isCollapsed ? (
          <>
            <span>Read more</span>
          </>
        ) : (
          <>
            <span>Read less</span>
          </>
        )}
      </button>
    </div>
  );
};
