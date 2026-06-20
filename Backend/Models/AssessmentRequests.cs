namespace Backend.Models
{
    // ── Coding ─────────────────────────────────────────────────────────────────
    public class RunCodeRequest
    {
        public string SourceCode { get; set; } = "";
        public int    LanguageId { get; set; }
    }

    public class SubmitCodeRequest
    {
        public int    StudentId  { get; set; }
        public int    QuestionId { get; set; }
        public string Language   { get; set; } = "";
        public string SourceCode { get; set; } = "";
        public int    LanguageId { get; set; }
    }

    public class CreateCodingQuestionRequest
    {
        public string Title        { get; set; } = "";
        public string Description  { get; set; } = "";
        public string InputFormat  { get; set; } = "";
        public string OutputFormat { get; set; } = "";
        public string SampleInput  { get; set; } = "";
        public string SampleOutput { get; set; } = "";
        public string Difficulty   { get; set; } = "Easy";
        public string Language     { get; set; } = "Any";
    }

    // ── Aptitude ───────────────────────────────────────────────────────────────
    public class AptitudeSubmitRequest
    {
        public int StudentId { get; set; }
        public List<AptitudeAnswer> Answers { get; set; } = new();
    }

    public class AptitudeAnswer
    {
        public int    QuestionId     { get; set; }
        public string SelectedOption { get; set; } = ""; // "A" | "B" | "C" | "D"
    }

    public class CreateAptitudeQuestionRequest
    {
        public string QuestionText  { get; set; } = "";
        public string OptionA       { get; set; } = "";
        public string OptionB       { get; set; } = "";
        public string OptionC       { get; set; } = "";
        public string OptionD       { get; set; } = "";
        public string CorrectAnswer { get; set; } = "";
        public string Category      { get; set; } = "";
    }

    // ── Communication ──────────────────────────────────────────────────────────
    public class CommunicationSubmitRequest
    {
        public int StudentId { get; set; }
        public List<CommunicationAnswer> Answers { get; set; } = new();
    }

    public class CommunicationAnswer
    {
        public int    QuestionId     { get; set; }
        public string SelectedOption { get; set; } = "";
    }

    public class CreateCommunicationQuestionRequest
    {
        public string QuestionText  { get; set; } = "";
        public string OptionA       { get; set; } = "";
        public string OptionB       { get; set; } = "";
        public string OptionC       { get; set; } = "";
        public string OptionD       { get; set; } = "";
        public string CorrectAnswer { get; set; } = "";
        public string Topic         { get; set; } = "";
    }
}
