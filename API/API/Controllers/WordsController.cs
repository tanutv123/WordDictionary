using Application.Words;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class WordsController : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetWords([FromQuery] PagingParams param)
        {
            var result = await Mediator.Send(new List.Query
            {
                Params = param
            });
            return HandleResult(result);
        }

        [HttpPost]
        public async Task<IActionResult> AddWord([FromBody] AddWordDto word)
        {
            return HandleResult(await Mediator.Send(new Add.Command { Word = word }));
        }

        [HttpPut]
        public async Task<IActionResult> EditWord([FromBody] EditWordDto word)
        {
            return HandleResult(await Mediator.Send(new Edit.Command { Word = word }));
        }
    }
}
