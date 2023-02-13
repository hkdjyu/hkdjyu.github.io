import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Home from "./Pages/Home";
import Projects from "./Pages/Projects";
import Experience from "./Pages/Experience";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import ProjectDisplay from './Pages/ProjectDisplay';
import ScrollToTop from './Components/ScrollToTop';


export const ThemeContext = React.createContext(null);

function App() {

  const [theme, setTheme] = React.useState("light");
  const toggleTheme = () => {
    theme === "light" ? setTheme("dark") : setTheme("light")
  };

  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
    <div className="App" id={theme}>
      <Router>
        <ScrollToTop />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/Project/:id" element={<ProjectDisplay />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/website" element={ <Navigate to="/" /> } />
          </Routes>
          <Footer />
      </Router>
    </div>
    </ThemeContext.Provider>
    );
}
export default App;