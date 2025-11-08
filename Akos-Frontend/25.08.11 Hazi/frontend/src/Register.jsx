import { useState } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import "bootstrap/dist/css/bootstrap.min.css";
function Register() {
    const [error, setError] = useState("");
    const [email , setEmail] = useState("");
    const [username , setUsername] = useState("");
    const [address , setAddress] = useState("");
    const [phoneNumber , setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        if (password !== confirmPassword) {
            setError("A jelszavak nem egyeznek meg");
            return;
        }
        else if (password.length < 6) {
            setError("A jelszónak legalább 6 karakter hosszúnak kell lennie");
            return;
        }
        else {
            async function submitData() {
                try {
                    const res = await fetch('http://localhost:3000/regUser', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ username, email, password, address, phone_number: phoneNumber })
                    });
                    const data = await res.json();
                    if (res.ok) {
                        window.location.href = '/login';
                    }
                    else {
                        setError(data.message);
                    }
                } catch (error) {
                    setError(error.message);
                }
            }
            submitData();
        }
    }
    return (
        <>
            <Container>
                <h2 className="text-center mt-4">Regisztráció</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email cím</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicUsername">
                        <Form.Label>Felhasználónév</Form.Label>
                        <Form.Control type="text" placeholder="Felhasználónév" onChange={(e) => setUsername(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicAddress">
                        <Form.Label>Cím</Form.Label>
                        <Form.Control type="text" placeholder="Cím" onChange={(e) => setAddress(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPhoneNumber">
                        <Form.Label>Telefonszám</Form.Label>
                        <Form.Control type="text" placeholder="Telefonszám" onChange={(e) => setPhoneNumber(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Jelszó</Form.Label>
                        <Form.Control type="password" placeholder="Jelszó" onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                        <Form.Label>Jelszó megerősítése</Form.Label>
                        <Form.Control type="password" placeholder="Jelszó megerősítése" onChange={(e) => setConfirmPassword(e.target.value)} />
                    </Form.Group>
                    <p className="text-danger"> {error} </p>
                    <Button variant="primary" type="submit" className="w-100">
                        Regisztráció
                    </Button>
                    <p className="text-center mt-3">Már van fiókod? <a href="/login">Jelentkezz be</a></p>
                </Form>
            </Container>
        </>
    );
}

export default Register;