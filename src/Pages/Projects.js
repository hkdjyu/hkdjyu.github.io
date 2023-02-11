import React from 'react';
import ProjectItem from '../Components/ProjectItem';
import '../Styles/Projects.css';
import { ProjectList } from '../UserData/ProjectList'; 

function Projects() {
  return (
    <div className="projects">
      <h1>My Projects</h1>
      <div className="projectList">
        {ProjectList.map((project, index) => {
          return ( <ProjectItem id = {index} name={project.name} image={project.image} date={project.date}/> );
        })}
      </div>
    </div>
  );
}

export default Projects;
