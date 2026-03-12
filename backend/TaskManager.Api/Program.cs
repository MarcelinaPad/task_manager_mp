using Microsoft.Data.SqlClient;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var app = builder.Build();

app.UseCors();

app.UseSwagger();
app.UseSwaggerUI();

app.MapControllers();


app.MapGet("/api/db-test", async (IConfiguration config) =>
{
    var connStr = config.GetConnectionString("DefaultConnection");

    if (string.IsNullOrWhiteSpace(connStr))
        return Results.Problem("Brak connection string: DefaultConnection");

    try
    {
        await using var conn = new SqlConnection(connStr);
        await conn.OpenAsync();

        await using var cmd = new SqlCommand("SELECT 1", conn);
        var result = await cmd.ExecuteScalarAsync();

        return Results.Ok(new { status = "DB_OK", result });
    }
    catch (Exception ex)
    {
        return Results.Problem($"DB connection failed: {ex.Message}");
    }
});

app.Run();