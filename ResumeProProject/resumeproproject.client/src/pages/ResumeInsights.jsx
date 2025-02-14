import { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";

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

  useEffect(() => {
    if (resumeId) {
      handleSubmit(); // Call handleSubmit to automatically trigger the process
    }
  }, [resumeId]);

  const getScoreColorClass = (score) => {
    if (!score) return ""; // Handle missing score

    const [numerator, denominator] = score.split("/").map(Number); // Convert to numbers

    if (isNaN(numerator) || isNaN(denominator)) return ""; // Ensure valid numbers

    const percentage = (numerator / denominator) * 100; // Convert to percentage

    if (percentage >= 80) return "circle-green";  
    if (percentage >= 50) return "circle-yellow";  
    return "circle-red";  // Ensure 0% falls in this range
  };

  const handleSubmit = async (e) => {
    // e.preventDefault();
    setError('');
    setLoading(true);
    setAiResult(''); // Clear previous AI result

    try {
      // Step 1: Fetch the resume JSON
      const response = await fetch(`https://localhost:7035/api/Resume/GetResumeById/${resumeId}`);

      if (!response.ok) {
        showToast("Failed to fetch resume", "error");
        throw new Error("Failed to fetch resume"); 
      }

      const resumeJson = await response.json();
      const resumeJsonNoThumbnail = resumeJson;
      resumeJsonNoThumbnail.thumbnail = "";

      setResumeData(resumeJson);
      
      const resumeString = JSON.stringify(resumeJson);

      const insightResponse = await fetch(`https://localhost:7035/api/Resume/GetInsight/${resumeId}`);

      if (!response.ok) {
        showToast("Failed to fetch Insights", "error");
        throw new Error("Failed to fetch Insights"); 
      }
     
      if (!insightResponse.ok) {
        // Step 2: Send the JSON to another API
        const aiResponse = await fetch(`https://localhost:7035/api/Chat/ScoreResume`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({resumeData: resumeString}),
        });

        if (!aiResponse.ok) {
          showToast("Failed to send resume to AI", "error", "Oh no!");
          throw new Error("Failed to send resume to AI");
        }

        const aiResult = await aiResponse.json();
        const aiContent = aiResult.choices[0]?.message?.content;
        console.log(aiContent);

        if (aiContent) {
          try {
            const cleanedJson = aiContent.replace(/,\s*}/g, "}").replace(/,\s*\]/g, "]"); // Remove trailing commas before closing } and closing ]
            const aiJsonObj = JSON.parse(cleanedJson);
            console.log("JSON object:", aiJsonObj);
            setAiResult(aiJsonObj); // Store AI content as JSON object

            const saveResponse = await fetch(`https://localhost:7035/api/Resume/AddInsight`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                resumeId: resumeId,
                content: JSON.stringify(aiJsonObj)
              }),
              
            });
            console.log(saveResponse);
            if (!saveResponse.ok) {
              showToast("Failed to save AI insights", "error", "Database Error");
              throw new Error("Failed to save AI insights");
            }

            showToast("AI insights saved successfully", "success", "Done!");
          }
          catch (error) {
            console.error("Error parsing JSON:", error);
          }
        } 
        else {
          showToast("No AI content returned", "error", "Uh oh!");
          throw new Error("No AI content returned");
        } 
      }
      else {
        const insightContent = await insightResponse.text()
        try {
          const parsedInsight = JSON.parse(insightContent); 
          console.log("Parsed Insight JSON:", parsedInsight);
          setAiResult(parsedInsight); 
        } catch (error) {
          console.error("Error parsing insight content:", error);
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
            <h2>"{resumeData.resumeName}"</h2>

            {Object.entries(aiResult).map(([section, data]) => (
              <div key={section} className="feedback-item">
                <div>
                  <h3>{section}</h3>
                  <p>{data.comments}</p>
                </div>
                <div className="score">
                  <h2>{data.score}</h2>
                  <div className={`score-circle ${getScoreColorClass(data.score)}`}></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AuthorizeView>
  );
}

export default ResumeInsights;