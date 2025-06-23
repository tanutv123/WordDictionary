using System.ComponentModel.DataAnnotations;

namespace Application.Words
{
    public class AddWordDto
    {
        [Required]
        public string Text { get; set; } = string.Empty;
        public string Definition { get; set; } = string.Empty;
        public Guid? ParentId { get; set; }
        public List<string> Examples { get; set; } = new List<string>();
        public List<Guid> CategoryIds { get; set; } = new List<Guid>();
    }
}
