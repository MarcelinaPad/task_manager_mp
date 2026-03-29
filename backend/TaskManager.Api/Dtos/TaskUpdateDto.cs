using System.ComponentModel.DataAnnotations;

namespace TaskManager.Api.Dtos;

public class TaskUpdateDto
{
    [Required, MinLength(3, ErrorMessage = "Title musi mieć min. 3 znaki")]
    public string Title { get; set; } = string.Empty;

    [Required, RegularExpression("^(Low|Medium|High)$",
        ErrorMessage = "Priority musi być: Low, Medium lub High")]
    public string Priority { get; set; } = "Medium";

    public bool IsDone { get; set; }
}