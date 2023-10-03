import React from "react";
import "../Styles/Login.css";
import LoginIcon from "@material-ui/icons/LockOpen"

const Login = () => {

    // const [currentMode, setCurrentMode] = React.useState("dark");
    
    // const setDarkMode = () => {
    //     document.querySelector("body").setAttribute("data-theme", "dark");
    //     setCurrentMode("dark");
    // };

    // const setLightMode = () => {
    //     document.querySelector("body").setAttribute("data-theme", "light");
    //     setCurrentMode("light");
    // };

    // const toggleTheme = () => {
    //     (currentMode === "dark") ? setLightMode() :  setDarkMode();
    // };
    return (
        <div>
            <button className="loginIcon">
                <LoginIcon/>
            </button>
            
        </div>
        // <div className='dark_mode'>
        //     <Switch
        //         className='darkModeSwitch'
        //         checked={currentMode === "dark"}
        //         onChange={toggleTheme} 
        //         offColor="#1c2135" 
        //         onColor="#e7e9ee"
        //         offHandleColor="#d8cd80"
        //         onHandleColor="#d8cd80"
        //         handleDiameter={30}
        //         checkedIcon={false}
        //         uncheckedIcon={false}
        //         uncheckedHandleIcon={
        //             <div className="lightModeIcon"><LightIcon /></div>
        //         }
        //         checkedHandleIcon={
        //             <div className="darkModeIcon"><DarkIcon /></div>
        //         }
        //         height={20}
        //         width={50}
        //     />
        // </div>
    );
};

export default Login;