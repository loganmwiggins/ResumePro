import { useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";

import '../stylesheets/ResumeInsights.css';
import AuthorizeView from '../components/AuthorizeView';

function ResumeInsights() {
  const navigate = useNavigate();
  const params = useParams();

  const [resumeId, setResumeId] = useState(params.resumeId || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resumeData, setResumeData] = useState(null);
  const [aiResult, setAiResult] = useState(''); // New state to store AI response

  console.log(resumeId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setAiResult(''); // Clear previous AI result

    try {
      // Step 1: Fetch the resume JSON
      const response = await fetch(`https://localhost:7035/api/Resume/GetResumeById/${resumeId}`);
      if (!response.ok) throw new Error('Failed to fetch resume');
      const resumeJson = await response.json();
      setResumeData(resumeJson);
      
      const resumeString = JSON.stringify(resumeJson);
      // Step 2: Send the JSON to another API
      const aiResponse = await fetch(`https://localhost:7035/api/Chat/ScoreResume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({resumeData: resumeString}),
      });

      if (!aiResponse.ok) throw new Error('Failed to send resume to AI');

      const aiResult = await aiResponse.json();
      const aiContent = aiResult.choices[0]?.message?.content;
      if (aiContent) {
        const formattedContent = aiContent.replace(/\n/g, '<br />');
        setAiResult(formattedContent); // Store AI content
      } else {
        throw new Error('No AI content returned');
      }
      console.log('AI Response:', aiResult); // Handle this as needed

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthorizeView>
      <div className="page-header">
        <h1>Resume Insights</h1>
        <p>Use Artificial Intelligence to evaluate your resume</p>
      </div>

      <div className="resume-insights-ctnr">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            id="resumeInput"
            value={resumeId}
            onChange={(e) => setResumeId(e.target.value)}
            placeholder="Enter Resume ID"
          />
          <button type="submit" disabled={loading}>Submit</button>
        </form>

        {loading && <div className='loading-spinner'></div>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* Display AI response */}
        {aiResult && (
          <div className="ai-result">
            <h3>AI Scoring Results</h3>
            <p dangerouslySetInnerHTML={{ __html: aiResult }} />
          </div>
        )}

        {/* {resumeData && <pre>{JSON.stringify(resumeData, null, 2)}</pre>} */}
      </div>
    </AuthorizeView>
  );
}

export default ResumeInsights;