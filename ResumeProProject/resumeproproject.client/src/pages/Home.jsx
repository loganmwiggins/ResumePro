import React from 'react';
import { useNavigate } from 'react-router-dom';

import AuthorizeView from '../components/AuthorizeView';
import { useUser } from "../context/UserContext"; 
import '../stylesheets/Home.css';

function Home() {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  // Array of possible greetings
  const greetings = ["Hi", "Hey", "Hello", "Welcome", "Greetings", "What's up", "Howdy", "Ahoy"];
  
  // Array of possible messages
  const messages = [
    "Create your own custom resume to apply for jobs.",
    "Ready to make a resume?",
    "Your dream job starts with a great resume!",
    "Showcase your skills with a professional resume.",
    "Time to build a resume that stands out!",
    "Make a resume that gets you hired.",
    "Polish your resume and land that job!"
  ];

  // Function to randomly pick a greeting and a message
  const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

  return (
    <AuthorizeView>
      {loading ? (
        <div className="loading-spinner"></div>
      ) : (
        <div className="page-header">
          <h1>{getRandomElement(greetings)}, {user.firstName}</h1>
          <p>{getRandomElement(messages)}</p>
        </div>
      )}  
    </AuthorizeView>
  );
}

export default Home;
