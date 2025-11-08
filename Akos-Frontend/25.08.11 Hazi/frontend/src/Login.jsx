import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
function Login({ setIsLoggedIn, isLoggedIn }) {
    const [error, setError] = useState("");
    const [info , setInfo] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        async function submitData() {
            try {
                const res = await fetch(`http://localhost:3000/logUser?info=${info}&password=${password}`, {
                    method: 'GET'
                });
                const data = await res.json();
                if (res.ok) {
                        setIsLoggedIn(true);
                        console.log(isLoggedIn);
                        setAddress(data.address || "");
                        setPhoneNumber(data.phone_number || "");
                        setUsername(data.username || "");
                        setEmail(data.email || "");
                        navigate("/profile");
                    }
                    else {
                    setError(data.message || 'Failed to log in');
                }
            } catch (error) {
                console.error('Error:', error);
                setError('Failed to log in');
            }
        }
        submitData();
        
    }
    return (
        <Container>
            <h2 className="text-center mt-4">Bejelentkezés</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email cím, Felhasználónév vagy Telefonszám</Form.Label>
                    <Form.Control type="text" placeholder="Add meg az egyik egyedi adatod" name="info" value={info} onChange={(e) => setInfo(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Jelszó</Form.Label>
                    <Form.Control type="password" placeholder="Jelszó" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>
                <Form.Text className="text-danger mb-3">
                    {error}
                </Form.Text>
                <Button variant="primary" type="submit" className="w-100">
                    Bejelentkezés
                </Button>
            </Form>
        </Container>
    );
}

export default Login
