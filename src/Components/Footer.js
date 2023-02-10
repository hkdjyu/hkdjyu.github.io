import React from "react";
import InstagramIcon from "@material-ui/icons/Instagram";
import GitHubIcon from "@material-ui/icons/GitHub";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import "../Styles/Footer.css";

function Footer() {
  return (
    <div className="footer">
        <div className="socialMedia">
            <InstagramIcon />
            <GitHubIcon />
            <LinkedInIcon />
        </div>
        <p> Contact: thomas.ng.private@gmail.com </p>
    </div>
  );
}

export default Footer;