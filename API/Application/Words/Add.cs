using Application.Core;
using MediatR;
using Persistence;
using Domain;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using FluentValidation;

namespace Application.Words
{
    // FluentValidation validator for AddWordDto
    public class AddWordDtoValidator : AbstractValidator<AddWordDto>
    {
        public AddWordDtoValidator()
        {
            RuleFor(x => x.Text)
                .NotEmpty().WithMessage("Word text is required.")
                .MaximumLength(5).WithMessage("Word text must not exceed 100 characters.");

            RuleFor(x => x.Definition)
                .MaximumLength(1000).WithMessage("Definition must not exceed 1000 characters.");

            RuleForEach(x => x.Examples)
                .MaximumLength(500).WithMessage("Each example must not exceed 500 characters.");
        }
    }

    public class Add
    {
        // Command with DTO
        public class Command : ICommand<Result<Unit>>
        {
            public AddWordDto Word { get; set; }
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
                // Validate using FluentValidation
                //var validationResult = await _validator.ValidateAsync(request.Word, cancellationToken);
                //if (!validationResult.IsValid)
                //{
                //    var error = string.Join("; ", validationResult.Errors.Select(e => e.ErrorMessage));
                //    return Result<Unit>.Failure(error);
                //}

                // Create new Word entity
                var word = _mapper.Map<Word>(request.Word);

                _context.Words.Add(word);

                var result = await _context.SaveChangesAsync(cancellationToken) > 0;

                if (!result)
                    return Result<Unit>.Failure("Failed to add word.");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}
