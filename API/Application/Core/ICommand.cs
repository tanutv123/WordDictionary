using MediatR;

namespace Application.Core
{
    public interface ICommand : ICommand<Unit>
    {

    }
    public interface ICommand<out TResponse> : IRequest<TResponse>
    {
    }
}
