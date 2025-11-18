import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
function Login({ setIsLoggedIn, isLoggedIn, setAddress, setPhoneNumber, setUsername, setEmail, setUID }) {
    const [error, setError] = useState('');
    const [info , setInfo] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        async function submitData() {
            try {
                const res = await fetch(`http://localhost:3000/logUser`, {
                    method: 'GET',
                    headers: {
                        'info': info,
                        'password': password
                    }
                });
                const text = await res.text();
                let data = {};
                try {
                    data = text ? JSON.parse(text) : {};
                } catch (err) {
                    data = { message: text };
                }
                if (res.ok) {
                        setIsLoggedIn(true);
                        console.log(isLoggedIn);
                        setAddress(data.address || '');
                        setPhoneNumber(data.phone_number || '');
                        setUsername(data.username || '');
                        setEmail(data.email || '');
                        setUID(data.id || '');
                        navigate('/profile');
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
            <h2 className='text-center mt-4'>Bejelentkezés</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group className='mb-3' controlId='formBasicEmail'>
                    <Form.Label>Email, Phonenumber or Username</Form.Label>
                    <Form.Control type='text' placeholder='Enter your email, phone number, or username' name='info' value={info} onChange={(e) => setInfo(e.target.value)} />
                </Form.Group>
                <Form.Group className='mb-3' controlId='formBasicPassword'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type='password' placeholder='Password' name='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>
                <Form.Text className='text-danger mb-3'>
                    {error}
                </Form.Text>
                <Button variant='primary' type='submit' className='w-100'>
                    Login
                </Button>
            </Form>
        </Container>
    );
}

export default Login
