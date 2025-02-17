import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import '../stylesheets/ResumeInsights.css';
import AuthorizeView from '../components/AuthorizeView';
import { showToast } from '../utils/Toast';

function ResumeInsights() {
  const navigate = useNavigate();
  const params = useParams();

  const [resumeId, setResumeId] = useState(params.resumeId || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resumeData, setResumeData] = useState(null);
  const [aiResult, setAiResult] = useState(null); // New state to store AI response
  const [jobTitle, setJobTitle] = useState('');
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  // Messages for the loading state
  const loadingMessages = [
    "Analyzing your resume...",
    "Getting insights from AI...",
    "Fine-tuning your feedback...",
    "Making the magic happen...",
    "Reviewing your resume details...",
    "Gathering AI-powered insights...",
    "Optimizing your results...",
    "Polishing your feedback...",
    "Scanning for improvements...",
    "Checking industry best practices...",
    "Crunching the numbers...",
    "Crafting the perfect response...",
    "Almost there, hang tight...",
    "Fine-tuning your recommendations...",
    "Making sure everything checks out...",
    "Unlocking your resume’s potential...",
    "Formatting results for clarity...",
    "Running a deep analysis...",
    "Double-checking key details...",
    "Giving it a final touch...",
    "Generating tailored suggestions...",
    "Putting AI to work for you...",
    "Refining your career insights..."
  ];

  const [showDisclaimer, setShowDisclaimer] = useState(false);

  // Call fetchResumeInsights (on mount) to automatically trigger the process
  useEffect(() => {
    if (resumeId) {
      fetchResumeInsights(); 
    }

    // Logic for disclaimer pop-up
    const handleClickOutside = (event) => {
      if (!event.target.closest(".info-item")) {
        setShowDisclaimer(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [resumeId]);

  useEffect(() => {
    // Set a random starting index when the component mounts
    setLoadingMessageIndex(Math.floor(Math.random() * loadingMessages.length));
}, []); // Empty dependency array ensures this runs once when the component mounts
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
      }, 2000); // Change message every 3 seconds

      return () => clearInterval(interval); // Clean up the interval when the component is unmounted
    }
  }, [loading]);

  // Helper function to determine color based on score
  const getScoreColorClass = (score) => {
    if (!score) return ""; // Handle missing score

    const [numerator, denominator] = score.split("/").map(Number); // Convert to numbers

    if (isNaN(numerator) || isNaN(denominator)) return ""; // Ensure valid numbers

    const percentage = (numerator / denominator) * 100; // Convert to percentage

    if (percentage >= 80) return "score-green";  
    if (percentage >= 50) return "score-yellow";  
    return "score-red";  // Ensure 0% falls in this range
  };

  const toggleDisclaimer = () => {
    setShowDisclaimer(!showDisclaimer);
  }

  const fetchResumeInsights = async () => {
    setError('');
    setLoading(true);

    try {
      // [Step 1]: Fetch the resume JSON
      const resumeJson = await fetchResumeData();
      if (!resumeJson) return;
      setResumeData(resumeJson);

      // [Step 2]: Get existing insight or null 
      const existingInsightJson = await fetchExistingInsight(resumeId);

      // [Step 3]: If there is an existing insight, set AI result JSON
      if (existingInsightJson) {
        setAiResult(existingInsightJson);
      }
    } 
    catch (err) {
      setError(err.message);
    } 
    finally {
      setLoading(false);
    }
  };

  // Helper function to get the resume's data from DB and return the JSON
  const fetchResumeData = async () => {
    try {
      const response = await fetch(`https://localhost:7035/api/Resume/GetResumeById/${resumeId}`);

      if (!response.ok) {
        showToast("Failed to fetch resume", "error");
        console.error("Failed to fetch resume:", error.message);
        throw new Error("Failed to fetch resume");
      }

      return response.json();
    } 
    catch (error) {
      showToast("An (catch) error occurred", "error");
      console.error("Catch block error:", error.message);
      return null;
    }
  }

  // Helper function to fetch an insight from the DB, if it exists
  const fetchExistingInsight = async (resumeId) => {
    try {
      const response = await fetch(`https://localhost:7035/api/Resume/GetInsight/${resumeId}`);

      if (!response.ok) return null;

      return response.json(); // If an insight exists, it will return (if not, null gets returned)
    }
    catch {
      showToast("Error fetching insight", "error");
      return null;
    }
  }

  // Helper function to hit the ScoreResume endpoint and get the AI analysis
  const getAIAnalysis = async(resumeJson) => {
    try {
      const resumeJsonNoThumbnail = { ...resumeJson, thumbnail: "" };
      console.log("NO thumbnail:", resumeJsonNoThumbnail);

      const response = await fetch('https://localhost:7035/api/Chat/ScoreResume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData: JSON.stringify(resumeJsonNoThumbnail),jobTitle: jobTitle }),
      });

      if (!response.ok) {
        showToast("Failed to get AI analysis", "error");
        throw new Error("Failed to get AI analysis.");
      }

      const responseJson = await response.json();

      return responseJson;
    }
    catch {
      showToast("A (catch) error occurred.", "error");
      return null;
    }
  }

  // Helper function to get a new insight (analyze)
  const fetchNewInsight = async (resumeJson) => {
      setLoading(true);

      try {
        // Run AI analysis
        const aiResponse = await getAIAnalysis(resumeJson);
        const aiContentStr = aiResponse.choices[0]?.message?.content;

        if (aiContentStr) {
          const cleanedAiContentStr = aiContentStr.replace(/,\s*}/g, "}").replace(/,\s*\]/g, "]"); // Remove trailing commas before closing } and closing ]
          const aiJsonObj = JSON.parse(cleanedAiContentStr);
          setAiResult(aiJsonObj); // Store AI content as JSON object

          await saveInsight(resumeId, aiJsonObj);
        } 
        else {
          showToast("No AI content returned", "error", "Uh oh!");
          throw new Error("No AI content returned");
        } 
      }
      catch (err) {
        setError(err.message);
      } 
      finally {
        setLoading(false);
      }
      
  }

  // Helper function to save insight to the database
  const saveInsight = async (resumeId, aiJsonObj) => {
    try {
      const response = await fetch('https://localhost:7035/api/Resume/AddInsight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId, content: JSON.stringify(aiJsonObj) }),
      });

      if (!response.ok) {
        showToast("Failed to save Insights", "error");
        throw new Error("Failed to save insights.");
      }

      showToast("AI Insights saved successfully", "success");
    } 
    catch (error) {
      showToast("Failed to save Insights (catch)", "error");
      console.error("Failed to save insights.", error.message);
    }
  }

  // Helper function to delete insight
  const deleteInsight = async(resumeId) => {
    if (!window.confirm("Are you sure you want to re-analyze? The current suggestions will be deleted.")) return;

    const response = await fetch(`https://localhost:7035/api/Resume/DeleteInsight/${resumeId}`,
    {
        method: 'DELETE',
    });

    if (!response.ok) {
      showToast("Error deleting insight.", "error");
      throw new Error("Failed to delete insight.");
    }

    showToast("Insight removed successfully", "success");
    setAiResult(null);

    // return response;
  }

  return (
    <AuthorizeView>
      <div className="header-with-btn">
        <div className="page-header">
          <h1>Resume Insights</h1>
          <p>Use Artificial Intelligence to evaluate your resume.</p>
        </div>
        {aiResult && (
          <div className="reanalyze-text">
            <button type="button" className="btn btn-black" onClick={() => deleteInsight(resumeId)}>
                <img src="/assets/icons/sparkles.svg" draggable="false" />
                <span>Reanalyze</span>
            </button>
          </div>
        )}
      </div>
      

      {!aiResult && !loading && (
        <div className="refine-ctnr">
          <h3>Welcome to Insights!</h3>
          <p>
            Looking for feedback on your resume? The Resume Pro AI Assistant is here to help! <br/>
            Want tailored suggestions? Enter your desired role before submitting <em>or</em> leave it blank for a general review.  
          </p>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="Enter your desired role  (e.g., Software Engineer, Recruiter, Customer Service Rep)"
          />
          <button 
            className="btn btn-black"
            onClick={() => fetchNewInsight(resumeData)}
          >
            <img src="/assets/icons/sparkles.svg" draggable="false" />
            <span>Analyze</span>
          </button>
        </div>
      )}

      <div className="resume-insights-ctnr">
      {loading && (
          <div className="loading-spinner-container">
            <div className="loading-spinner"></div>
            <div className="loading-message">
              <span>{loadingMessages[loadingMessageIndex]}</span>
            </div>
          </div>
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* AI feedback */}
        {aiResult && (
          <div className="feedback-ctnr">
            <div className="feedback-head">
              <div className="feedback-title">
                <img src="/assets/icons/sparkles.svg" draggable="false" />
                <h2>Recommendations for "{resumeData.resumeName}"</h2>
              </div>
              <div className="feedback-title">
                <div className="info-item">
                  <img 
                    src="/assets/icons/info.svg" 
                    draggable="false" 
                    className="info-icon"
                    onClick={toggleDisclaimer}
                  />
                  <AnimatePresence>
                    {showDisclaimer && (
                      <motion.div
                        className="info-txt"
                        initial={{ opacity: 0, y: -10}}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                      >
                        <span>
                          <b>Disclaimer:</b> <br/>
                          This AI-powered resume analysis tool utilizes OpenAI’s ChatGPT API to generate insights and suggestions. 
                          While we strive to provide helpful and relevant feedback, AI-generated responses can be unpredictable, 
                          inaccurate, or subjective. The information provided should not be considered professional career advice, 
                          and users should exercise their own judgment when making decisions based on AI-generated insights. The 
                          creators of this application are not responsible for any errors, omissions, or unintended consequences 
                          resulting from its use. By using this tool, you acknowledge and accept these limitations.
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {Object.entries(aiResult).map(([section, data], index) => (
              <motion.div 
                key={section} 
                className="feedback-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: `${index * 0.2}` }}
              >
                <div>
                  <h3>{section}</h3>
                  <p>{data.comments}</p>
                </div>
                <div className={`score ${getScoreColorClass(data.score)}`}>
                  <div className="score-circle"></div>
                  <p>{data.score}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AuthorizeView>
  );
}

export default ResumeInsights;