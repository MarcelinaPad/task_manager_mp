using TaskManager.Api.Models;

namespace TaskManager.Api.Tests;

public class UnitTest1
{
    [Fact]
    public void NewTask_ShouldNotBeCompleted()
    {
        var task = new TaskEntity();

        task.Title = "Przetestować bezpiecznik";

        Assert.False(task.IsDone);
    }
}
