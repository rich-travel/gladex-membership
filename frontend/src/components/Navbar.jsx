import { useEffect, useState } from "react";
import { CiLogin } from "react-icons/ci";
import { PiUserLight } from "react-icons/pi";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAuthStore from "../stores/authStore";
import useLoginModalStore from "../stores/loginModalStore";
import useRegisterModalStore from "../stores/registerModalStore";

export default function Navbar() {
  const navigate = useNavigate();
  const handleLoginModal = useLoginModalStore(
    (state) => state.handleLoginModal
  );
  const handleRegisterModal = useRegisterModalStore(
    (state) => state.handleRegisterModal
  );
  const logout = useAuthStore((state) => state.logout);
  const fetchUserInfo = useAuthStore((state) => state.fetchUserInfo);

  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  const handleDropDown = () => {
    setIsDropDownOpen(!isDropDownOpen);
  };

  const { user } = useAuthStore();
  const {userInfo} = useAuthStore();

  useEffect(() => {
    if (user?.membershipId) {
      fetchUserInfo(user?.membershipId);
    }
  }, [user, fetchUserInfo]);

  const adminDropDown = [
    {
      title: "Dashboard",
      link: "/dashboard",
    },
    {
      title: "Profile",
      link: "/profile",
    },
  ];

  const userDropDown = [
    {
      title: "Profile",
      link: "/profile",
    },
    {
      title: "Membership Card",
      link: "/membership-card",
    },
    {
      title: "Membership Program",
      link: "/membership-program",
    },
  ];

  const dropDownMenus = user?.isAdmin ? [...adminDropDown] : [...userDropDown];

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate("/");
      }
    });
  };

  return (
    <header className="fixed-nav-bar w-nav shadow-lg">
      <nav className="max-w-screen-2xl mx-auto px-4 flex justify-between items-center">
        <ul className="nav__links">
          <li className="link">
            <Link to={"/"}>Home</Link>
          </li>
          <li className="link">
            <Link to={"/membership-card"}>Membership Card</Link>
          </li>
          <li className="link">
            <Link to={"/membership-program"}>Membership Program</Link>
          </li>
        </ul>

        <div className="nav__logo">
          <Link to={"/"}>
            Gladex<span>.</span>
          </Link>
        </div>

        <div className="nav__icons relative">
          {(!user || user === null) && (
            <>
              <span
                className="cursor-pointer text-2xl"
                onClick={handleLoginModal}
              >
                <CiLogin />
              </span>
              <span
                className="cursor-pointer text-2xl"
                onClick={handleRegisterModal}
              >
                <PiUserLight />
              </span>
            </>
          )}
          {user && (
            <>
              <span className="cursor-pointer" onClick={handleDropDown}>
                <img
                  className="w-8 h-8 rounded-full"
                  src={`/avatar/${userInfo?.userProfile}.png`}
                  alt="icon"
                />
                {isDropDownOpen && (
                  <div className="absolute right-0 mt-3 p-4 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-40">
                    <ul className="font-medium space-y-4 p-2">
                      {dropDownMenus.map((item, index) => (
                        <li key={index}>
                          <Link
                            onClick={() => setIsDropDownOpen(false)}
                            className="dropdown-items"
                            to={item.link}
                          >
                            {item.title}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <button
                          onClick={handleLogout}
                          className="dropdown-items"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </span>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
