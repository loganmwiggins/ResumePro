import { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { API_BASE_URL } from '../utils/BaseUrl';
import '../stylesheets/ResumeInsights.css';
import AuthorizeView from '../components/AuthorizeView';
import { showToast } from '../utils/Toast';
import { loadingMessages } from '../utils/Messages';
//import { BoxesLoader } from "react-awesome-loaders";
import AllTemplates from "../components/templates/AllTemplates";

function ResumeInsights() {
  const navigate = useNavigate();
  const params = useParams();
  const [resumeId, setResumeId] = useState(params.resumeId || '');
  const [resumeLoading, setResumeLoading] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [error, setError] = useState('');
  const [resumeData, setResumeData] = useState(null);
  const [aiResult, setAiResult] = useState(null); // New state to store AI response
  const [jobTitle, setJobTitle] = useState('');
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const LazyBoxesLoader = lazy(() => import("react-awesome-loaders").then(mod => ({ default: mod.BoxesLoader })));

  useEffect(() => {
    // Call fetchResumeInsights (on mount) to automatically trigger the process
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
    if (analysisLoading) {
      const interval = setInterval(() => {
        setLoadingMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
      }, 3000); // Change message every 3 seconds

      return () => clearInterval(interval); // Clean up the interval when the component is unmounted
    }
  }, [analysisLoading]);

  // Determine div color based on AI score
  const getScoreColorClass = (score) => {
    if (!score) return ""; // Handle missing score

    const [numerator, denominator] = score.split("/").map(Number); // Convert to numbers

    if (isNaN(numerator) || isNaN(denominator)) return ""; // Ensure valid numbers

    const percentage = (numerator / denominator) * 100; // Convert to percentage

    if (percentage >= 80) return "score-green";  
    if (percentage >= 50) return "score-yellow";  
    return "score-red";  // Ensure 0% falls in this range
  };

  // AI content disclaimer
  const toggleDisclaimer = () => {
    setShowDisclaimer(!showDisclaimer);
  }

  const fetchResumeInsights = async () => {
    setError('');
    setResumeLoading(true);

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
      setResumeLoading(false);
    }
  };

  // Helper function to get the resume's data from DB and return the JSON
  const fetchResumeData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Resume/GetResumeById/${resumeId}`);

      if (!response.ok) {
        showToast("Failed to fetch resume", "error");
        console.error("Failed to fetch resume:", error.message);
        throw new Error("Failed to fetch resume");
        }

        const data = await response.json();

        if (data.skills?.skillsDataJson) {
            try {
                data.skills.skillsDataJson = JSON.parse(data.skills.skillsDataJson);
            } catch (error) {
                console.error("Error parsing skillsDataJson:", error);
                data.skills.skillsDataJson = {};
            }
        }

        setResumeData(data);

      return data;
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
      const response = await fetch(`${API_BASE_URL}/api/Insight/GetInsight/${resumeId}`);

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

      const response = await fetch(`${API_BASE_URL}/api/Chat/ScoreResume`, {
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
      setAnalysisLoading(true);

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
        setAnalysisLoading(false);
      }
  }

  // Helper function to save insight to the database
  const saveInsight = async (resumeId, aiJsonObj) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Insight/AddInsight`, {
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

    const response = await fetch(`${API_BASE_URL}/api/Insight/DeleteInsight/${resumeId}`,
    {
        method: 'DELETE',
    });

    if (!response.ok) {
      showToast("Error deleting insight.", "error");
      throw new Error("Failed to delete insight.");
    }

    showToast("Insight removed successfully", "success");
    setAiResult(null);
  }

  const handleToggleResume = () => {
    setShowResume(!showResume);
  }


  return (
    <AuthorizeView>
      <div className="header-with-btn">
        <div className="page-header">
          <h1>Resume Insights</h1>
          <p>Use Artificial Intelligence to evaluate your resume.</p>
        </div>

        {aiResult && (
          <div className="reanalyze-ctnr">
            <button type="button" className="btn btn-outline btn-show" onClick={handleToggleResume}>
              <img src="/assets/icons/document.svg" className="icon-dynamic" draggable="false" />
              <span>{showResume ? "Hide" : "Show"} Resume</span>
            </button>
            <button type="button" className="btn btn-black" onClick={() => deleteInsight(resumeId)}>
                <img src="/assets/icons/sparkles.svg" draggable="false" />
                <span>Reanalyze</span>
            </button>
          </div>
        )}
      </div>

      {resumeLoading && (
        <div className="refine-ctnr">
          <div className="loading-spinner"></div>
        </div>
      )}
      
      {!aiResult && !resumeLoading && !analysisLoading && (
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
              {analysisLoading && (
                  <div className="loader-center">
                      <div className="loading-message">
                          <span>{loadingMessages[loadingMessageIndex]}</span>
                      </div>
                      <Suspense fallback={<div>Loading animation...</div>}>
                          <LazyBoxesLoader boxColor={"#2c6fff"} size={"100px"} />
                      </Suspense>
                  </div>
              )}


        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* AI feedback */}
        {aiResult && (
          <div className="feedback-ctnr">
            {/* Feedback header */}
            <div className="feedback-head">
              <div className="feedback-title">
                <img src="/assets/icons/sparkles.svg" className="icon-dynamic" draggable="false" />
                <h2>Recommendations for "{resumeData.resumeName}"</h2>
              </div>
              <div className="feedback-title">
                <div className="info-item">
                  <img 
                    src="/assets/icons/info.svg" 
                    draggable="false" 
                    className="icon-dynamic info-icon"
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

            

            <div className="side-by-side">
              {/* Resume preview */}
              {showResume && (
                <AnimatePresence>
                  <motion.div
                    className="resume-view"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.6 }}
                  >
                      {/*<div>*/}
                        {/*    <AllTemplates selectedTemplate={resumeData.templateId} resumeData={resumeData} viewMode="preview" />*/}
                      {/*</div>*/}
                      <div className="resume-preview-wrapper">
                          <AllTemplates selectedTemplate={resumeData.templateId} resumeData={resumeData} />
                      </div>
                  </motion.div>
                </AnimatePresence>
              )}

              {/* Feedback items */}
              <div
                className="feedback-items-ctnr"
                style={showResume ? {height: "825px", padding: "1rem 2rem", overflowY: "scroll"} : {}}
              >
                {Object.entries(aiResult).map(([section, data], index) => (
                  <motion.div 
                    key={section} 
                    className="feedback-item"
                    style={showResume ? {flexDirection: "column", gap: ".5rem", alignItems: "start"} : {}}
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
            </div>
          </div>
        )}
      </div>
    </AuthorizeView>
  );
}

export default ResumeInsights;