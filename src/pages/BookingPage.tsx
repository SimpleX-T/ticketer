import { ChangeEvent, useEffect, useState } from "react";
import { TicketSelection } from "../components/bookings/TicketSelection";
import { TicketType, UserTicketData } from "../types";
import { GeneratedTicket } from "../components/bookings/GeneratedTicket";
import { AttendeeForm } from "../components/bookings/AttendeeForm";
import { useParams } from "react-router-dom";

const TICKET_TYPES: TicketType[] = [
  {
    id: 1,
    name: "REGULAR ACCESS",
    price: "Free",
    type: "REGULAR",
    available: 20,
    total: 52,
  },
  {
    id: 2,
    name: "VIP ACCESS",
    price: "$150",
    type: "VIP",
    available: 20,
    total: 52,
  },
  {
    id: 3,
    name: "VVIP ACCESS",
    price: "$150",
    type: "VVIP",
    available: 20,
    total: 52,
  },
];

export default function BookingPage() {
  const x = useParams();
  console.log(x); // log for debugging
  const [step, setStep] = useState<number>(1);
  const [ticketData, setTicketData] = useState<UserTicketData>({
    userName: "",
    userEmail: "",
    ticketType: null,
    ticketCount: 1,
    profileImage: null,
    specialRequest: "",
    ticketId: "",
    eventName: "Event Name",
    eventId: "Event ID",
  });
  const [stepTitle, setStepTitle] = useState<string>("Ticket Selection");

  useEffect(() => {
    switch (step) {
      case 1:
        setStepTitle("Ticket Selection");
        break;
      case 2:
        setStepTitle("Attendee Details");
        break;
      case 3:
        setStepTitle("Ready!");
        break;
    }
  }, [step]);

  const generateTicketId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  return (
    <div className="select-none min-h-screen relative bg-primary overflow-hidden w-full flex items-center justify-center">
      <div className="absolute w-full max-w-7xl rounded-full h-52 bg-primary-100 blur-[80px] bottom-0 translate-y-1/2" />

      <section className="min-h-screen w-full py-32 relative">
        <main className="max-w-2xl mx-auto p-6 bg-primary-200 border border-primary-100/40 rounded-xl h-full ">
          <div>
            <div className="flex justify-between items-center mb-2 w-full">
              <h2 className="text-3xl font-normal text-white font-serif">
                {stepTitle}
              </h2>
              <p className="text-white text-xs">Step {step}/3</p>
            </div>
            <div className="w-full flex h-1 bg-primary-100 mb-8 rounded-full overflow-hidden justify-between items-center">
              <div
                className="h-full bg-secondary transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>

            {step === 1 && (
              <TicketSelection
                ticketTypes={TICKET_TYPES}
                selectedTicket={ticketData.ticketType}
                onSelectTicket={(ticket: TicketType) =>
                  setTicketData({ ...ticketData, ticketType: ticket })
                }
                onNext={() => setStep(2)}
                ticketCount={ticketData.ticketCount}
                onChangeTicketCount={(e: ChangeEvent<HTMLSelectElement>) =>
                  setTicketData({
                    ...ticketData,
                    ticketCount: Number(e.target.value),
                  })
                }
              />
            )}

            {step === 2 && (
              <AttendeeForm
                ticketData={ticketData}
                setTicketData={setTicketData}
                onBack={() => setStep(1)}
                onSubmit={() => {
                  setTicketData({
                    ...ticketData,
                    ticketId: generateTicketId(),
                  });
                  setStep(3);
                }}
              />
            )}

            {step === 3 && (
              <GeneratedTicket
                ticketData={ticketData}
                onBookAnother={() => {
                  setTicketData({
                    userName: "",
                    userEmail: "",
                    ticketType: null,
                    ticketCount: 1,
                    profileImage: null,
                    specialRequest: "",
                    ticketId: "",
                    eventId: "",
                    eventName: "",
                  });
                  setStep(1);
                }}
              />
            )}
          </div>
        </main>
      </section>
    </div>
  );
}
