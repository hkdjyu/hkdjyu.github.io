import React from 'react';
import Link from "@material-ui/core/Link";
import InstagramIcon from "@material-ui/icons/Instagram";
import GitHubIcon from "@material-ui/icons/GitHub";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import GmailIcon from "@material-ui/icons/Mail";
import ItchIcon from "@material-ui/icons/SportsEsports"
import propic from "../Assets/propic.jpg";
import "../Styles/Home.css";
import {motion} from "framer-motion";

function Home() {
  return (
    <motion.div 
      className="home"
      initial={{width: 0}}
      animate={{width: "100%"}}
      exit={{x: window.innerWidth, trasition: {duration: 0.01}}}
    >
      <div className="about">
        <div className="propic"><
          img src={propic} alt="Profile Picture" />
        </div>
        <h2> Thomas NG </h2>
        <div className="prompt"> 
          <p>
            A year 3 computer science student.
          </p> 
          <Link href="https://www.instagram.com/thomas_ng_/" target="_blank" rel="noopener noreferrer"> <InstagramIcon /> </Link>
          <Link href="https://github.com/hkdjyu" target="_blank" rel="noopener noreferrer"> <GitHubIcon /> </Link>
          <Link href="https://www.linkedin.com/in/yu-chun-thomas-ng" target="_blank" rel="noopener noreferrer"> <LinkedInIcon /> </Link>
          <Link href="https://itch.io/profile/locothomas" target="_blank" rel="noopener noreferrer"> <ItchIcon /> </Link>
          <Link href={`mailto:${"thomas.ng.private@gmail.com"}?subject=${encodeURIComponent("") || ''}&body=${encodeURIComponent("body") || ''}`} target="_blank" rel="noopener noreferrer"> <GmailIcon /> </Link>
        </div>
      </div>
      <div className="skills">
        <h1>Technical Skills</h1>
        <ol className="list">
          <li className="item">
            <h2> Game Development </h2>
            <span>
              Unity Engine, Unreal Engine, Decentraland SDK, OpenGL, GLFW, GLEW, GLM
            </span>
          </li>
          <li className="item">
            <h2> Programming Languages </h2>
            <span>
              C, C++, C#, Java, Python, TypeScript, JavaScript, HTML, CSS, GLSL, RISC-V Assembly
            </span>
          </li>
          <li className="item">
            <h2> Media Editing </h2>
            <span>
              Photoshop, Illustrator, Lightroom, Aseprite, Audacity, Davinci Resolve
            </span>
          </li>
        </ol>
      </div>
      <hr class="roundedDivLine" />
      <div className="hobbies">
        <h1>Hobbies</h1>
        <ol className="list">
        <li className="item">
            <h2> Sports </h2>
            <span>
              Volleyball, Basketball, Hiking, Camping
            </span>
          </li>
          <li className="item">
            <h2> Music </h2>
            <span>
              Guitar, Piano, Canto-Pop
            </span>
          </li>
          <li className="item">
            <h2> Games </h2>
            <span>
              League of Legends, Squad, Velheim, Cities: Skylines
            </span>
          </li>
        </ol>
      </div>
    </motion.div>
  );
}

export default Home;
