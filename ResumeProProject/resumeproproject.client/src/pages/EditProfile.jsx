import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AuthorizeView from '../components/AuthorizeView';
import { API_BASE_URL } from '../utils/BaseUrl';
import { showToast } from '../utils/Toast';
import { useUser } from "../context/UserContext"; 
import '../stylesheets/EditProfile.css';

function EditProfile() {
    const navigate = useNavigate();
    const { user, userLoading } = useUser();

    const [formData, setFormData] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCancel = () => {
        navigate("/profile");
        showToast("Changes were not saved", "warning", "Canceled");
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/user/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    UserId: user.id,
                    Email: formData.email,
                    FirstName: formData.firstName,
                    LastName: formData.lastName,
                    CoreResumeId: null,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update profile");
            }

            showToast("Profile updated successfully!", "success");

            window.location.href = "/profile";
        } catch (error) {
            console.error("Error saving profile:", error);
            showToast("Error updating profile. Please try again.", "error");
        }
    };


    return (
        <AuthorizeView>
            <div className="edit-profile-head">
                <div className="page-header">
                    <h1>Edit Profile</h1>
                </div>
                <div className="head-btns">
                    <button type="button" className="btn btn-outline" onClick={handleCancel}>Cancel</button>
                    <button type="button" className="btn btn-blue" onClick={handleSave}>Save</button>
                </div>
            </div>

            {userLoading ? (
                <div className="loading-spinner"></div>
            ) : (
                <form className="edit-profile-form">
                    {/* Full Name field */}
                    <div className="field-row">
                        <div className="label-ctnr">
                            <p>Name</p>
                        </div>
                        <div className="input-ctnr">
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={handleChange}
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
                                type="email"
                                name="email"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleChange}
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
                            <img src="assets/images/profile-banners/modern-blue-halftone.jpg" draggable="false" />
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