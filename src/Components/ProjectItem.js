import React from "react";
import { useNavigate } from "react-router-dom";

function ProjectItem({image, name, id, date}) {

    const navigate = useNavigate();

    const [thisClassName, setThisClassName] = React.useState("projectItem");

    return (
        <div className={thisClassName}
            onClick={() => {navigate("/project/" + id)}}
            onMouseEnter={() => {setThisClassName("projectItemHover")}}
            onMouseLeave={() => {setThisClassName("projectItem")}}
        >
            <div style={{backgroundImage: `url(${image})`}} className="bgImage" />
            <div className="info">
                <h2>{name}</h2>
                <p>{date}</p>
            </div>
        </div>
    );
}

export default ProjectItem;