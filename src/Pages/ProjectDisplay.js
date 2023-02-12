import React from "react";
import { useParams } from "react-router-dom";
import { ProjectList } from "../UserData/ProjectList";
import GitHubIcon from "@material-ui/icons/GitHub";
import "../Styles/ProjectDisplay.css";

function ProjectDisplay() {

    const { id } = useParams();
    const project = ProjectList[id];
    const projectLink = ProjectList[id].link;

    return (
        <div className="project">
            <div className="heading">
                <h1> {project.name} </h1>
                <p> {project.date} </p>
                <img src={project.image} />
            </div>
            <div className="description">
                <p> 
                    {project.description} 
                </p>
            </div>
            <div className="details">
                {project.details != null && 
                    <h2>Project Details</h2> 
                }
                {project.link != null && 
                    <p>
                        Link: <a href={projectLink} target="_blank" rel="noopener noreferrer">{projectLink}</a>
                    </p>
                }
                <p>{project.details}</p>
            </div>
            <div className="photos">
                {ProjectList[id].photos != null && 
                    <h2>Snapshots</h2> 
                }
                {ProjectList[id].photos != null && ProjectList[id].photos.map((photo) => {
                    return ( <img src={photo}/> );
                })}
            </div>
            
        </div>
    );
}

export default ProjectDisplay;
