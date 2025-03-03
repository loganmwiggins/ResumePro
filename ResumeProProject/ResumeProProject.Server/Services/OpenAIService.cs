namespace ResumeProProject.Server.Services
{
    public class OpenAIService
    {
        public string ApiKey { get; }

        public OpenAIService(string apiKey)
        {
            ApiKey = apiKey ?? throw new ArgumentNullException(nameof(apiKey), "API Key cannot be null.");
        }

        public string GetApiKey()
        {
            return ApiKey;
        }
    }
}
