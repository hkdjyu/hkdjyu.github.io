import React from 'react';
import ProjectItem from '../Components/ProjectItem';
import '../Styles/Projects.css';
import { ProjectList } from '../UserData/ProjectList'; 
import { motion } from 'framer-motion';

function Projects() {
  return (
    <motion.div 
      className="projects"
      initial={{width: 0}}
      animate={{width: window.innerWidth}}
      exit={{x: window.innerWidth, trasition: {duration: 0.1}}}
    >
      <div className="projectsHeader">
        <h1>Projects</h1>
      </div>
      <div className="projectList">
        {ProjectList.map((project, index) => {
          return ( <ProjectItem 
                      id = {index} 
                      name={project.name} 
                      image={project.image} 
                      date={project.date} 
                      description={project.description}
                      /> );
        })}
      </div>
    </motion.div>
  );
}

export default Projects;
