namespace Application.Words
{
    public class WordDto
    {
        public Guid Id { get; set; }
        public string? Text { get; set; }
        public string? Definition { get; set; }
        public Guid? ParentId { get; set; }
        public List<string> Categories { get; set; }
        public List<Guid> CategoryIds { get; set; }
        public List<ExampleDto> Examples { get; set; } = new();
        public List<SynonymDto> Synonyms { get; set; } = new();
    }

    public class ExampleDto
    {
        public Guid Id { get; set; }
        public string Text { get; set; } = string.Empty;
    }

    public class SynonymDto
    {
        public Guid Id { get; set; }
        public string? Text { get; set; }
    } 
}
