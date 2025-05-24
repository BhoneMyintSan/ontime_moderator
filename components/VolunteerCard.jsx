import { FiUsers, FiMoreVertical, FiCalendar } from "react-icons/fi";


const VolunteerCard = ({ data, onViewDetails }) => {
  const statusStyle =
    data.status === "Open"
      ? "bg-green-600"
      : "bg-red-500";

  return (
    <div className="bg-[#23233a] p-4 sm:p-5 rounded-2xl shadow-lg flex flex-col min-w-[220px] sm:min-w-[300px] relative">
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-base sm:text-lg font-bold text-white">{data.title}</h2>

        <span className={`text-xs px-3 py-1 rounded-full text-white font-semibold ${statusStyle}`}>
          {data.status}
        </span>
      </div>

      <div className="flex items-center text-gray-300 text-xs sm:text-sm mb-1">
        <FiUsers className="mr-2" />
        {data.applicants} Applicants
      </div>
      <div className="flex items-center text-gray-300 text-xs sm:text-sm mb-4">

        <FiCalendar className="mr-2" />
        {data.dateRange}
      </div>
      <div className="flex items-center gap-2 mt-auto">

        <button
          className="bg-[#6366f1] hover:bg-[#4f46e5] w-full py-2 rounded-lg text-white font-medium shadow transition text-xs sm:text-base"
          onClick={onViewDetails}
        >

          View Details
        </button>
        <button className="ml-2 p-2 rounded-full hover:bg-[#29294d] text-gray-400">
          <FiMoreVertical size={20} />
        </button>
      </div>
    </div>
  );
};

export default VolunteerCard;