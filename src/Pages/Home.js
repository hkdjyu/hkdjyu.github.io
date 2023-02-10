import React from 'react';
import InstagramIcon from "@material-ui/icons/Instagram";
import GitHubIcon from "@material-ui/icons/GitHub";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import "../Styles/Home.css";

function Home() {
  return (
    <div className="home">
      <div className="about">
        <h2> Thomas NG </h2>
        <div className="prompt"> <p>
          A year 3 computer science student.
          </p> 
          <InstagramIcon/>
          <LinkedInIcon/>
          <GitHubIcon/>
        </div>
      </div>
      <div className="skills">
        <h1>Skills</h1>
        <ol className="list">
          <li className="item">
            <h2> Front-End</h2>
            <span>
              ReactJS, HTML, CSS, JavaScript, Bootstrap, Material-UI
            </span>
          </li>
          <li className="item">
            <h2> Back-End</h2>
            <span>
              NodeJS, ExpressJS, MongoDB, MySQL, Firebase
            </span>
          </li>
          <li className="item">
            <h2> Languages</h2>
            <span>
              Java, C++, Python, C
            </span>
          </li>
        </ol>
      </div>
    </div>
  );
}

export default Home;
