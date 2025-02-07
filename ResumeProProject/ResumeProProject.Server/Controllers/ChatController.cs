using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Text.Json;
using Newtonsoft.Json;

[ApiController]
[Route("/api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey = "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";

    public ChatController()
    {
        _httpClient = new HttpClient();
    }

    [HttpPost("ScoreResume")]
    public async Task<IActionResult> ScoreResume([FromBody] OpenAiRequest request)
    {
        System.Diagnostics.Debug.WriteLine("NORMALIZED:  " +    request.resumeData);
        var apiUrl = "https://api.openai.com/v1/chat/completions";

        //string stringifiedPayload= JsonConvert.SerializeObject(request.Message);
        ////stringifiedPayload = stringifiedPayload.Append();
        //string escapedJson = JsonConvert.ToString(stringifiedPayload);
        //string killQuotes = request.Message.Trim('"');

        var requestBody = new
        {
            model = "gpt-4",
            messages = new[]
            {
                 new { role = "system", content = "You are a Resume Scorer using the ATS (Applicant Tracking System) standards. Take this JSON file, which contains the full data of a resume, and provide a detailed score for each section as well as an overall score. For each section (e.g., Contact Information, Objective, Skills, Experience, Education, Certifications, etc.), evaluate the following factors: 1. Relevance and Depth of Content: Does the content align with industry standards? Does it provide enough detail about the applicant’s qualifications, achievements, and responsibilities? Does it address key aspects of the job being applied for? 2. Grammar and Clarity: Is the writing clear and concise? Are there any spelling, grammar, or punctuation mistakes? Does the resume effectively communicate the applicant’s strengths without unnecessary jargon? 3. ATS Optimization: Does the resume include relevant keywords for the specific job or industry? Is the resume formatted in a way that would pass through ATS algorithms? Does it use proper section headings and structure? 4. Visual and Layout Appeal: Is the resume well-organized, easy to read, and professional-looking? Is the use of white space and font choices appropriate? 5. Completeness: Are all key sections filled out with relevant information? Ensure that if a section is blank, it does not penalize the resume, but note any missing or underdeveloped sections. For each section, provide a detailed score on a scale of 1 to 10, where 1 is poor and 10 is excellent. Include comments on why you assigned the score, with specific feedback on what could be improved. Do not automatically give a perfect score just for having fields filled out – detail, relevance, and quality of content matter more. Finally, provide an overall score out of 100, reflecting the overall quality of the resume. Your feedback should be raw, candid, and focus on areas for improvement. Do not sugarcoat your comments, as the goal is to help the applicant enhance their resume to a higher standard. Separate each section's feedback with '------------------' for clarity."},
                new { role = "user", content = request.resumeData}
            }
        };

        var json = JsonConvert.SerializeObject(requestBody);
        var content1 = new StringContent(json, Encoding.UTF8, "application/json");
        

        _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_apiKey}");

        var response = await _httpClient.PostAsync(apiUrl, content1);
        var responseString = await response.Content.ReadAsStringAsync();
       
        return Content(responseString, "text/plain");
    }
}

public class OpenAiRequest
{
    public string resumeData { get; set; }
}