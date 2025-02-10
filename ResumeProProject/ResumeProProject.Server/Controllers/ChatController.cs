using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Text.Json;
using Newtonsoft.Json;
using System;
using System.IO;

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
        string filePath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "Prompt", "ChadPrompt.txt");
        string promptText = System.IO.File.ReadAllText(filePath);
        System.Diagnostics.Debug.WriteLine(promptText);
        var requestBody = new
        {
            model = "gpt-4",
            messages = new[]
            {
                 new { role = "system", content = promptText },
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