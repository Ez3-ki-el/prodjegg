using Microsoft.EntityFrameworkCore;
using Prodjegg.Data.Db;
using Prodjegg.Data.Models;

namespace Prodjegg.ApiService.Data;

public static class DbSeeder
{
    public static async Task SeedData(AppDb db)
    {
        Console.WriteLine("🌱 DbSeeder: Starting seed check...");

        var userCount = await db.Users.CountAsync();
        Console.WriteLine($"🌱 DbSeeder: Found {userCount} users in database");

        if (userCount > 0)
        {
            Console.WriteLine("🌱 DbSeeder: Database already seeded, skipping...");
            return; // Database already seeded
        }

        Console.WriteLine("🌱 DbSeeder: Seeding database with initial data...");

        // Create default admin user
        var authService = new Services.AuthService(null!);
        var adminPassword = Environment.GetEnvironmentVariable("ADMIN_DEFAULT_PASSWORD") ?? "admin123";
        db.Users.Add(new User
        {
            Username = "admin",
            Email = "admin@prodjegg.com",
            PasswordHash = authService.HashPassword(adminPassword),
            CreatedAt = DateTime.UtcNow
        });

        Console.WriteLine("✅ DbSeeder: Added admin user");

        // Seed Hero Section
        db.HeroSections.Add(new HeroSection
        {
            FullName = "François Robin Jego",
            Title = "Professional Video Editor & Storyteller",
            Description = "I help brands, creators, and businesses tell their story through stunning visuals and cinematic edits. Let's make your vision unforgettable.",
            ImagePath = "/assets/images/frej.jpg",
            FacebookUrl = "#",
            TwitterUrl = "#",
            InstagramUrl = "#",
            YoutubeUrl = "#",
            UpdatedAt = DateTime.UtcNow
        });

        // Seed About Section
        db.AboutSections.Add(new AboutSection
        {
            Title = "About me",
            Subtitle = "Passionate storyteller with 5+ years of experience in video production",
            Paragraph1 = "I'm Angelina Smith, a creative video editor and filmmaker who believes every frame tells a story. With over 5 years of experience in the industry, I've helped brands, content creators, and businesses bring their visions to life through compelling visual narratives.",
            Paragraph2 = "My expertise spans across various aspects of video production - from initial concept development and scriptwriting to post-production magic. I specialize in creating cinematic content that not only looks stunning but also drives engagement and delivers results.",
            Paragraph3 = "Whether it's a brand commercial, social media content, or a documentary project, I approach each work with fresh creativity and technical precision. My goal is to transform your raw footage into a masterpiece that resonates with your audience.",
            UpdatedAt = DateTime.UtcNow
        });

        // Seed Services
        db.Services.AddRange(
            new Service { Title = "Video Editing", Description = "Professional video editing with color grading, sound design, and seamless transitions. Transform your raw footage into polished, engaging content.", IconClass = "bx bx-video", Order = 1 },
            new Service { Title = "Motion Graphics", Description = "Eye-catching motion graphics and animations that bring your brand to life. Perfect for logos, titles, and dynamic visual elements.", IconClass = "bx bx-shape-triangle", Order = 2 },
            new Service { Title = "Scriptwriting", Description = "Compelling scripts that capture your message and engage your audience. From concept to final draft, I craft stories that resonate.", IconClass = "bx bx-edit", Order = 3 },
            new Service { Title = "Film Production", Description = "Complete film production services from pre-production planning to final delivery. Cinematic quality for every project size.", IconClass = "bx bx-camera-movie", Order = 4 },
            new Service { Title = "Audio Production", Description = "Professional audio mixing, sound design, and voiceover recording. Crystal clear audio that enhances your visual storytelling and creates immersive experiences.", IconClass = "bx bx-volume-full", Order = 5 },
            new Service { Title = "Brand Video Strategy", Description = "Strategic video content planning and brand storytelling. From concept development to campaign execution, creating videos that align with your brand goals.", IconClass = "bx bx-palette", Order = 6 }
        );

        // Seed Testimonials
        db.Testimonials.AddRange(
            new Testimonial
            {
                ClientName = "Michael Rodriguez",
                ClientTitle = "Creative Director, BrandFlow",
                ClientImagePath = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
                Content = "Angelina transformed our raw footage into a cinematic masterpiece. Her attention to detail and creative vision exceeded our expectations.",
                Rating = 5,
                Order = 1
            },
            new Testimonial
            {
                ClientName = "Sarah Chen",
                ClientTitle = "Marketing Manager, TechStart",
                ClientImagePath = "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
                Content = "Professional, efficient, and incredibly talented. Angelina's motion graphics brought our brand story to life in ways we never imagined.",
                Rating = 5,
                Order = 2
            },
            new Testimonial
            {
                ClientName = "David Thompson",
                ClientTitle = "Content Creator, 2M Followers",
                ClientImagePath = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
                Content = "Working with Angelina was seamless. She understood our vision immediately and delivered a final product that went viral across all our platforms.",
                Rating = 5,
                Order = 3
            }
        );

        // Seed Stats
        db.Stats.AddRange(
            new Stat { Label = "Projects Completed", Value = 150, Order = 1 },
            new Stat { Label = "Happy Clients", Value = 95, Order = 2 },
            new Stat { Label = "Years Experience", Value = 5, Order = 3 },
            new Stat { Label = "Awards Won", Value = 24, Order = 4 }
        );

        // Seed Skills
        db.Skills.AddRange(
            new Skill { Name = "ADOBE PREMIERE PRO", Percentage = 95, Order = 1 },
            new Skill { Name = "AFTER EFFECTS", Percentage = 90, Order = 2 },
            new Skill { Name = "FINAL CUT PRO", Percentage = 85, Order = 3 },
            new Skill { Name = "DAVINCI RESOLVE", Percentage = 92, Order = 4 },
            new Skill { Name = "MOTION GRAPHICS", Percentage = 88, Order = 5 },
            new Skill { Name = "COLOR GRADING", Percentage = 90, Order = 6 }
        );

        // Seed CTA Section
        db.CtaSections.Add(new CtaSection
        {
            Title = "Ready to bring your vision to life? Let's create magic!",
            Description = "Whether you have a clear vision or just a spark of an idea, I'm here to help transform it into compelling visual content. Let's discuss your project and create something extraordinary together.",
            ImagePath = "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?q=80&w=1887&auto=format&fit=crop",
            Email = "contact@prodjegg.com",
            PhoneNumber = "+33 6 12 34 56 78",
            UpdatedAt = DateTime.UtcNow
        });

        await db.SaveChangesAsync();
    }
}
