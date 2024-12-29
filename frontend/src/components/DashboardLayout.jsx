import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { IoChevronBack } from "react-icons/io5";

export default function DashboardLayout({ title }) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="dashboard-layout relative">
      <div
        onClick={handleBack}
        className="inline-flex justify-between items-center dashboard-back cursor-pointer mt-1"
      >
        <IoChevronBack /> <span>Back</span>
      </div>
      <div className="font-bold dashboard-title">{title}</div>
    </div>
  );
}

DashboardLayout.propTypes = {
  title: PropTypes.string.isRequired,
};
