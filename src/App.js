import './App.css';
import {BrowserRouter as HashRouter, Router, Routes, Route, Navigate} from 'react-router-dom';
import Home from "./Pages/Home";
import Projects from "./Pages/Projects";
import Experience from "./Pages/Experience";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import ProjectDisplay from './Pages/ProjectDisplay';

function App() {
  return (
    <div className="App">
      <HashRouter basename="/">  
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/Project/:id" element={<ProjectDisplay />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/website" element={ <Navigate to="/" /> } />
        </Routes>
        <Footer />
      </HashRouter>
    </div>
    );
}

export default App;
