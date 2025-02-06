using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Text.Json;

[Route("api/openai")]
[ApiController]
public class ChatController : ControllerBase
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey = "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";

    public ChatController()
    {
        _httpClient = new HttpClient();
    }

    [HttpPost("chat")]
    public async Task<IActionResult> GetOpenAiResponse([FromBody] OpenAiRequest request)
    {
        var apiUrl = "https://api.openai.com/v1/chat/completions";
   
        var requestBody = new
        {
            model = "gpt-4",
            messages = new[]
            {
                 new { role = "system", content = "You are a Resume Scorer Using the ATS System. Take this json file which has all the data of a resume, and using the ATS standards, provide a score on each " +
                 " section as well as a final overall score. De-limit each sections score with '------------------, so that the output is more readable. Make sure you put an emphasis on the level of detail in the resume, as well as grammar and overall content. You do not have to be friendly, raw feedback is encouraged. Additionally, if a section is blank, do not penalize the user for that. Put yourself in the role of a recruiter." },
                new { role = "user", content = request.Message}
            }
        };

        var json = JsonSerializer.Serialize(requestBody);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_apiKey}");

        var response = await _httpClient.PostAsync(apiUrl, content);
        var responseString = await response.Content.ReadAsStringAsync();
       
        return Content(responseString, "text/plain");
    }
}

public class OpenAiRequest
{
    public string Message { get; set; }
}