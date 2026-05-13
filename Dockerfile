# ========================================
# Multi-stage Dockerfile pour Render.com
# Backend .NET 8 + Frontend Angular
# ========================================

# Stage 1: Build Angular Frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend

# Copy package files
COPY ClientApp/package*.json ./
RUN npm ci

# Copy Angular source
COPY ClientApp/ ./

# Build for production
RUN npm run build -- --configuration production

# Stage 2: Build .NET Backend
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS backend-build
WORKDIR /app

# Copy solution and project files
COPY *.sln* ./
COPY Prodjegg.ApiService/*.csproj ./Prodjegg.ApiService/
COPY Prodjegg.Data/*.csproj ./Prodjegg.Data/
COPY Prodjegg.ServiceDefaults/*.csproj ./Prodjegg.ServiceDefaults/

# Restore dependencies
RUN dotnet restore

# Copy all source code
COPY . .

# Build and publish
WORKDIR /app/Prodjegg.ApiService
RUN dotnet publish -c Release -o /app/publish

# Stage 3: Final runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy published backend
COPY --from=backend-build /app/publish .

# Copy built frontend to wwwroot
COPY --from=frontend-build /app/frontend/dist/prodjegg-angular/browser ./wwwroot

# Create directory for uploads
RUN mkdir -p /app/wwwroot/uploads && chmod -R 755 /app/wwwroot

# Expose port (Render uses PORT env variable)
EXPOSE 8080

# Set environment variables
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

# Run the application
ENTRYPOINT ["dotnet", "Prodjegg.ApiService.dll"]
