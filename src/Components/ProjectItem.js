import { Description } from "@material-ui/icons";
import React from "react";
import { useNavigate } from "react-router-dom";

function ProjectItem({image, name, id, date, description}) {

    const navigate = useNavigate();

    const [thisClassName, setThisClassName] = React.useState("projectItem");

    return (
        <div className={thisClassName}
            onClick={() => {navigate("/project/" + id)}}
            onMouseEnter={() => {setThisClassName("projectItemHover")}}
            onMouseLeave={() => {setThisClassName("projectItem")}}
        >
            <div style={{backgroundImage: `url(${image})`}} className="bgImage">
                <span>{description}</span>
            </div>
            <div className="info">
                <h2>{name}</h2>
                <p>{date}</p>
            </div>
        </div>
    );
}

export default ProjectItem;