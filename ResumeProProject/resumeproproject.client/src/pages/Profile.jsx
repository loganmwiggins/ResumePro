import React from 'react';

import '../stylesheets/Profile.css';
import AuthorizeView from '../components/AuthorizeView';

function Profile() {
  return (
  <AuthorizeView>
    <div>Profile page</div>
  </AuthorizeView>
  )
}

export default Profile;