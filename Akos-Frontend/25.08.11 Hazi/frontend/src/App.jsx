import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Home from "./assets/Home";
import Login from "./assets/Login";
import Register from "./assets/Register";
import Profile from "./assets/Profile";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "bootstrap";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <BrowserRouter>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={NavLink} to="/">Lofasz</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/">Home</Nav.Link>
            {!isLoggedIn && (
              <>
                <Nav.Link as={NavLink} to="/login">Bejelentkezes</Nav.Link>
                <Nav.Link as={NavLink} to="/register">Regisztracio</Nav.Link>
              </>
            )}
            {isLoggedIn && (
              <>
                <Nav.Link as={NavLink} to="/profile">Profil</Nav.Link>
              </>
            )}
          </Nav>
        </Container>
      </Navbar>

      <Routes>
        <Route path="/" element={<Home />} />
        
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />} />
            <Route path="/register" element={<Register />} />        
            <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
