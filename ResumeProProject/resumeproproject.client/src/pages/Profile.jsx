import React from 'react';
import { useNavigate } from 'react-router-dom';

import '../stylesheets/Profile.css';
import AuthorizeView from '../components/AuthorizeView';
import LogoutLink from '../components/LogoutLink';
import { useUser } from "../context/UserContext"; 

function Profile() {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  // Function to format DateTime
  const formatDate = (isoDate) => {
    if (!isoDate) return "";  // Handle potential null/undefined values

    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const handleEditProfile = () => {
    navigate("/edit-profile");
  }

  return (
  <AuthorizeView>
    {loading ? (
        <div className="loading-spinner"></div>
    ) : (
      <div className="profile-ctnr">
        <div className="profile-banner">
          <img src="assets/profile-banners/modern-blue-halftone.jpg" draggable="false" />
        </div>
        <div className="profile-head">
          <div className="head-info">
            <img src="assets/icons/user.svg" draggable="false" />
            <div className="head-info-txt">
              <h3>{user.firstName} {user.lastName}</h3>
              <div className="user-tags">
                <p>{user.email}</p>
                <p>Joined {formatDate(user.dateJoined)}</p>
              </div>
            </div>
          </div>
          <div className="head-btns">
            <button type="button" onClick={handleEditProfile}>Edit Profile</button>
            <LogoutLink>Logout</LogoutLink>
          </div>
        </div>
      </div>
    )}
  </AuthorizeView>
  )
}

export default Profile;