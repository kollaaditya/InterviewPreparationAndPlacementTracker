using System.Text;
using System.Text.Json;

namespace Backend.Services
{
    public class CodingExecutionService
    {
        private readonly HttpClient _http;
        private readonly IConfiguration _config;

        // Language ID mapping
        public static readonly Dictionary<string, int> LangMap = new()
        {
            { "csharp",  51 },
            { "java",    62 },
            { "cpp",     54 },
            { "python",  71 }
        };

        public CodingExecutionService(HttpClient http, IConfiguration config)
        {
            _http   = http;
            _config = config;
        }

        public async Task<(string Output, string Status)> ExecuteAsync(string sourceCode, int languageId)
        {
            var apiKey  = _config["Judge0:ApiKey"]  ?? "";
            var apiHost = _config["Judge0:ApiHost"] ?? "judge0-ce.p.rapidapi.com";
            var baseUrl = _config["Judge0:BaseUrl"] ?? "https://judge0-ce.p.rapidapi.com";

            // Step 1: Create submission
            var payload = JsonSerializer.Serialize(new
            {
                source_code = sourceCode,
                language_id = languageId,
                stdin       = ""
            });

            var request = new HttpRequestMessage(HttpMethod.Post, $"{baseUrl}/submissions?base64_encoded=false&wait=false");
            request.Content = new StringContent(payload, Encoding.UTF8, "application/json");
            request.Headers.Add("X-RapidAPI-Key",  apiKey);
            request.Headers.Add("X-RapidAPI-Host", apiHost);

            var createRes = await _http.SendAsync(request);
            if (!createRes.IsSuccessStatusCode)
                return ("Execution service unavailable. Check Judge0 API key.", "Error");

            var createJson = await createRes.Content.ReadAsStringAsync();
            using var doc  = JsonDocument.Parse(createJson);
            var token      = doc.RootElement.GetProperty("token").GetString() ?? "";

            // Step 2: Poll for result (max 10 attempts)
            for (int i = 0; i < 10; i++)
            {
                await Task.Delay(1500);
                var pollReq = new HttpRequestMessage(HttpMethod.Get,
                    $"{baseUrl}/submissions/{token}?base64_encoded=false");
                pollReq.Headers.Add("X-RapidAPI-Key",  apiKey);
                pollReq.Headers.Add("X-RapidAPI-Host", apiHost);

                var pollRes  = await _http.SendAsync(pollReq);
                var pollJson = await pollRes.Content.ReadAsStringAsync();

                using var pollDoc  = JsonDocument.Parse(pollJson);
                var statusId       = pollDoc.RootElement.GetProperty("status").GetProperty("id").GetInt32();

                if (statusId > 2) // 1=In Queue, 2=Processing, 3+=Done
                {
                    var stdout  = pollDoc.RootElement.TryGetProperty("stdout",          out var so)  ? so.GetString()  ?? "" : "";
                    var stderr  = pollDoc.RootElement.TryGetProperty("stderr",          out var se)  ? se.GetString()  ?? "" : "";
                    var compile = pollDoc.RootElement.TryGetProperty("compile_output",  out var co)  ? co.GetString()  ?? "" : "";
                    var statusDesc = pollDoc.RootElement.GetProperty("status").GetProperty("description").GetString() ?? "Unknown";

                    var output = !string.IsNullOrWhiteSpace(stdout)  ? stdout
                               : !string.IsNullOrWhiteSpace(stderr)  ? stderr
                               : !string.IsNullOrWhiteSpace(compile) ? compile
                               : "(no output)";

                    return (output.Trim(), statusDesc);
                }
            }

            return ("Execution timed out.", "Timeout");
        }
    }
}
