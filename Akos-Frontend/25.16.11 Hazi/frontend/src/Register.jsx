import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
function Register() {
    const [error, setError] = useState('');
    const [email , setEmail] = useState('');
    const [username , setUsername] = useState('');
    const [address , setAddress] = useState('');
    const [phoneNumber , setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        else if (password.length < 6) {
            setError('The password must be at least 6 characters long');
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
                <h2 className='text-center mt-4'>Registration</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className='mb-3' controlId='formBasicEmail'>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type='email' placeholder='Enter email' onChange={(e) => setEmail(e.target.value)} />
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='formBasicUsername'>
                        <Form.Label>Username</Form.Label>
                        <Form.Control type='text' placeholder='Username' onChange={(e) => setUsername(e.target.value)} />
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='formBasicAddress'>
                        <Form.Label>Address</Form.Label>
                        <Form.Control type='text' placeholder='Address' onChange={(e) => setAddress(e.target.value)} />
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='formBasicPhoneNumber'>
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control type='text' placeholder='Phone Number' onChange={(e) => setPhoneNumber(e.target.value)} />
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='formBasicPassword'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type='password' placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='formBasicConfirmPassword'>
                        <Form.Label>Password Confirm</Form.Label>
                        <Form.Control type='password' placeholder='Password Confirm' onChange={(e) => setConfirmPassword(e.target.value)} />
                    </Form.Group>
                    <p className='text-danger'> {error} </p>
                    <Button variant='primary' type='submit' className='w-100'>
                        Registration
                    </Button>
                    <p className='text-center mt-3'>Already have an account? <a href='/login'>Login</a></p>
                </Form>
            </Container>
        </>
    );
}

export default Register;