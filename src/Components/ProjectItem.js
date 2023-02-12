import React from "react";
import { useNavigate } from "react-router-dom";

function ProjectItem({image, name, id, date}) {

    const navigate = useNavigate();

    return (
        <div className="projectItem" onClick={() => {navigate("/project/" + id)}}>
            <div style={{backgroundImage: `url(${image})`}} className="bgImage" />
            <h2>{name}</h2>
            <p>{date}</p>
        </div>
    );
}

export default ProjectItem;