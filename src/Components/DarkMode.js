import React from "react";
import "../Styles/DarkMode.css";
import Switch from "react-switch";
import LightIcon from "@material-ui/icons/WbSunnyOutlined";
import DarkIcon from "@material-ui/icons/Brightness2";

const DarkMode = () => {

    const [currentMode, setCurrentMode] = React.useState("dark");
    
    const setDarkMode = () => {
        document.querySelector("body").setAttribute("data-theme", "dark");
        setCurrentMode("dark");
    };

    const setLightMode = () => {
        document.querySelector("body").setAttribute("data-theme", "light");
        setCurrentMode("light");
    };

    const toggleTheme = () => {
        (currentMode === "dark") ? setLightMode() :  setDarkMode();
    };
    return (
        <div className='dark_mode'>
            <Switch
                className='darkModeSwitch'
                onChange={toggleTheme}  
                checked={currentMode === "dark"}
                offColor="#1c2135"
                offHandleColor="#d8cd80"
                onColor="#e7e9ee"
                onHandleColor="#d8cd80"
                checkedIcon={false}
                uncheckedIcon={false}
                height={20}
                width={48}
                checkedHandleIcon={
                    <div className="darkModeIcon"><DarkIcon /></div>
                }
                uncheckedHandleIcon={
                    <div className="lightModeIcon"><LightIcon /></div>
                }
            />
        </div>
    );
};

export default DarkMode;

/*

import { ReactComponent as Sun } from "../Assets/Sun.svg";
import { ReactComponent as Moon } from "../Assets/Moon.svg";

const DarkMode = () => {
    
    const setDarkMode = () => {
        document.querySelector("body").setAttribute("data-theme", "dark");
    };

    const setLightMode = () => {
        document.querySelector("body").setAttribute("data-theme", "light");
    };

    const toggleTheme = (e) => {
        if (e.target.checked) setLightMode();
        else setDarkMode();
    };
    return (
        <div className='dark_mode'>
            <input
                className='dark_mode_input'
                type='checkbox'
                id='darkmode-toggle'
                onChange={toggleTheme}
            />
            <label className='dark_mode_label' for='darkmode-toggle'>
                <Sun />
                <Moon />
            </label>
        </div>
    );
};

export default DarkMode;
*/
