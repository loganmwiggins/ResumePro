import React from 'react';
import { useNavigate } from 'react-router-dom';

import '../stylesheets/Profile.css';
import { showToast } from '../utils/Toast';
import AuthorizeView from '../components/AuthorizeView';
import { useUser } from "../context/UserContext"; 

function EditProfile() {
    const { user, loading } = useUser();
    const navigate = useNavigate();

    const handleCancel = () => {
        navigate("/profile");
    }

    const handleSave = () => {
        showToast("Implement logic for save", "info");
    }

    return (
        <AuthorizeView>
            <div className="edit-profile-head">
                <div className="page-header">
                    <h1>Edit Profile</h1>
                </div>
                <div className="head-btns">
                    <button type="button" onClick={handleCancel}>Cancel</button>
                    <button type="button" onClick={handleSave}>Save</button>
                </div>
            </div>
            

            {loading ? (
                <div className="loading-spinner"></div>
            ) : (
            <form action="" className="edit-profile-form">
                {/* Full Name field */}
                <div className="field-row">
                    <div className="label-ctnr">
                        <p>Name</p>
                    </div>
                    <div className="input-ctnr">   
                        <input 
                            type="text" 
                            id="firstname" 
                            name="firstname" 
                            placeholder="First Name"
                            value={user.firstName}
                        />
                        <input 
                            type="text" 
                            id="lastname" 
                            name="lastname" 
                            placeholder="Last Name"
                            value={user.lastName}
                        />
                    </div>
                </div>

                {/* Email field */}
                <div className="field-row">
                    <div className="label-ctnr">
                        <p>Email</p>
                    </div>
                    <div className="input-ctnr">   
                        <input 
                            type="text" 
                            id="email" 
                            name="email" 
                            placeholder="Email address"
                            value={user.email}
                        />
                    </div>
                </div>

                {/* Profile Picture field */}
                <div className="field-row">
                    <div className="label-ctnr">
                        <p>Profile Picture</p>
                    </div>
                    <div className="input-ctnr edit-pfp-ctnr">   
                        <div className="pfp">
                            <img src="assets/icons/user.svg" draggable="false" />
                        </div>
                        <div>
                            <p><strong>Upload an image</strong></p>
                            <p>PNG or JPG (max. 300x300px)</p>
                            <button type="button">Choose image</button>
                        </div>
                    </div>
                </div>

                {/* Profile Picture field */}
                <div className="field-row">
                    <div className="label-ctnr">
                        <p>Profile Banner</p>
                    </div>
                    <div className="input-ctnr edit-pfp-ctnr">
                        <div className="pfp">
                            <img src="assets/profile-banners/modern-blue-halftone.jpg" draggable="false" />
                        </div>
                        <div>
                            <p><strong>Upload an image</strong></p>
                            <p>PNG or JPG (max. 1920x1080px)</p>
                            <button type="button">Choose image</button>
                        </div>
                    </div>
                </div>
            </form>
            )}
        </AuthorizeView>
    )
}

export default EditProfile