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
  const [aiResult, setAiResult] = useState(''); // New state to store AI response

  const [showTitleInfo, setShowTitleInfo] = useState(false);
  const [showInputInfo, setShowInputInfo] = useState(false);

  // Call fetchResumeInsights (on mount) to automatically trigger the process
  useEffect(() => {
    if (resumeId) {
      fetchResumeInsights(); 
    }

    // Logic for info textboxes
    const handleClickOutside = (event) => {
      if (!event.target.closest(".info-item")) {
          setShowInputInfo(false);
          setShowTitleInfo(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [resumeId]);

  useEffect(() => {
    
}, []);

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

  const toggleInfoText = (type) => {
    if (type == "title") {
      setShowTitleInfo(!showTitleInfo);
    }
    else if (type == "input") {
      setShowInputInfo(!showInputInfo);
    }
  }

  const fetchResumeInsights = async () => {
    setError('');
    setLoading(true);
    setAiResult(''); // Clear previous AI result

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
      // [Step 4]: If there is NO existing insight, send the resume data to be analyzed by ChatGPT
      else {
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

      if (!response.ok) {
        showToast("No insights yet. Fetching insights...", "info"); // Testing: remove later
        return null;
      }

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
        body: JSON.stringify({ resumeData: JSON.stringify(resumeJsonNoThumbnail) }),
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

  return (
    <AuthorizeView>
      <div className="page-header">
        <h1>Resume Insights</h1>
        <p>Use Artificial Intelligence to evaluate your resume.</p>
      </div>

      <div className="resume-insights-ctnr">
        {loading && (<div className="loading-spinner"></div>)}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* AI feedback */}
        {aiResult && (
          <div className="feedback-ctnr">
            <div className="feedback-head">
              <div className="feedback-title">
                <img src="/assets/icons/sparkles.svg" draggable="false" />
                <h2>"{resumeData.resumeName}"</h2>
              </div>
              <div className="feedback-title">
                <div className="info-item">
                  <img 
                    src="/assets/icons/info.svg" 
                    draggable="false" 
                    className="info-icon"
                    title=""
                    onClick={() => toggleInfoText("input")}
                  />
                  <AnimatePresence>
                    {showInputInfo && (
                      <motion.div
                        className="info-txt"
                        initial={{ opacity: 0, y: 10}}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                      >
                        <span>Enter a job title if you want to tailor your results to a specific role. Re-analyze any time you want (even without a job title).</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <input
                  type="text" 
                  placeholder="Desired job title (optional)" 
                />
                <button className="btn btn-black">Re-analyze</button>
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