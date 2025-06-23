using API.Extensions;
using Application.Core;
using Application.Words;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaseApiController : ControllerBase
    {
        private IMediator _mediator;

        protected IMediator Mediator => _mediator ??= 
            HttpContext.RequestServices.GetService<IMediator>();

        protected ActionResult HandleResult<T>(Result<T> result) 
        {
            if (result == null)
            {
                return NotFound();
            }
            if (result.IsSuccess && result.Error == null)
            {
                return Ok(result.Value);
            }
            else if (result.IsSuccess && result.Value == null)
            {
                return NotFound();
            }
            else
            {
                return BadRequest(result.Error);
            }
        }
        protected ActionResult HandlePagedResult<T>(Result<PaginatedList<T>> result)
        {
            if (result == null)
            {
                return NotFound();
            }
            if (result.IsSuccess && result.Error == null)
            {
                Response.AddPaginationHeader(result.Value.PageNumber, result.Value.PageSize,
                    result.Value.TotalCount, result.Value.TotalPages);
                return Ok(result.Value);
            }
            else if (result.IsSuccess && result.Value == null)
            {
                return NotFound();
            }
            else
            {
                return BadRequest(result.Error);
            }
        }
    }
}
