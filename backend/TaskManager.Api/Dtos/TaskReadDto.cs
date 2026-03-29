namespace TaskManager.Api.Dtos;

public record TaskReadDto(Guid Id, string Title, string Priority, bool IsDone);