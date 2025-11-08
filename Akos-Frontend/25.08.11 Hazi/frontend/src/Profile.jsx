import { Navigate } from "react-router-dom";

function Profile({isLoggedIn, address, phoneNumber, username, email}) {
    if(!isLoggedIn){
        return <Navigate to="/login" replace/>
    }
    return (
        <>
        
        <div>
            <h1>Profile Page</h1>
            <p><strong>Username:</strong> {username}</p>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Address:</strong> {address}</p>
            <p><strong>Phone Number:</strong> {phoneNumber}</p>
        </div>
        </>
    );
}

export default Profile;
