import { Description } from "@material-ui/icons";
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import TickIcon from "@material-ui/icons/CheckCircleOutlineRounded";
import { ProjectList } from "../UserData/ProjectList";

function ProjectItem({image, name, id, date, description}) {

    const navigate = useNavigate();
    const [isHover, setIsHover] = React.useState(false);

    return (
        <motion.div className="projectItem"
            onClick={() => {navigate("/project/" + name.replace(/\s/g, '_'))}}
            onMouseEnter={() => {setIsHover(true)}}
            onMouseLeave={() => {setIsHover(false)}}
            // while Hover scale up, transition duration 0.5s, ease-in-out
            whileHover={{scale: 1.1, transition: {duration: 0.01, ease: "easeInOut"}}}
            initial={{x: 1000, opacity: 0}}
            animate={{x: 0, opacity: 1}}
            transition={{duration: 0.5, delay: id * 0.2}}
        >
            <div style={{backgroundImage: `url(${image})`}} className="bgImage">
                <span style={{opacity: isHover ? 0.9 : 0}}>
                    {description}
                    {ProjectList[id].hasReadme && <div><p>Readme file <TickIcon/></p></div>}
                </span>
            </div>
            <div className="info">
                <p className="name">{name}</p>
                <div className="bottomRow">
                    <p className="date">{date}</p>
                </div>
            </div>
        </motion.div>
    );
}

export default ProjectItem;