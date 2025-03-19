import { useState, useContext, useEffect } from "react";
import { AuthContext } from '../auth/AuthWrapper';
import '../styles/ProfilePage.css';

function ProfilePage() {
    const { user, setUser } = useContext(AuthContext);  // Get user from AuthContext
    const [isEditing, setIsEditing] = useState(false);
    const [username, setUsername] = useState(user ? user.username : "");
    const [email, setEmail] = useState(user ? user.email : "");

    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    useEffect(() => {
        if (user) {
            setUsername(user.username || "");
            setEmail(user.email || ""); // Update email when user changes
        }
      }, [user]);

    const handleCancel = () => {
        setIsEditing(false);
        setUsername(user.username); // Reset username to original value
        setEmail(user.email); // Reset email to original value
    };
    
    const handleSave = async () => {
        const current_username = user.username ;
        console.log("current username", current_username);
        const updatedUser = { current_username, username, email };
        console.log("in save", updatedUser, JSON.stringify(updatedUser));
        try {
            const response = await fetch('http://localhost:5000/api/users/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUser)
            });

            if (!response.ok) {
                throw new Error('Failed to update user');
            }

            const data = await response.json();
            setUser(data.user); // Update user context state
            setIsEditing(false); // Close editing mode
            console.log("finished send to db", data.user)
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const handlePasswordCancel = () => {
        setIsChangingPassword(false);
        setCurrentPassword("");
        setNewPassword("");
    };

    const handlePasswordSave = async () => {
        
        const updatedUser =  { user, currentPassword, newPassword };

        try {
            console.log("entered try");
            console.log(updatedUser)
            const response = await fetch('http://localhost:5000/api/auth/change-password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedUser)
            });

            if (!response.ok) {
                const errorData = await response.json(); // Parse error message from response
                console.log('Error:', errorData.message);
                
                throw new Error(errorData.message);
            }
            console.log(user.password);
            alert("Password updated successfully!");
            setIsChangingPassword(false);
            setCurrentPassword("");
            setNewPassword("");
        } catch (error) {
            console.error('Error changing password:', error);
            alert(`Failed to update password. Please try again. Error: ${error.message || error}`);
        }
    };

    return (
        <div className="profile-container">
            <h1 className="profile-title">Profile Settings</h1>
            
            {user ? (
                <div className="profile-sections">
                    {/* Profile Header Section */}
                    <div className="profile-header">
                        <div className="profile-avatar">
                            {user.profileImage ? (
                                <img src={user.profileImage} alt={username} />
                            ) : (
                                <div className="avatar-placeholder">
                                    {username.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div className="profile-info">
                            <div className="profile-name">
                                <h2>{username}</h2>
                                
                            </div>
                            <div className="profile-details">
                                <div className="detail-item">
                                    <span className="icon email-icon"></span>
                                    {email}
                                </div>
                                <div className="detail-item">
                                    <span className="icon time-icon"></span>
                                    Last login: Today at {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Edit Profile Section */}
                    <div className="profile-section">
                        <h3 className="section-title">Profile Information</h3>
                        
                        {isEditing ? (
                            <div className="edit-form">
                                <div className="form-group">
                                    <label>Username</label>
                                    <input 
                                        type="text" 
                                        value={username} 
                                        onChange={(e) => setUsername(e.target.value)} 
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input 
                                        type="email" 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                    />
                                </div>
                                <div className="button-group">
                                    <button 
                                        onClick={handleSave}
                                        className="btn btn-primary"
                                    >
                                        Save Changes
                                    </button>
                                    <button 
                                        onClick={handleCancel}
                                        className="btn btn-secondary"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="profile-details-section">
                                <div className="detail-row">
                                    <span className="detail-label">Username</span>
                                    <span className="detail-value">{username}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Email</span>
                                    <span className="detail-value">{email}</span>
                                </div>
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="btn btn-primary"
                                >
                                    Edit Profile
                                </button>
                            </div>
                        )}
                    </div>
                    
                    {/* Security Settings Section */}
                    <div className="profile-section">
                        <h3 className="section-title">Security Settings</h3>
                        
                        <div className="security-item">
                            <div className="security-header">
                                <div className="security-info">
                                    <div className="icon password-icon"></div>
                                    <div>
                                        <h4>Change Password</h4>
                                        <p>Update your password regularly</p>
                                    </div>
                                </div>
                                {!isChangingPassword && (
                                    <button 
                                        onClick={() => setIsChangingPassword(true)} 
                                        className="btn btn-primary"
                                    >
                                        Change
                                    </button>
                                )}
                            </div>
                            
                            {isChangingPassword && (
                                <div className="password-form">
                                    <div className="form-group">
                                        <label>Current Password</label>
                                        <input 
                                            type="password" 
                                            placeholder="Enter current password" 
                                            value={currentPassword} 
                                            onChange={(e) => setCurrentPassword(e.target.value)} 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>New Password</label>
                                        <input 
                                            type="password" 
                                            placeholder="Enter new password" 
                                            value={newPassword} 
                                            onChange={(e) => setNewPassword(e.target.value)} 
                                        />
                                    </div>
                                    <div className="button-group">
                                        <button 
                                            onClick={handlePasswordSave}
                                            className="btn btn-primary"
                                        >
                                            Save Password
                                        </button>
                                        <button 
                                            onClick={handlePasswordCancel}
                                            className="btn btn-secondary"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        
                    </div>
                    
                    
                </div>
            ) : (
                <p className="login-message">Please log in first to view your profile.</p>
            )}
        </div>
    );
}

export default ProfilePage;