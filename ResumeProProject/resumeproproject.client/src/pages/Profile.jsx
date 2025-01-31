import React from 'react';

import '../stylesheets/Profile.css';
import AuthorizeView from '../components/AuthorizeView';
import LogoutLink from '../components/LogoutLink';

function Profile() {
  return (
  <AuthorizeView>
    <div>Profile page</div>
    <LogoutLink>Logout</LogoutLink>
  </AuthorizeView>
  )
}

export default Profile;