using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Text.Json;
using Newtonsoft.Json;
using System;
using System.IO;
using Microsoft.AspNetCore.Identity;

[ApiController]
[Route("/api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    public ChatController(IWebHostEnvironment env)
    {
        _httpClient = new HttpClient();

        // Hardcoded Dev API Key
        if (env.IsDevelopment())
        {
            _apiKey = "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";
        }
        else
        {
            // Use GitHub Secret in Prod
            Console.WriteLine("It thinks its in prod");
            _apiKey = Environment.GetEnvironmentVariable("OPENAI_API_KEY_PROD");
        }

        if (string.IsNullOrEmpty(_apiKey))
        {
            throw new Exception("API key is missing. Check OPENAI_API_KEY_PROD in GitHub Secrets.");
        }
        Console.WriteLine($"Using API Key: {_apiKey}");
        //Console.WriteLine($"Using API Key: {(_apiKey != null ? "Loaded Successfully" : "MISSING!")}");
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
        string filePath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "Prompt", "ChadPrompt.txt");
        string promptText = System.IO.File.ReadAllText(filePath);
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
        return Content(responseString, "text/plain");
    }
}

public class OpenAiRequest
{
    public string resumeData { get; set; }
    public string jobTitle { get; set; }
}