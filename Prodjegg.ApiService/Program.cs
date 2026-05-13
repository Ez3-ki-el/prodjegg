using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Prodjegg.ApiService.Services;
using Prodjegg.Data.Db;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Database connection (PostgreSQL ou SQLite)
var databaseProvider = builder.Configuration["Database:Provider"] ?? "Sqlite";

if (databaseProvider == "Sqlite")
{
    Console.WriteLine("🗄️ Using SQLite database");
    var connectionString = builder.Configuration.GetConnectionString("SqliteConnection") ?? "Data Source=prodjegg.db";
    builder.Services.AddDbContext<AppDb>(options =>
        options.UseSqlite(connectionString));
}
else
{
    Console.WriteLine("🗄️ Using PostgreSQL database");
    var rawConnectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
        ?? "Host=localhost;Port=5432;Database=prodjegg_db;Username=postgres;Password=postgres";

    // Convert PostgreSQL URL format (postgresql://user:pass@host/db) to Npgsql key-value format
    string connectionString;
    if (rawConnectionString.StartsWith("postgresql://") || rawConnectionString.StartsWith("postgres://"))
    {
        var uri = new Uri(rawConnectionString);
        var userInfo = uri.UserInfo.Split(':', 2);
        var port = uri.Port > 0 ? uri.Port : 5432;
        connectionString = $"Host={uri.Host};Port={port};Database={uri.AbsolutePath.TrimStart('/')};Username={userInfo[0]};Password={Uri.UnescapeDataString(userInfo[1])};SSL Mode=Require;Trust Server Certificate=true";
    }
    else
    {
        connectionString = rawConnectionString;
    }

    builder.Services.AddDbContext<AppDb>(options =>
        options.UseNpgsql(connectionString));
}

builder.Services.AddProblemDetails();

// JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] ?? "YourSuperSecretKeyForJwtTokenGenerationMinimum32Characters!";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "ProdjeggApi";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "ProdjeggClient";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});

builder.Services.AddAuthorization();

// Services
builder.Services.AddScoped<IAuthService, AuthService>();

// Controllers
builder.Services.AddControllers();

// Log pour debug
Console.WriteLine("🔍 Controllers registered");

// CORS for Angular
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "https://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "Prodjegg API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token.",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

app.UseExceptionHandler();

// Enable Swagger in development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Static files (frontend Angular en production)
app.UseStaticFiles();

// En production, servir le frontend Angular pour toutes les routes non-API
if (!app.Environment.IsDevelopment())
{
    app.MapFallbackToFile("index.html");
}

// CORS
app.UseCors("AllowAngular");

// Routing (important pour .NET 8)
app.UseRouting();

// Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

// Map endpoints
app.MapControllers();

// Health check
app.MapGet("/health", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }));

Console.WriteLine("✅ Endpoints mapped successfully");

// Auto-migrate database
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDb>();

    Console.WriteLine("🔍 Applying migrations...");
    db.Database.Migrate();
    Console.WriteLine("✅ Migrations applied");

    // Seed initial data
    await Prodjegg.ApiService.Data.DbSeeder.SeedData(db);
}

Console.WriteLine("🚀 Starting application...");
app.Run();


