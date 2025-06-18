using Application.Core;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Words
{
    public class EditWordDtoValidator : AbstractValidator<EditWordDto>
    {
        public EditWordDtoValidator()
        {
            RuleFor(x => x.Text)
                .NotEmpty().WithMessage("Word text is required.")
                .MaximumLength(100).WithMessage("Word text must not exceed 100 characters.");

            RuleFor(x => x.Definition)
                .MaximumLength(1000).WithMessage("Definition must not exceed 1000 characters.");
        }
    }

    public class Edit
    {
        // Command with DTO
        public class Command : ICommand<Result<Unit>>
        {
            public EditWordDto Word { get; set; }
        }

        public class CommandHandler : ICommandHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public CommandHandler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {

                var word = await _context.Words
                    .Include(w => w.Examples)
                    .FirstOrDefaultAsync(w => w.Id == request.Word.Id, cancellationToken);

                if (word == null)
                    return Result<Unit>.Failure("Word not found.");

                // Update scalar properties
                word.Text = request.Word.Text;
                word.Definition = request.Word.Definition;
                word.ParentId = request.Word.ParentId;
                // Remove old examples explicitly
                foreach (var exampleDto in request.Word.Examples)
                {
                    var existingExample = word.Examples.FirstOrDefault(e => e.Id == exampleDto.Id);

                    if (existingExample != null)
                    {
                        // Update existing example
                        existingExample.Text = exampleDto.Text;
                    }
                    else
                    {
                        // Add new example
                        var newExample = _mapper.Map<Example>(exampleDto);
                        word.Examples.Add(newExample);
                    }
                }


                var result = await _context.SaveChangesAsync(cancellationToken) > 0;

                if (!result)
                    return Result<Unit>.Failure("Failed to update word.");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}
