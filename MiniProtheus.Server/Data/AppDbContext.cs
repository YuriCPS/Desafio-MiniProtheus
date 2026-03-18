using Microsoft.EntityFrameworkCore;
using MiniProtheus.Server.Models;

namespace MiniProtheus.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Product> Products => Set<Product>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasKey(p => p.Id);
                entity.HasIndex(p => p.SKU).IsUnique();
                entity.HasIndex(p => p.Barcode).IsUnique();
                entity.Property(p => p.Price).HasPrecision(18, 2);
            });
        }
    }
}
