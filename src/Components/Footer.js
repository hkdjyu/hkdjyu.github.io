import React from "react";
import Link from "@material-ui/core/Link";
import InstagramIcon from "@material-ui/icons/Instagram";
import GitHubIcon from "@material-ui/icons/GitHub";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import GmailIcon from "@material-ui/icons/Mail";
import ItchIcon from "@material-ui/icons/SportsEsports";
import "../Styles/Footer.css";

function Footer() {
  return (
    <div className="footer">
        <div className="socialMedia">
            <Link href="https://www.instagram.com/thomas_ng_/" target="_blank" rel="noopener noreferrer"> <InstagramIcon /> </Link>
            <Link href="https://github.com/hkdjyu" target="_blank" rel="noopener noreferrer"> <GitHubIcon /> </Link>
            <Link href="https://www.linkedin.com/in/yu-chun-thomas-ng" target="_blank" rel="noopener noreferrer"> <LinkedInIcon /> </Link>
            <Link href="https://itch.io/profile/locothomas" target="_blank" rel="noopener noreferrer"> <ItchIcon /> </Link>
            <Link href={`mailto:${"thomas.ng.private@gmail.com"}?subject=${encodeURIComponent("") || ''}&body=${encodeURIComponent("body") || ''}`} target="_blank" rel="noopener noreferrer"> <GmailIcon /> </Link>
        </div>
        <p> Contact: thomas.ng.private@gmail.com | Location: Hong Kong</p>
        <p> &copy; 2023 hkdjyu.github.io</p>
    </div>
  );
}

export default Footer;