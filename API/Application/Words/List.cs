using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Words
{
    public class List
    {
        // Query definition  
        public class Query : IQuery<Result<PaginatedList<WordDto>>>
        {
            public PagingParams Params { get; set; } = new();
        }

        // Handler implementation  
        public class Handler : IQueryHandler<Query, Result<PaginatedList<WordDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<PaginatedList<WordDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var synonymIds = await _context.Words
                    .SelectMany(w => w.Synonyms.Select(s => s.Id))
                    .Distinct()
                    .ToListAsync(cancellationToken);

                var query = _context.Words
                    .AsNoTracking()
                    .Where(w => !synonymIds.Contains(w.Id))
                    .ProjectTo<WordDto>(_mapper.ConfigurationProvider);

                var count = await query.CountAsync(cancellationToken);
                if(!string.IsNullOrWhiteSpace(request.Params.SearchTerm))
                {
                    query = query.Where(w => w.Text.Contains(request.Params.SearchTerm) || w.Definition.Contains(request.Params.SearchTerm));
                }

                if (request.Params.Categories != null && request.Params.Categories.Any())
                {
                    query = query.Where(w => w.Categories.Any(c => request.Params.Categories.Contains(c)));
                }

                var items = await query
                    .Skip((request.Params.PageNumber - 1) * request.Params.PageSize)
                    .Take(request.Params.PageSize)
                    .ToListAsync(cancellationToken);

                var paginatedList = new PaginatedList<WordDto>(items, count, request.Params.PageNumber, request.Params.PageSize);

                return Result<PaginatedList<WordDto>>.Success(paginatedList);
            }
        }
    }
}
