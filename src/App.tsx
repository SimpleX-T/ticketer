import React, {
  ChangeEvent,
  ChangeEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { TicketType, UserTicketData } from "./types";
import Barcode from "react-barcode";
import { FaCloudArrowUp } from "react-icons/fa6";
import { CgMail } from "react-icons/cg";
import { BiCalendar } from "react-icons/bi";
import { toPng } from "html-to-image";

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

const TicketingApp: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [ticketData, setTicketData] = useState<UserTicketData>({
    name: "",
    email: "",
    ticketType: null,
    ticketCount: 1,
    profileImage: null,
    specialRequest: "",
    ticketId: "",
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
    <div className="select-none min-h-screen relative bg-[#02191D] overflow-hidden w-full flex items-center justify-center">
      <div className="absolute w-full max-w-7xl rounded-full h-52 bg-[#0E464F] blur-[80px] bottom-0 translate-y-1/2" />

      <nav className="px-4 py-2 flex z-50 justify-between items-center bg-[#05252C]/40 border border-[#197686] fixed top-4 max-w-6xl mx-auto w-full rounded-full backdrop-blur-md">
        <div className="text-2xl font-bold text-white">
          <img src="./logo.svg" alt="logo" />
        </div>
        <button className="bg-white text-teal-950 px-3 py-1 rounded-full">
          MY TICKETS →
        </button>
      </nav>

      <section className="min-h-screen w-full py-32 relative">
        <main className="max-w-2xl mx-auto p-6 bg-[#041E23] border border-[#0E464F]/40 rounded-xl h-full ">
          <div>
            <div className="flex justify-between items-center mb-2 w-full">
              <h2 className="text-3xl font-normal text-white font-serif">
                {stepTitle}
              </h2>
              <p className="text-white text-xs">Step {step}/3</p>
            </div>
            <div className="w-full flex h-1 bg-[#0E464F] mb-8 rounded-full overflow-hidden justify-between items-center">
              <div
                className="h-full bg-[#24A0B5] transition-all duration-300"
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
                    name: "",
                    email: "",
                    ticketType: null,
                    ticketCount: 1,
                    profileImage: null,
                    specialRequest: "",
                    ticketId: "",
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
};

interface TicketSelectionProps {
  ticketTypes: TicketType[];
  selectedTicket: TicketType | null;
  onSelectTicket: (ticket: TicketType) => void;
  onNext: () => void;
  ticketCount: number;
  onChangeTicketCount: ChangeEventHandler<HTMLSelectElement>;
}

const TicketSelection: React.FC<TicketSelectionProps> = ({
  ticketTypes,
  selectedTicket,
  onSelectTicket,
  onNext,
  ticketCount,
  onChangeTicketCount,
}) => {
  return (
    <div className="bg-[#08252B] border border-[#07373F] rounded-xl p-8">
      <div className="bg-gradient-to-br from-[#07373F] via-transparent to-transparent border-2 border-[#07373F] p-3 rounded-2xl mb-8 text-center">
        <h2 className="text-6xl font-bold text-white mb-2 font-[Road_Rage]">
          Techember Fest "25
        </h2>
        <p className="text-md text-white">
          Join us for an unforgettable experience at Techember Fest! Secure your
          spot now.
        </p>
        <p className="text-xs text-center w-full justify-center text-gray-300 flex flex-wrap gap-2 mt-1">
          <span className="inline">
            📍 123 Techember Street, Techville, Techland
          </span>
          ||
          <span>March 15, 2025 | 7:00 PM</span>
        </p>
      </div>

      <hr className="border-2 border-[#07373F] mb-8" />

      <div>
        <h3 className="text-md font-serif text-white mb-2">
          Select Ticket Type
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 w-full bg-[#052228] rounded-xl border border-[#07373F] p-2">
          {ticketTypes.map((ticket) => (
            <button
              key={ticket.id}
              onClick={() => onSelectTicket(ticket)}
              className={`
              p-6 rounded-lg transition-colors border border-[#197686] transition-colors duration-300 cursor-pointer
              ${
                selectedTicket?.id === ticket.id
                  ? "bg-[#12464E]"
                  : "bg-transparent hover:bg-[#12464E]/20"
              }
            `}
            >
              <div className="text-white font-bold">{ticket.price}</div>
              <div className="text-white text-sm">{ticket.name}</div>
              <div className="text-teal-300 text-xs">
                {ticket.available}/{ticket.total}
              </div>
            </button>
          ))}
        </div>
      </div>

      <select
        value={ticketCount}
        onChange={onChangeTicketCount}
        className="w-full px-4 py-2 border border-[#07373F] rounded-md text-white mb-4"
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
      </select>

      <div className="flex items-center justify-between gap-4">
        <button className="w-1/2 py-2 text-white cursor-pointer border border-[#24A0B5] rounded-md">
          Cancel
        </button>

        <button
          onClick={onNext}
          disabled={!selectedTicket || !ticketCount}
          className="w-1/2 py-2 bg-[#24A0B5] cursor-pointer text-white rounded-md transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#24A0B5]/80"
        >
          Next
        </button>
      </div>
    </div>
  );
};

interface AttendeeFormProps {
  ticketData: UserTicketData;
  setTicketData: React.Dispatch<React.SetStateAction<UserTicketData>>;
  onBack: () => void;
  onSubmit: () => void;
}

const AttendeeForm: React.FC<AttendeeFormProps> = ({
  ticketData,
  setTicketData,
  onBack,
  onSubmit,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTicketData({
          ...ticketData,
          profileImage: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!ticketData.name) newErrors.name = "Name is required";
    if (!ticketData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(ticketData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!ticketData.profileImage) newErrors.image = "Profile image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit();
    }
  };

  return (
    <div className="bg-[#08252B] border border-[#07373F] rounded-xl p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-white font-serif mb-4">Upload profile photo</h3>

          <div className="w-full p-4 flex items-center justify-center bg-black/20">
            <div
              onClick={() => document.getElementById("image-upload")?.click()}
              className="border-[4px] border-[#24A0B5]/50 bg-[#0E464F] rounded-lg flex items-center justify-center text-center cursor-pointer hover:bg-teal-800/50 w-40 aspect-square"
            >
              {ticketData.profileImage ? (
                <img
                  src={ticketData.profileImage}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-sm px-2 text-white flex items-center justify-center gap-4 flex-col">
                  <FaCloudArrowUp size={24} />
                  Drag & drop or click to upload
                </div>
              )}
            </div>
          </div>

          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          {errors.image && (
            <div className="text-red-500 text-xs mt-1">{errors.image}</div>
          )}
        </div>

        <hr className="border-2 border-[#07373F] my-8" />

        <div>
          <label
            htmlFor="name"
            className="font-serif text-white text-sm mb-2 block"
          >
            Enter your name
          </label>
          <input
            type="text"
            id="name"
            value={ticketData.name}
            onChange={(e) =>
              setTicketData({ ...ticketData, name: e.target.value })
            }
            className="w-full bg-transparent text-white border border-[#07373F] rounded-md p-2 focus:outline-none"
          />
          {errors.name && (
            <div className="text-red-500 text-xs">{errors.name}</div>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="font-serif text-white text-sm mb-2 block"
          >
            Enter your email
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              value={ticketData.email}
              onChange={(e) =>
                setTicketData({ ...ticketData, email: e.target.value })
              }
              className="w-full bg-transparent text-white border border-[#07373F] rounded-md p-2 focus:outline-none pl-10"
            />
            <CgMail
              size={24}
              color="white"
              className="absolute left-2 bottom-1/2 transform translate-y-1/2"
            />
          </div>
          {errors.email && (
            <div className="text-red-500 text-xs">{errors.email}</div>
          )}
        </div>

        <div>
          <label
            htmlFor="special-request"
            className="font-serif text-white text-sm mb-2 block"
          >
            Special request?
          </label>

          <textarea
            id="special-request"
            value={ticketData.specialRequest}
            onChange={(e) =>
              setTicketData({ ...ticketData, specialRequest: e.target.value })
            }
            className="w-full bg-transparent resize-none text-white border border-[#07373F] rounded-md p-2 focus:outline-none"
            rows={3}
          />
        </div>

        <div className="flex justify-between items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="w-1/2 py-2 text-white cursor-pointer border border-[#24A0B5] rounded-md"
          >
            Back
          </button>

          <button
            type="submit"
            className="w-1/2 py-2 bg-[#24A0B5] cursor-pointer text-white rounded-md transition-colors duration-300 hover:bg-[#24A0B5]/80"
          >
            Get My Ticket
          </button>
        </div>
      </form>
    </div>
  );
};

interface GeneratedTicketProps {
  ticketData: UserTicketData;
  onBookAnother: () => void;
}

const GeneratedTicket: React.FC<GeneratedTicketProps> = ({
  ticketData,
  onBookAnother,
}) => {
  const ticketRef = useRef<HTMLDivElement>(null);

  const onDownloadTicket = async () => {
    console.log(ticketRef.current);

    if (ticketRef.current === null) return;
    toPng(ticketRef.current, { quality: 1.0, pixelRatio: 3 }).then(
      (dataUrl) => {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `${ticketData.name}-${ticketData.ticketId}.png`;
        link.click();
      }
    );
  };

  return (
    <div className="bg-[#08252B] border border-[#07373F] rounded-xl p-4">
      <div className="w-full text-center mb-6">
        <h3 className="text-white text-xl font-bold mb-2">
          Your Ticket is Booked!
        </h3>
        <p className="text-white text-xs">
          Check your email for a copy or you can{" "}
          <button
            className="font-semibold cursor-pointer text-sm"
            onClick={onDownloadTicket}
          >
            download
          </button>
        </p>
      </div>

      <div
        className="p-6 mb-8 w-full ticket max-w-[400px] mx-auto"
        ref={ticketRef}
      >
        <div className="border border-[#24A0B5] w-full rounded-xl p-4">
          <div className="mb-6 text-center">
            <h2 className="text-5xl font-semibold font-[Road_Rage] text-white mb-2">
              Techember Fest '25
            </h2>
            <address className="text-white text-xs not-italic">
              📍 04 Rumens road, Ikoyi, Lagos
            </address>
            <p className="text-white text-xs">
              <BiCalendar className="inline-block mr-2" /> March 15, 2025 | 7:00
              PM
            </p>
          </div>

          <div className="flex items-center gap-6 mb-6 flex items-center justify-center w-48 h-48 rounded-xl overflow-hidden border-[4px] mx-auto border-[#24A0B5]">
            {ticketData.profileImage && (
              <img
                src={ticketData.profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div className="bg-[#08343C] rounded-lg p-2 mb-2">
            <div className="grid grid-cols-2 text-white mb-4">
              <div className="border border-t-transparent border-l-transparent border-gray-500 py-1 pr-2">
                <span className="text-xs py-2 text-gray-500 mb-1">Name</span>
                <p className="text-xs">{ticketData.name}</p>
              </div>

              <div className="border-b border-gray-500 py-1 pl-2">
                <span className="text-xs py-2 text-gray-500 mb-1">Email</span>
                <p className="text-xs truncate">{ticketData.email}</p>
              </div>

              <div className="border-r border-b border-gray-500 py-1 pr-2">
                <span className="text-xs py-2 text-gray-500">Ticket Type</span>
                <p className="text-xs truncate">
                  {ticketData.ticketType?.type}
                </p>
              </div>

              <div className="border-b border-gray-500 py-1 pl-2">
                <span className="text-xs text-gray-500 py-2">Ticket for</span>
                <p className="text-xs truncate">{ticketData.ticketCount}</p>
              </div>
            </div>

            {ticketData.specialRequest && (
              <div>
                <span className="text-xs text-gray-500 py-2">
                  Special Request
                </span>
                <p className="text-xs text-white">
                  {ticketData.specialRequest}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center">
          <Barcode
            value={ticketData.ticketId}
            height={50}
            width={1}
            displayValue={true}
            background=""
            lineColor="#ffffff"
            fontSize={14}
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBookAnother}
          className="w-1/2 py-2 text-white cursor-pointer border border-[#24A0B5] rounded-md"
        >
          Book Another Ticket
        </button>

        <button
          onClick={onDownloadTicket}
          className="w-1/2 py-2 bg-[#24A0B5] cursor-pointer text-white rounded-md transition-colors duration-300 hover:bg-[#24A0B5]/80"
        >
          Download Ticket
        </button>
      </div>
    </div>
  );
};

export default TicketingApp;
