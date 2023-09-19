import React from "react"
import Header from './Components/Header';
import './App.css';
import Template from "./Components/Template";
import Mainbody from "./Components/Mainbody";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Formheader from "./Components/Formheader";
import Centeredtabs from "./Components/Centeredtabs";
import Question_form from "./Components/Question_form";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>

          <Route path="/" element={
            <React.Fragment>
              <Header />
              <Template />
              <Mainbody />
            </React.Fragment>
          }
          />

          <Route path="/form/:id" element={
            <React.Fragment>
              <Formheader />
              <Centeredtabs />
              <Question_form />
            </React.Fragment>
          }
          />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
