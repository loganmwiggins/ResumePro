import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactImageUploading from 'react-images-uploading';

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
        email: user?.email || ""
    });

    const [profileImage, setProfileImage] = useState(user?.profileImage || null);

    useEffect(() => {
        if (user) { 
            setProfileImage(user.profileImage);
            setFormData({
                firstName: user?.firstName || "",
                lastName: user?.lastName || "",
                email: user?.email || ""
            });
        }
    }, [user]);

    useEffect(() => {
        console.log("USER ON MOUNT/CHANGE:", user)
        console.log("IMAGE ON MOUNT/CHANGE:", profileImage);

    }, [user, profileImage]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onProfilePicChange = (imageList) => {
        setProfileImage(imageList[0]['data_url']);
    };

    const handleCancel = () => {
        navigate("/profile");
        showToast("Changes were not saved", "warning", "Canceled");
    };

    const handleSave = async () => {
        console.log("PROFILE IMAGE ON SAVE:", profileImage);
        const profileImageData = profileImage || null;
        console.log("PROFILE IMAGE DATA ON SAVE:", profileImageData);

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
                    ProfileImage: profileImageData
                })
            });

            if (!response.ok) {
                showToast("Failed to update profile", "error");
                throw new Error("Failed to update profile");
            } 

            showToast("Profile updated successfully!", "success");

            navigate("/profile");
        } 
        catch (error) {
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
                    <ReactImageUploading
                        value={profileImage}
                        onChange={onProfilePicChange}
                        dataURLKey="data_url"
                        acceptType={["jpg", "png"]}
                    >
                        {({
                            onImageUpload,
                            onImageRemove,
                            isDragging,
                            dragProps
                        }) => (
                            <div className="input-ctnr edit-pfp-ctnr">   
                                <div className="pfp">
                                    {profileImage ? (
                                        <img src={profileImage} draggable="false" />
                                    ) : (
                                        <img src="assets/icons/user.svg" draggable="false" />
                                    )}
                                </div>
                                <div className="pfp-text-ctnr">
                                    <div className="pfp-text">
                                        <p><strong>Upload an image</strong></p>
                                        <p className="types">Accepted types: JPG or PNG</p>
                                    </div>
                                    
                                    {profileImage ? (
                                        <div className="btn-row">
                                            <button 
                                                type="button"
                                                onClick={onImageRemove}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <button 
                                            type="button"
                                            style={isDragging ? { color: 'red' } : undefined}
                                            onClick={onImageUpload}
                                            {...dragProps}
                                        >
                                            Click or drop here
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </ReactImageUploading>
                </div>

                {/* Profile Picture field */}
                {/* <div className="field-row">
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
                </div> */}
            </form>
            )}
        </AuthorizeView>
    )
}

export default EditProfile;