import AuthorizeView from '../components/AuthorizeView';
import LogoutLink from '../components/LogoutLink';
import '../stylesheets/Home.css';

import React from 'react'

function Home() {
  return (
    <AuthorizeView>    
      <div>Home</div>
      <LogoutLink children={"logout"}>logout</LogoutLink>
    </AuthorizeView>
  )
}

export default Home;