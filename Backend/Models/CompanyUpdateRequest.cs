namespace Backend.Models
{
    public class CompanyUpdateRequest
    {
        public string CompanyName { get; set; } = "";
        public decimal Package { get; set; }
        public string EligibilityCriteria { get; set; } = "";
        public string JobDescription { get; set; } = "";
    }
}
