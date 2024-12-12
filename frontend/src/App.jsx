import { Outlet } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer";
import ModalLayout from "./components/Modals/ModalLayout";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <ModalLayout />
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
