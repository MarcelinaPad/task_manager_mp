using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace TaskManager.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private static readonly List<TaskItem> _tasks = new()
    {
        new TaskItem(Guid.NewGuid(), "Zadanie #1", "High", false),
        new TaskItem(Guid.NewGuid(), "Zadanie #2", "Medium", true),
    };

    // GET /api/tasks (lista) -> 200
    [HttpGet]
    public ActionResult<IEnumerable<TaskItem>> GetAll() => Ok(_tasks);

    // GET /api/tasks/{id} (szczegóły) -> 200 albo 404
    [HttpGet("{id:guid}")]
    public ActionResult<TaskItem> GetById(Guid id)
    {
        var task = _tasks.FirstOrDefault(t => t.Id == id);
        return task is null ? NotFound() : Ok(task);
    }

    // POST /api/tasks (dodaj) -> 201 albo 400
    [HttpPost]
    public ActionResult<TaskItem> Create([FromBody] CreateTaskRequest request)
    {
        // Jeśli request jest niepoprawny, [ApiController] sam zwróci 400
        var task = new TaskItem(Guid.NewGuid(), request.Title, request.Priority, false);
        _tasks.Add(task);

        return CreatedAtAction(nameof(GetById), new { id = task.Id }, task);
    }

    // PUT /api/tasks/{id} (edytuj) -> 204 albo 404 albo 400
    [HttpPut("{id:guid}")]
    public IActionResult Update(Guid id, [FromBody] UpdateTaskRequest request)
    {
        // Jeśli request jest niepoprawny, [ApiController] sam zwróci 400
        var idx = _tasks.FindIndex(t => t.Id == id);
        if (idx == -1) return NotFound();

        _tasks[idx] = _tasks[idx] with
        {
            Title = request.Title,
            Priority = request.Priority,
            IsDone = request.IsDone
        };

        return NoContent();
    }

    // DELETE /api/tasks/{id} (usuń) -> 204 albo 404
    [HttpDelete("{id:guid}")]
    public IActionResult Delete(Guid id)
    {
        var removed = _tasks.RemoveAll(t => t.Id == id);
        return removed == 0 ? NotFound() : NoContent();
    }
}

public record TaskItem(Guid Id, string Title, string Priority, bool IsDone);


public record CreateTaskRequest(
    [property: Required, MinLength(3, ErrorMessage = "Title musi mieć min. 3 znaki")]
    string Title,

    [property: Required, RegularExpression("^(Low|Medium|High)$",
        ErrorMessage = "Priority musi być: Low, Medium lub High")]
    string Priority
);

public record UpdateTaskRequest(
    [property: Required, MinLength(3, ErrorMessage = "Title musi mieć min. 3 znaki")]
    string Title,

    [property: Required, RegularExpression("^(Low|Medium|High)$",
        ErrorMessage = "Priority musi być: Low, Medium lub High")]
    string Priority,

    bool IsDone
);