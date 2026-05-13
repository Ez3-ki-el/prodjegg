using Microsoft.Extensions.Hosting; // ou le package approprié pour AddPostgres


// --- Builder ---
var builder = DistributedApplication.CreateBuilder(args);

// --- Ajout postgres ---
var postgres = builder.AddPostgres("postgres");
// --- Création BDD ---
var db = postgres.AddDatabase("prodjeggDB");
    //.WithUsername("prodjegg_user")
    //.WithPassword("secure_password")
    //.WithPort(5432)
    //.WithInitialSetupScript("Scripts/InitDatabase.sql");


var apiService = builder.AddProject<Projects.Prodjegg_ApiService>("apiservice")
    .WithReference(db) // Donne la connection string
    .WithHttpHealthCheck("/health")
    .WaitFor(db);

// Frontend Angular - À lancer manuellement avec: cd ClientApp && npm start
// Décommenté pour simplifier le lancement depuis VS
// var frontend = builder.AddNpmApp("frontend", "../ClientApp", "start")
//     .WithHttpEndpoint(env: "PORT")
//     .WithExternalHttpEndpoints() 
//     .PublishAsDockerFile();

builder.Build().Run();
    