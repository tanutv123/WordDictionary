namespace Domain
{
    public class WordCategory
    {
        public Guid WordId { get; set; }
        public Guid CategoryId { get; set; }
        public Word Word { get; set; }
        public Category Category { get; set; }
    }
}
