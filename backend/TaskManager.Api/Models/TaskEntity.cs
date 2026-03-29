using System.ComponentModel.DataAnnotations;

namespace TaskManager.Api.Models;

public class TaskEntity
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required, MinLength(3)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Priority { get; set; } = "Medium";

    public bool IsDone { get; set; }

    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}