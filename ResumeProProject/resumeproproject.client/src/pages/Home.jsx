import React from 'react';
import { useNavigate } from 'react-router-dom';

import AuthorizeView from '../components/AuthorizeView';
import { useUser } from "../context/UserContext"; 
import '../stylesheets/Home.css';

function Home() {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  // Array of possible greetings
  const greetings = [
    "Hi", "Hey", "Hello", "Welcome", "Greetings", "What's up", "Howdy",
    "Good to see you", "Hey there", "Hello there"
  ];
  
  // Array of possible messages
  const messages = [
    "Create your own custom resume to apply for jobs.",
    "Ready to make a resume?",
    "Your dream job starts with a great resume!",
    "Showcase your skills with a professional resume.",
    "Time to build a resume that stands out!",
    "Make a resume that gets you hired.",
    "Polish your resume and land that job!",
    "Craft a resume that highlights your strengths.",
    "Your next job is just a great resume away!",
    "Let’s make your resume shine.",
    "Stand out in the job market with a stellar resume.",
    "Turn your skills into an opportunity with a great resume.",
    "Get one step closer to your dream job.",
    "Put your best foot forward with a top-notch resume.",
    "Your career journey starts with a strong resume.",
    "A resume that speaks for you – let's build it!",
    "Let’s get that resume looking sharp!",
    "Ready to impress recruiters? Let's start!",
    "Make your resume as amazing as you are."
  ];

  // Function to randomly pick a greeting and a message
  const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

  const handleNewResume = () => {
    navigate("/templates");
  }

  return (
    <AuthorizeView>
      {loading ? (
        <div className="loading-spinner"></div>
      ) : (
        <div className="page-ctnr">
          {/* Home header */}
          <div className="home-header">
            <div className="page-header">
              <h1>{getRandomElement(greetings)}, {user.firstName}</h1>
              <p>{getRandomElement(messages)}</p>
            </div>
            <div>
              <button
                type="button"
                onClick={handleNewResume}
              >
                <img src="assets/icons/plus.svg" draggable="false" />
                <span>New Resume</span>
              </button>
            </div>
          </div>

          {/* My Resumes section */}
          <div className="my-resumes-ctnr">
            <h2>My Resumes</h2>
            <div className="resumes-row">
              {/* Resume */}
              <div className="resume">
                <div className="resume-img"></div>
                <div className="resume-info">
                  <div className="resume-txt">
                    <p>Resume for JM Family</p>
                    <p>Last Updated: Feb 3, 2025</p>
                  </div>
                  <div className="resume-btns">
                    <button>
                      <img src="assets/icons/pencil.svg" draggable="false" />
                    </button>
                    <button>
                      <img src="assets/icons/trash.svg" draggable="false" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Resume */}
              <div className="resume">
                <div className="resume-img"></div>
                <div className="resume-info">
                  <div className="resume-txt">
                    <p>JPMorgan Resume</p>
                    <p>Last Updated: Jan 27, 2025</p>
                  </div>
                  <div className="resume-btns">
                    <button>
                      <img src="assets/icons/pencil.svg" draggable="false" />
                    </button>
                    <button>
                      <img src="assets/icons/trash.svg" draggable="false" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Resume */}
              <div className="resume">
                <div className="resume-img"></div>
                <div className="resume-info">
                  <div className="resume-txt">
                    <p>Untitled Document</p>
                    <p>Last Updated: Nov 12, 2024</p>
                  </div>
                  <div className="resume-btns">
                    <button>
                      <img src="assets/icons/pencil.svg" draggable="false" />
                    </button>
                    <button>
                      <img src="assets/icons/trash.svg" draggable="false" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}  
    </AuthorizeView>
  );
}

export default Home;
