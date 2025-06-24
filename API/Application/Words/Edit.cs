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

            RuleFor(x => x.Examples)
                .NotEmpty().WithMessage("Examples is empty!");

            RuleFor(x => x.CategoryIds)
                .NotEmpty().WithMessage("Category is empty!")
                .Must(list => list.Count < 6).WithMessage("Number of categories exceeds 5");

            RuleForEach(x => x.Examples)
                .SetValidator(new EditExampleDtoValidator());
        }
    }

    // Example validator for EditExampleDto
    public class EditExampleDtoValidator : AbstractValidator<EditExampleDto>
    {
        public EditExampleDtoValidator()
        {
            RuleFor(x => x.Text)
                .MaximumLength(500).WithMessage("Each example must not exceed 500 characters.");
        }
    }

    public class Edit
    {
        // Command with DTO
        public class Command : ICommand<Result<WordDto>>
        {
            public EditWordDto Word { get; set; }
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

                var word = await _context.Words
                    .Include(w => w.Examples)
                    .Include(w => w.Categories)
                    .FirstOrDefaultAsync(w => w.Id == request.Word.Id, cancellationToken);

                if (word == null)
                    return Result<WordDto>.Failure("Word not found.");

                // Update scalar properties
                word.Text = request.Word.Text;
                word.Definition = request.Word.Definition;
                
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

                foreach(var category in word.Categories)
                {
                    if (!request.Word.CategoryIds.Contains(category.Id))
                    {
                        word.Categories.Remove(category);
                    }
                }

                foreach (var id in request.Word.CategoryIds)
                {
                    var existingCategory = await _context.Categories.FindAsync(id, cancellationToken);
                    if (existingCategory != null)
                    {
                        if (!word.Categories.Contains(existingCategory))
                        {
                            word.Categories.Add(existingCategory);
                        }
                    }
                }

                var result = await _context.SaveChangesAsync(cancellationToken) > 0;

                if (!result)
                    return Result<WordDto>.Failure("Failed to update word.");
                var res = _mapper.Map<WordDto>(word);
                return Result<WordDto>.Success(res);
            }
        }
    }
}
