using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManager.Api.Data;
using TaskManager.Api.Dtos;
using TaskManager.Api.Models;

namespace TaskManager.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly AppDbContext _db;

    public TasksController(AppDbContext db)
    {
        _db = db;
    }

    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TaskReadDto>>> GetAll()
    {
        var tasks = await _db.Tasks
            .AsNoTracking()
            .OrderByDescending(t => t.CreatedAt)
            .Select(t => new TaskReadDto(t.Id, t.Title, t.Priority, t.IsDone))
            .ToListAsync();

        return Ok(tasks);
    }

    
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<TaskReadDto>> GetById(Guid id)
    {
        var task = await _db.Tasks
            .AsNoTracking()
            .Where(t => t.Id == id)
            .Select(t => new TaskReadDto(t.Id, t.Title, t.Priority, t.IsDone))
            .FirstOrDefaultAsync();

        return task is null ? NotFound() : Ok(task);
    }

    
    [HttpPost]
    public async Task<ActionResult<TaskReadDto>> Create([FromBody] TaskCreateDto dto)
    {
        var entity = new TaskEntity
        {
            Title = dto.Title,
            Priority = dto.Priority,
            IsDone = false,
            CreatedAt = DateTime.UtcNow
        };

        _db.Tasks.Add(entity);
        await _db.SaveChangesAsync();

        var readDto = new TaskReadDto(entity.Id, entity.Title, entity.Priority, entity.IsDone);
        return CreatedAtAction(nameof(GetById), new { id = entity.Id }, readDto);
    }

    
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] TaskUpdateDto dto)
    {
        var entity = await _db.Tasks.FirstOrDefaultAsync(t => t.Id == id);
        if (entity is null) return NotFound();

        entity.Title = dto.Title;
        entity.Priority = dto.Priority;
        entity.IsDone = dto.IsDone;
        entity.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var entity = await _db.Tasks.FirstOrDefaultAsync(t => t.Id == id);
        if (entity is null) return NotFound();

        _db.Tasks.Remove(entity);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}