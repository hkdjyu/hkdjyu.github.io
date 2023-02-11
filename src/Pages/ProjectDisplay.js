import React from "react";
import { useParams } from "react-router-dom";
import { ProjectList } from "../Helpers/ProjectList";
import GitHubIcon from "@material-ui/icons/GitHub";
import "../Styles/ProjectDisplay.css";

function ProjectDisplay() {

    const { id } = useParams();
    const project = ProjectList[id];
    const projectLink = ProjectList[id].link;
    var linkTest = "";
    if(projectLink != null) {
        linkTest = "Project Details: "
    }

    return (
        <div className="project">
            <h1> {project.name} </h1>
            <img src={project.image} />
            <div className="description">
                <p> 
                    {project.description} 
                </p>
            </div>
            <div className="details">
                <h2>{linkTest}</h2> 
                <a href={projectLink}>{projectLink}</a>
            </div>
            
        </div>
    );
}

export default ProjectDisplay;
