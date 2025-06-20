namespace Domain
{
    public class Word
    {
        public Guid Id { get; set; }
        public string? Text { get; set; }
        public string? Definition { get; set; }
        public Guid? ParentId { get; set; }
        public Word? Parent { get; set; }
        public ICollection<Category> Categories { get; set; } = new List<Category>();
        public ICollection<Example> Examples { get; set; } = new List<Example>();
        public ICollection<Word> Synonyms{ get; set; } = new List<Word>();
    }
}
