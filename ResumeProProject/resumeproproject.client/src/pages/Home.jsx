import React from 'react';

import '../stylesheets/Home.css';
import AuthorizeView from '../components/AuthorizeView';

function Home() {
  return (
    <AuthorizeView>    
      <div>Home page</div>
    </AuthorizeView>
  )
}

export default Home;