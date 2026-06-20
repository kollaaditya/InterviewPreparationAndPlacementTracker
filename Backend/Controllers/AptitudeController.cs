using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api")]
    public class AptitudeController : ControllerBase
    {
        private readonly IAptitudeService _service;

        public AptitudeController(IAptitudeService service)
            => _service = service;

        // GET api/aptitudequestions
        [HttpGet("aptitudequestions")]
        public async Task<IActionResult> GetAll()
        {
            var questions = await _service.GetAllQuestionsAsync();
            // Never expose CorrectAnswer to student-facing calls
            return Ok(questions.Select(q => new
            {
                q.QuestionId,
                q.QuestionText,
                q.OptionA,
                q.OptionB,
                q.OptionC,
                q.OptionD,
                q.Category
            }));
        }

        // GET api/aptitudequestions/admin  (exposes correct answer for admin)
        [HttpGet("aptitudequestions/admin")]
        public async Task<IActionResult> GetAllAdmin()
        {
            var questions = await _service.GetAllQuestionsAsync();
            return Ok(questions);
        }

        // POST api/aptitudequestions  (Admin)
        [HttpPost("aptitudequestions")]
        public async Task<IActionResult> Create([FromBody] CreateAptitudeQuestionRequest request)
        {
            var (success, message) = await _service.AddQuestionAsync(request);
            return success ? Ok(message) : BadRequest(message);
        }

        // DELETE api/aptitudequestions/{id}  (Admin)
        [HttpDelete("aptitudequestions/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var (success, message) = await _service.DeleteQuestionAsync(id);
            return success ? Ok(message) : NotFound(message);
        }

        // POST api/aptitude/submit
        [HttpPost("aptitude/submit")]
        public async Task<IActionResult> Submit([FromBody] AptitudeSubmitRequest request)
        {
            var result = await _service.SubmitTestAsync(request);
            return Ok(new
            {
                result.ResultId,
                result.StudentId,
                result.Score,
                result.TotalQuestions,
                Percentage = result.TotalQuestions > 0
                    ? Math.Round((double)result.Score / result.TotalQuestions * 100, 1)
                    : 0,
                result.SubmittedDate
            });
        }

        // GET api/aptitude/results/{studentId}
        [HttpGet("aptitude/results/{studentId}")]
        public async Task<IActionResult> GetResults(int studentId)
        {
            var results = await _service.GetResultsAsync(studentId);
            return Ok(results.Select(r => new
            {
                r.ResultId,
                r.Score,
                r.TotalQuestions,
                Percentage = r.TotalQuestions > 0
                    ? Math.Round((double)r.Score / r.TotalQuestions * 100, 1)
                    : 0,
                r.SubmittedDate
            }));
        }
    }
}
