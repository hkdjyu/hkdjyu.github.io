import React from "react";
import {Link, useLocation} from "react-router-dom";
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


  return (
    <div className="navbar"id={expandNavbar ? "open" : "close"}>
      <div className="left">
        <GoBack />
      </div>
      <div className="middle">
        <div className="link">
          <Link to={"/"}> Home </Link>
        </div>
        <div className="link">
          <Link to={"/Projects"}> Projects </Link>
        </div>
        <div className="link">
          <Link to={"/Experience"}> Experience </Link>
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
