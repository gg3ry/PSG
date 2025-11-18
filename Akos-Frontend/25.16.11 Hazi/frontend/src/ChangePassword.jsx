import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
function ChangePassword({ isLoggedIn, UID }) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (newPassword !== confirmPassword) {
            setError('New password and confirm password do not match');
            return;
        }
        async function changePassword() {
            try {
                const res = await fetch(`http://localhost:3000/changePassword/${UID}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        oldPassword: currentPassword,
                        newPassword: newPassword,
                    }),
                });
                const data = await res.json();
                if (res.ok) {
                    setSuccess('Password changed successfully');
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                } else {
                    setError(data.message || 'Failed to change password');
                }
            } catch (error) {
                setError('An error occurred while changing the password');
            }
        }
        changePassword();
    };
    return (
        <div>
            <h2>Change Password</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group className='mb-3' controlId='formCurrentPassword'>
                    <Form.Label>Current Password</Form.Label>
                    <Form.Control type='password' placeholder='Enter current password' value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
                </Form.Group>
                <Form.Group className='mb-3' controlId='formNewPassword'>
                    <Form.Label>New Password</Form.Label>
                    <Form.Control type='password' placeholder='Enter new password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                </Form.Group>
                <Form.Group className='mb-3' controlId='formConfirmPassword'>
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control type='password' placeholder='Confirm new password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </Form.Group>
                <Button variant='primary' type='submit'>
                    Change Password
                </Button>
            </Form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
        </div>
    );
}

export default ChangePassword;