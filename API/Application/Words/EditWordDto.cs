using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Words
{
    public class EditWordDto
    {
        public Guid Id { get; set; }
        public string Text { get; set; } = string.Empty;
        public string? Definition { get; set; }
        public Guid? ParentId { get; set; }
        public List<EditExampleDto>? Examples { get; set; }
    }
    public class EditExampleDto
    {
        public Guid Id { get; set; }
        public string Text { get; set; } = string.Empty;
    }
}
