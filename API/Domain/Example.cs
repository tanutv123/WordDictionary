namespace Domain
{
    public class Example
    {
        public Guid Id { get; set; }
        public string Text { get; set; }
        public Guid WordId { get; set; }
        public Word Word { get; set; }
    }
}
