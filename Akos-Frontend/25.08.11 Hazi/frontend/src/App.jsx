import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import Profile from "./Profile";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);



    const [address, setAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
  return (
    <>
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
                  <Nav.Link as={NavLink} to="#"><Button onClick={() => setIsLoggedIn(false)}>Log out</Button></Nav.Link>
                </>
              )}
            </Nav>
          </Container>
        </Navbar>

        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/profile" element={<Profile isLoggedIn={isLoggedIn} address={address} phoneNumber={phoneNumber} username={username} email={email} />} />

          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} setAddress={setAddress} setPhoneNumber={setPhoneNumber} setUsername={setUsername} setEmail={setEmail} />} />
          <Route path="/register" element={<Register />} />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
