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
                .MaximumLength(100).WithMessage("Word text must not exceed 100 characters.");

            RuleFor(x => x.Definition)
                .MaximumLength(1000).WithMessage("Definition must not exceed 1000 characters.");

            RuleFor(x => x.Examples)
                .NotEmpty().WithMessage("Examples is empty!");

            RuleFor(x => x.CategoryIds)
                .NotEmpty().WithMessage("Category is empty!")
                .Must(list => list.Count < 3).WithMessage("Number of categories exceeds 5");

            RuleForEach(x => x.Examples)
                .MaximumLength(500).WithMessage("Each example must not exceed 500 characters.");
        }
    }

    public class Add
    {
        // Command with DTO
        public class Command : ICommand<Result<WordDto>>
        {
            public AddWordDto Word { get; set; }
        }

        public class CommandHandler : ICommandHandler<Command, Result<WordDto>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public CommandHandler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<WordDto>> Handle(Command request, CancellationToken cancellationToken)
            {
                var word = _mapper.Map<Word>(request.Word);
                foreach (var categoryId in request.Word.CategoryIds)
                {
                    var category = new Category { Id = categoryId };
                    _context.Attach(category); // Mark as existing
                    word.Categories.Add(category);
                }
                _context.Words.Add(word);

                var result = await _context.SaveChangesAsync(cancellationToken) > 0;


                if (!result)
                    return Result<WordDto>.Failure("Failed to add word.");

                var wordToReturn = _mapper.Map<WordDto>(word);

                return Result<WordDto>.Success(wordToReturn);
            }
        }
    }
}
