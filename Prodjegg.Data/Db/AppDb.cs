using Prodjegg.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Prodjegg.Data.Db;

public class AppDb(DbContextOptions<AppDb> options) : DbContext(options)
{
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<HeroSection> HeroSections { get; set; } = null!;
    public DbSet<AboutSection> AboutSections { get; set; } = null!;
    public DbSet<Service> Services { get; set; } = null!;
    public DbSet<PortfolioItem> PortfolioItems { get; set; } = null!;
    public DbSet<Testimonial> Testimonials { get; set; } = null!;
    public DbSet<Stat> Stats { get; set; } = null!;
    public DbSet<Skill> Skills { get; set; } = null!;
    public DbSet<CtaSection> CtaSections { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("Users");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Username).IsUnique();
            entity.HasIndex(e => e.Email).IsUnique();
        });

        modelBuilder.Entity<HeroSection>(entity =>
        {
            entity.ToTable("HeroSection");
            entity.HasKey(e => e.Id);
        });

        modelBuilder.Entity<AboutSection>(entity =>
        {
            entity.ToTable("AboutSection");
            entity.HasKey(e => e.Id);
        });

        modelBuilder.Entity<Service>(entity =>
        {
            entity.ToTable("Services");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Order);
        });

        modelBuilder.Entity<PortfolioItem>(entity =>
        {
            entity.ToTable("PortfolioItems");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Category);
            entity.HasIndex(e => e.Order);
        });

        modelBuilder.Entity<Testimonial>(entity =>
        {
            entity.ToTable("Testimonials");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Order);
        });

        modelBuilder.Entity<Stat>(entity =>
        {
            entity.ToTable("Stats");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Order);
        });

        modelBuilder.Entity<Skill>(entity =>
        {
            entity.ToTable("Skills");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Order);
        });

        modelBuilder.Entity<CtaSection>(entity =>
        {
            entity.ToTable("CtaSection");
            entity.HasKey(e => e.Id);
        });
    }
}
