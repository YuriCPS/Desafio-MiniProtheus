using System.ComponentModel.DataAnnotations;

namespace MiniProtheus.Server.DTOs
{
    public class UpdateProductDto
    {
        [Required]
        [StringLength(50)]
        public string SKU { get; set; } = string.Empty;

        [Required]
        [StringLength(200, MinimumLength = 1)]
        public string Name { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? Description { get; set; }

        [Required]
        [Range(0.01, (double)decimal.MaxValue)]
        public decimal Price { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int Stock { get; set; }

        [StringLength(14)]
        public string? Barcode { get; set; }

        [StringLength(10)]
        public string? NCM { get; set; }

        [StringLength(9)]
        public string? CEST { get; set; }
    }
}
