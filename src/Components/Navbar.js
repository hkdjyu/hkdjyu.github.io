import React from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import "../Styles/Navbar.css";
import MenuIcon from "@material-ui/icons/Reorder";
import DarkMode from "./DarkMode";
import GoBack from "./GoBack";


function Navbar() {

  // Handle menu button
  const [expandNavbar, setExpandNavbar] = React.useState(false);
  const location = useLocation();
  React.useEffect(() => {
      setExpandNavbar(false)
  }, [location]);


  // navigate to current home page using use Navigate
  const navigate = useNavigate();
  const goToContact = () => {
      navigate("/");
      // wait 0.5s and scroll smoothly to bottom
      setTimeout(() => {
          window.scrollTo({
              top: document.body.scrollHeight,
              left: 0,
              behavior: "smooth",
          });
      }
      , 750); 
  };

  const goToHome = () => {
      navigate("/");
      // wait 0.5s and scroll smoothly to top
      setTimeout(() => {
          window.scrollTo({
              top: 0,
              left: 0,
              behavior: "smooth",
          });
      }
      , 500); 
  };



  return (
    <div className="navbar"id={expandNavbar ? "open" : "close"}>
      <div className="left">
        <GoBack />
      </div>
      <div className="middle">
        <div className="link">
          <button onClick={goToHome}> Home </button>
        </div>
        <div className="link">
          <Link to={"/Projects"}> Projects </Link>
        </div>
        <div className="link">
          <Link to={"/Experience"}> Experience </Link>
        </div>
        <div className="link">
          <button onClick={goToContact}> Contact </button>
        </div>
          
      </div>
      <div className="right">
        <DarkMode />
        <div className="dropdownButton">
          <button 
              onClick={() =>{
                  setExpandNavbar((prev) => !prev)
              }}
          > 
              <MenuIcon /> 
          </button>
        </div>
      </div>
      
    </div>
  );
}

export default Navbar;
