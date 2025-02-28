using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Text.Json;
using Newtonsoft.Json;
using System;
using System.IO;
using Microsoft.AspNetCore.Identity;
using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using Microsoft.Extensions.Logging;
using ResumeProProject.Server.Data.Models;
using Microsoft.Extensions.Configuration;
using ResumeProProject.Server.Services;
using Microsoft.Extensions.Hosting.Internal;

[ApiController]
[Route("/api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<ChatController> _logger;
    private string _apiKey;
    private readonly OpenAIService _openAIService;
    private readonly IWebHostEnvironment _env;

    public ChatController(IWebHostEnvironment env, ILogger<ChatController> logger, OpenAIService openAIService)
    {
        _env = env;
        _httpClient = new HttpClient();
        _logger = logger;
        _openAIService = openAIService;
        _apiKey = _openAIService.GetApiKey();

        _logger.LogInformation("Environment: " + _env.EnvironmentName);

        if (string.IsNullOrEmpty(_apiKey))
        {
            //throw new Exception("API key is missing. Check OPENAI_API_KEY_PROD in GitHub Secrets.");
            throw new Exception("API key is missing. Check Azure Key Vault.");
        }

    }


    [HttpPost("ScoreResume")]
    public async Task<IActionResult> ScoreResume([FromBody] OpenAiRequest request)
    {
        System.Diagnostics.Debug.WriteLine("|" +    request.jobTitle + "|");
        var apiUrl = "https://api.openai.com/v1/chat/completions";

        //string stringifiedPayload= JsonConvert.SerializeObject(request.Message);
        ////stringifiedPayload = stringifiedPayload.Append();
        //string escapedJson = JsonConvert.ToString(stringifiedPayload);
        //string killQuotes = request.Message.Trim('"');
        //string filePath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "Prompt", "ChadPrompt.txt");
        //string basePath = _env.ContentRootPath; // Works for both Dev & Prod
        //string relativePath = Path.Combine("Data", "Prompt", "ChadPrompt.txt");
        //string filePath = Path.Combine(basePath, relativePath);

        //if (!System.IO.File.Exists(filePath))
        //{
        //    Console.WriteLine($"File Not Found: {filePath}");
        //    throw new Exception($"Prompt file is missing: {filePath}");
        //}

        //string promptText = System.IO.File.ReadAllText(filePath);
        string promptText = GetPrompt();
        //System.Diagnostics.Debug.WriteLine(promptText);
        string toSend = "";
        if(request.jobTitle.Length > 0)
        {
             toSend = request.resumeData + "   This person is applying for this position :  " + request.jobTitle + ", so make sure the feeback for all sections is tailored for that position. Please note also, that since they" +
                "are applying for a specific job type, you must review their resume with extreme scrutiny; do NOT award points for simply having sections filled out, you need to evaluate if they are even fit to be working in the field they listed." +
                "Also take into consideration the role they are applying for and their credentials. If a role is outlandish based on their experience/education do not mince your words. At the same time, if they are greatly overqualified for a role, make sure to score them higher (for example, if a doctor is applying for a medical assistant job, or a store manager for a cashier role, etc.).";
        }else {  toSend = request.resumeData; }
        var requestBody = new
        {
            model = "gpt-4",
            messages = new[]
            {
                 new { role = "system", content = promptText },
                new { role = "user", content = toSend}
            }
        };

        var json = JsonConvert.SerializeObject(requestBody);
        var content1 = new StringContent(json, Encoding.UTF8, "application/json");
        

        _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_apiKey}");

        var response = await _httpClient.PostAsync(apiUrl, content1);
        var responseString = await response.Content.ReadAsStringAsync();
        System.Diagnostics.Debug.WriteLine(responseString);
        // Handle API errors
        if (!response.IsSuccessStatusCode)
        {
            try
            {
                var errorResponse = JsonConvert.DeserializeObject<dynamic>(responseString);
                string errorMessage = errorResponse?.error?.message ?? "Unknown API error.";

                if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
                {
                    return StatusCode(401, "Invalid API key. Check your OpenAI credentials.");
                }
                if (response.StatusCode == System.Net.HttpStatusCode.PaymentRequired ||
                    errorMessage.ToLower().Contains("insufficient_quota") ||
                    errorMessage.ToLower().Contains("credit"))
                {
                    return StatusCode(402, "Insufficient OpenAI API credits. Please check your billing settings.");
                }

                return StatusCode((int)response.StatusCode, errorMessage);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine("Error parsing OpenAI error response: " + ex.Message);
                return StatusCode(500, "Unexpected error while processing OpenAI response.");
            }
        }

        return Content(responseString, "text/plain");
    }

    private string GetPrompt()
    {
        return @"
        ----YOUR ROLE------------
        You are a Resume Scorer using the ATS (Applicant Tracking System) standards. Take this JSON file, which contains the full data of a resume, and provide a detailed score for each section as well as an overall score.
        The order for feedback to appear in by section:
        Overall Score > ATS Optimization > General Information > Experience > Education > Projects > Certifications > Skills > Completeness, evaluate the following factors:

        Relevance and Depth of Content: Does the content align with industry standards? Does it provide enough detail about the applicant’s qualifications, achievements, and responsibilities? Does it address key aspects of the job being applied for?

        Grammar and Clarity: Is the writing clear and concise? Are there any spelling, grammar, or punctuation mistakes? Does the resume effectively communicate the applicant’s strengths without unnecessary jargon?

        ATS Optimization: Does the resume include relevant keywords for the specific job or industry? Is the resume formatted in a way that would pass through ATS algorithms?

        Completeness: Are all key sections filled out with relevant information? Some sections may be blank depending on the role, but sections such as skills should at least have something.

        For each section, provide a detailed score on a scale of 1 to 10, where 1 is poor and 10 is excellent. Include comments on why you assigned the score, with specific feedback on what could be improved.
        --------END OF YOUR ROLE--------------
        --------GRADING CONSIDERATIONS---------
        Do not automatically give a perfect score just for having fields filled out – detail, relevance, and quality of content matter more. If a category is completely empty, automatically give it a 0.
        Penalize a candidate if they have incomplete general information, or if their contact information is innapropriate, but do not let that category influence the overall score too much.
        Categories such as Experience, Education, and Projects should carry the most weight.
        As for the skills section, ensure relevance to their current job function and/or for the job they are applying too. Skills should be professional and related to a job functionality.
        The overall score should be the total of awarded points for each category out of all possible points for each category, but be sure to scale it so that its out of 100 (and round up to the nearest whole number)
        Also, please ignore the github URL if the candidates resume does not contain any references to the IT field or if they haven't specified that they want to go into IT.
        Additionally, experience matters. If a candidate has extensive experience in a particular field, make sure you put emphasis on that as opposed to their education (experience in a field for 20 years supercedes a degree in an unrelated field).
        For the projects field, use your discretion and determine what fields would have projects. If the candidate is working in an industry or has educational background that wouldnt make sense to have projects for, dont penalize them too heavily.
        Finally, provide an overall score out of 100, reflecting the overall quality of the resume. Your feedback should be raw, candid, and focus on areas for improvement. Do not sugarcoat your comments, as the goal is to help the applicant enhance their resume to a higher standard. 
        IMPORTANT NOTE: IGNORE THE HTML TAGS IN THE DESCRIPTION FIELDS, DO NOT REFERENCE THOSE IN YOUR FEEDBACK, AND DO NOT TAKE OFF ANY POINTS FOR THEM.
        -------END OF GRADING CONSIDERATIONS----


        -------OUTPUT INSTRUCTIONS------------
        Adhere to the following instructions for what your output should look like:
        Format your response like so:

        {
          ""Overall Score"": {
            ""score"": ""81/100"",
            ""comments"": ""Jacob's resume shows strong credentials for the Lead Graphic Designer position he's applying for, with relevant education and experience in the field. However, it could still use some improvements in content depth and ATS optimization.""
          },
          ""ATS Optimization"": {
            ""score"": ""7/10"",
            ""comments"": ""The resume lacks sufficient industry keywords and could benefit from incorporating more action verbs related to the job role. More usage of specific Graphic design software in both experience and skills section could make the resume more ATS friendly.""
          },
          ""General Information"": {
            ""score"": ""9/10"",
            ""comments"": ""Jacob's contact information is complete and professionally appropriate. His role and location are clearly stated, which further indicates his suitability for the role. The personal website could be a great showcase of his portfolio, which is a plus.""
          },
          ""Experience"": {
            ""score"": ""8/10"",
            ""comments"": ""His experience is relevant and displays a progression in duties and responsibilities, which aligns well with the target job of Lead Graphic Designer. However, greater depth in explaining his specific achievements would have been better and quantifying the impacts of his work.""
          },
          ""Education"": {
            ""score"": ""8/10"",
            ""comments"": ""Jacob has a strong educational background that is directly related to his chosen profession. Earning a BA in Graphic Design proves he is knowledgeable in the field. However, indicating related academic projects or achievements could have boosted this score.""
          },
          ""Projects"": {
            ""score"": ""7/10"",
            ""comments"": ""The listed project is relevant. However, listing more projects, specifically complex ones that challenged his skills or demonstrated leadership would bring the score up.""
          },
          ""Certifications"": {
            ""score"": ""9/10"",
            ""comments"": ""His Adobe Certified Expert certification is highly relevant and respected in the industry, which will validate his skills and make him a strong candidate for the role.""
          },
          ""Skills"": {
            ""score"": ""8/10"",
            ""comments"": ""Jacob has a sound range of creative and soft skills. To improve this section, he could include more specific proficiency levels for his software skills and technical skills relevant in Graphic Design.""
          },
          ""Completeness"": {
            ""score"": ""8/10"",
            ""comments"": ""The resume is fundamentally complete, with all major sections covered. More in-depth detail, quantified achievements and showcasing complexity in projects could enhance the document further.""
          }
        }


        ENSURE THE JSON IS PROPERLY FORMATTED!! THIS IS MISSION CRITICAL!
        ----------END OF OUTPUT INSTRUCTIONS--------
                ";
    }

}

public class OpenAiRequest
{
    public string resumeData { get; set; }
    public string jobTitle { get; set; }
}
