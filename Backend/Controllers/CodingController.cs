using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api")]
    public class CodingController : ControllerBase
    {
        private readonly ICodingService _service;

        public CodingController(ICodingService service)
            => _service = service;

        // GET api/codingquestions
        [HttpGet("codingquestions")]
        public async Task<IActionResult> GetAll()
        {
            var list = await _service.GetAllQuestionsAsync();
            return Ok(list.Select(MapQuestion));
        }

        // GET api/codingquestions/{id}
        [HttpGet("codingquestions/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var q = await _service.GetQuestionByIdAsync(id);
            if (q == null) return NotFound("Question not found");
            return Ok(MapQuestion(q));
        }

        // POST api/codingquestions  (Admin)
        [HttpPost("codingquestions")]
        public async Task<IActionResult> Create([FromBody] CreateCodingQuestionRequest request)
        {
            var (success, message) = await _service.CreateQuestionAsync(request);
            return success ? Ok(message) : BadRequest(message);
        }

        // DELETE api/codingquestions/{id}  (Admin)
        [HttpDelete("codingquestions/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var (success, message) = await _service.DeleteQuestionAsync(id);
            return success ? Ok(message) : NotFound(message);
        }

        // POST api/coding/run
        [HttpPost("coding/run")]
        public async Task<IActionResult> Run([FromBody] RunCodeRequest request)
        {
            var output = await _service.RunCodeAsync(request);
            return Ok(new { output });
        }

        // POST api/coding/submit
        [HttpPost("coding/submit")]
        public async Task<IActionResult> Submit([FromBody] SubmitCodeRequest request)
        {
            var submission = await _service.SubmitCodeAsync(request);
            return Ok(new
            {
                submission.SubmissionId,
                submission.StudentId,
                submission.QuestionId,
                submission.Language,
                submission.Output,
                submission.Status,
                submission.SubmittedAt
            });
        }

        // GET api/coding/submissions/{studentId}
        [HttpGet("coding/submissions/{studentId}")]
        public async Task<IActionResult> GetSubmissions(int studentId)
        {
            var list = await _service.GetSubmissionsAsync(studentId);
            return Ok(list.Select(s => new
            {
                s.SubmissionId,
                s.QuestionId,
                QuestionTitle = s.CodingQuestion?.Title ?? "—",
                s.Language,
                s.Output,
                s.Status,
                s.SubmittedAt
            }));
        }

        private static object MapQuestion(CodingQuestion q) => new
        {
            q.QuestionId,
            q.Title,
            q.Description,
            q.InputFormat,
            q.OutputFormat,
            q.SampleInput,
            q.SampleOutput,
            q.Difficulty,
            q.Language,
            q.CreatedAt
        };
    }
}
