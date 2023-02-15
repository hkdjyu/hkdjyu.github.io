import "../Styles/Contact.css";
import React from "react";
import InstagramIcon from "@material-ui/icons/Instagram";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import GmailIcon from "@material-ui/icons/Mail";
import LocationPic from "../Assets/location.png"


function Contact() {
    const [locationHover, setLocationHover] = React.useState(false);
    return (
        <div className="contact" id="contact">
            <h1>Contact</h1>
            <div className="info">
                <div className="left">
                    <div className="contactInfo">
                        <a href="https://www.instagram.com/thomas_ng_/" target="_blank" rel="noopener noreferrer"> 
                            <InstagramIcon />
                            <div className="contactInfoText">
                                <h3>Instagram</h3>
                                <p>@thomas_ng_</p>
                            </div>
                        </a>
                    </div>
                    <div className="contactInfo">
                        <a href="https://www.linkedin.com/in/yu-chun-thomas-ng" target="_blank" rel="noopener noreferrer"> 
                            <LinkedInIcon /> 
                            <div className="contactInfoText">
                                <h3>LinkedIn</h3>
                                <p>www.linkedin.com/in/yu-chun-thomas-ng</p>
                            </div>
                        </a>
                    </div>
                    <div className="contactInfo">
                        <a href={`mailto:${"thomas.ng.private@gmail.com"}?subject=${encodeURIComponent("") || ''}&body=${encodeURIComponent("body") || ''}`} target="_blank" rel="noopener noreferrer"> 
                            <GmailIcon /> 
                            <div className="contactInfoText">
                                <h3>Mail</h3>
                                <p>thomas.ng.private@gmail.com</p>
                            </div>
                        </a>
                    </div>
                
                </div>
                <div className="right">
                    <a href="https://www.google.com.hk/maps/place/%E5%A4%A7%E5%9C%8D%E6%9D%91/@22.3759603,114.1698498,15z/data=!3m1!4b1!4m5!3m4!1s0x340407a7c2774bf5:0x795ff33937e85cb8!8m2!3d22.375941!4d114.178626?hl=zh-TW" target="_blank" rel="noopener noreferrer"
                    onMouseEnter={() => setLocationHover(true)}
                    onMouseLeave={() => setLocationHover(false)}
                    >
                        <img src={LocationPic}/>
                    </a>   
                     
                </div>
            </div>
        </div>
    );
}
  export default Contact;