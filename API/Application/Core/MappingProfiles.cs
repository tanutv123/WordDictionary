using Application.Categories;
using AutoMapper;
using Domain;

namespace Application.Words
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<AddWordDto, Word>()
                .ForMember(d => d.Examples, o => o.MapFrom(s => s.Examples.Select(x => new Example { Text = x })))
                .ReverseMap();
            CreateMap<Word, WordDto>()
                .ForMember(d => d.Categories, opt => opt.MapFrom(src => src.Categories.Select(x => x.Name)));
            CreateMap<ExampleDto, Example>()
                .ReverseMap();
            CreateMap<EditExampleDto, Example>()
                .ReverseMap();
            CreateMap<SynonymDto, Word>()
                .ReverseMap();
            CreateMap<Category, CategoryDto>()
                .ReverseMap();
        }
    }
}
