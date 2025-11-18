import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
function Profile({ isLoggedIn, address, phoneNumber, username, email, UID }) {
  const navigate = useNavigate();
  const [phone_number, setPhone_number] = useState(phoneNumber);
  const [addr, setAddr] = useState(address);
  const [usern, setUsern] = useState(username);
  const [em, setEm] = useState(email);

  const handlesubmit = (e) => {
    e.preventDefault();
    async function updateData() {
      try {
        const res = await fetch(`http://localhost:3000/updateUser/${UID}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: usern,
            email: em,
            address: addr,
            phone_number: phone_number,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          console.log('User updated successfully');
        } else {
          console.error('Failed to update user:', data.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
    updateData();
  };
    const deleteAccount = () => {
    async function deleteData() {
      try {
        const res = await fetch(`http://localhost:3000/deleteUser/${UID}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        if (res.ok) {
          console.log('User deleted successfully');
          alert('Your account has been deleted.');
          isLoggedIn = false;
          navigate('/home');
        } else {
          console.error('Failed to delete user:', data.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
    deleteData();
  };
  return (
    <>
      <Form onSubmit={handlesubmit}>
        <h1>Profile Page</h1>
        <Form.Group>
          <Form.Label>Username:</Form.Label> <b> {username} </b> {' '}
          <Form.Control
            style={{ display: "block"}}
            id='username'
            type='text'
            value={usern}
            placeholder={username}
            onChange={(e) => setUsern(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Email:</Form.Label> <b>{email} </b>
          <Form.Control
            style={{ display: "block"}}
            id='email'
            type='text'
            value={em}
            placeholder={email}
            onChange={(e) => setEm(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Address:</Form.Label> <b> {address} </b>
          <Form.Control
            style={{ display: "block"}}
            id='address'
            type='text'
            value={addr}
            placeholder={address}
            onChange={(e) => setAddr(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Phone Number:</Form.Label> <b>{phoneNumber} </b>
          <Form.Control
            style={{ display: "block"}}
            id='phoneNumber'
            type='text'
            value={phone_number}
            placeholder={phoneNumber}
            onChange={(e) => setPhone_number(e.target.value)}
          />
        </Form.Group>
        <Button className='mt-3' variant='primary' type='submit'>
          Update Profile
        </Button>
      </Form>
      <Link to='/ChangePassword'>
        <Button className='mt-3' variant='secondary'>
          Change Password
        </Button>
      </Link>
      <Button className='mt-3' variant='danger' onClick={deleteAccount}>
        Delete Account
      </Button>
    </>
  );
}

export default Profile;
