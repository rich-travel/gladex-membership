import { FaMapMarkerAlt } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { FaPhone } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { AiFillTikTok } from "react-icons/ai";

export default function Footer() {
  const socialLinks = [
    {
      href: "https://www.facebook.com/Gladextravelandtours",
      icon: <FaFacebook style={{ fontSize: "30px" }} />,
      name: "Facebook",
    },
    {
      href: "https://www.instagram.com/gladextours/",
      icon: <FaInstagramSquare style={{ fontSize: "30px" }} />,
      name: "Instagram",
    },
    {
      href: "https://www.tiktok.com/@gladextours?is_from_webapp=1&sender_device=pc&fbclid=IwAR2rPzA4VL-7owyhx82uNTApW2YmdEr2ljQdEVCxTTbkxNWx73v7G4xxtKk",
      icon: <AiFillTikTok style={{ fontSize: "30px" }} />,
      name: "Tiktok",
    },
  ];
  const yearDate = new Date().getFullYear();
  return (
    <>
      <footer className="section__container footer__container">
        <div className="footer__col">
          <h4>Contact Info</h4>
          <p className="flex">
            <span>
              <FaMapMarkerAlt />
            </span>
            5/F SM City Manila 1001 Manila, Philippines
          </p>
          <p className="flex">
            <span>
              <IoIosMail />
            </span>
            support@gladextours.com
          </p>
          <p className="flex">
            <span>
              <FaPhone />
            </span>
            0917 653 1100
          </p>
        </div>
        <div className="footer__col">
          <h4>Follow Us</h4>
          {socialLinks.map((link, index) => (
            <p className="flex" key={index}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <span>{link.icon}</span>
                <div className="ml-2">{link.name}</div>
              </a>
            </p>
          ))}
        </div>
      </footer>
      <div className="footer__bar">
        © {yearDate} Gladex Travel and Tours Corp
      </div>
    </>
  );
}
