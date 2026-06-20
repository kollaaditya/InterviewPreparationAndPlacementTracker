using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api")]
    public class CommunicationController : ControllerBase
    {
        private readonly ICommunicationService _service;

        public CommunicationController(ICommunicationService service)
            => _service = service;

        // GET api/communicationquestions
        [HttpGet("communicationquestions")]
        public async Task<IActionResult> GetAll()
        {
            var questions = await _service.GetAllQuestionsAsync();
            return Ok(questions.Select(q => new
            {
                q.QuestionId,
                q.QuestionText,
                q.OptionA,
                q.OptionB,
                q.OptionC,
                q.OptionD,
                q.Topic
            }));
        }

        // GET api/communicationquestions/admin
        [HttpGet("communicationquestions/admin")]
        public async Task<IActionResult> GetAllAdmin()
        {
            var questions = await _service.GetAllQuestionsAsync();
            return Ok(questions);
        }

        // POST api/communicationquestions  (Admin)
        [HttpPost("communicationquestions")]
        public async Task<IActionResult> Create([FromBody] CreateCommunicationQuestionRequest request)
        {
            var (success, message) = await _service.AddQuestionAsync(request);
            return success ? Ok(message) : BadRequest(message);
        }

        // DELETE api/communicationquestions/{id}  (Admin)
        [HttpDelete("communicationquestions/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var (success, message) = await _service.DeleteQuestionAsync(id);
            return success ? Ok(message) : NotFound(message);
        }

        // POST api/communication/submit
        [HttpPost("communication/submit")]
        public async Task<IActionResult> Submit([FromBody] CommunicationSubmitRequest request)
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

        // GET api/communication/results/{studentId}
        [HttpGet("communication/results/{studentId}")]
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
