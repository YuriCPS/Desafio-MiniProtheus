using Microsoft.EntityFrameworkCore;
using MiniProtheus.Server.Data;
using MiniProtheus.Server.DTOs;
using MiniProtheus.Server.Exceptions;
using MiniProtheus.Server.Interfaces;
using MiniProtheus.Server.Models;

namespace MiniProtheus.Server.Services
{
    public class ProductService : IProductService
    {
        private readonly AppDbContext _context;

        public ProductService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ProductResponseDto>> GetAllAsync(string? search = null)
        {
            var query = _context.Products.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.ToLower();
                query = query.Where(p =>
                    p.Name.ToLower().Contains(term) ||
                    p.SKU.ToLower().Contains(term));
            }

            var products = await query
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return products.Select(MapToResponseDto);
        }

        public async Task<ProductResponseDto?> GetByIdAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            return product is null ? null : MapToResponseDto(product);
        }

        public async Task<ProductResponseDto> CreateAsync(CreateProductDto dto)
        {
            await ValidateUniqueFieldsAsync(dto.SKU, dto.Barcode);

            var product = new Product
            {
                SKU = dto.SKU,
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                Stock = dto.Stock,
                Barcode = dto.Barcode,
                NCM = dto.NCM,
                CEST = dto.CEST,
                CreatedAt = DateTime.UtcNow
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return MapToResponseDto(product);
        }

        public async Task<ProductResponseDto?> UpdateAsync(int id, UpdateProductDto dto)
        {
            var product = await _context.Products.FindAsync(id);
            if (product is null) return null;

            await ValidateUniqueFieldsAsync(dto.SKU, dto.Barcode, id);

            product.SKU = dto.SKU;
            product.Name = dto.Name;
            product.Description = dto.Description;
            product.Price = dto.Price;
            product.Stock = dto.Stock;
            product.Barcode = dto.Barcode;
            product.NCM = dto.NCM;
            product.CEST = dto.CEST;
            product.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return MapToResponseDto(product);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product is null) return false;

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return true;
        }

        private async Task ValidateUniqueFieldsAsync(string sku, string? barcode, int? excludeId = null)
        {
            var skuExists = await _context.Products
                .AnyAsync(p => p.SKU == sku && (!excludeId.HasValue || p.Id != excludeId.Value));

            if (skuExists)
                throw new BusinessException("Já existe um produto com este SKU.");

            if (!string.IsNullOrWhiteSpace(barcode))
            {
                var barcodeExists = await _context.Products
                    .AnyAsync(p => p.Barcode == barcode && (!excludeId.HasValue || p.Id != excludeId.Value));

                if (barcodeExists)
                    throw new BusinessException("Já existe um produto com este código de barras.");
            }
        }

        private static ProductResponseDto MapToResponseDto(Product product)
        {
            return new ProductResponseDto
            {
                Id = product.Id,
                SKU = product.SKU,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Stock = product.Stock,
                Barcode = product.Barcode,
                NCM = product.NCM,
                CEST = product.CEST,
                CreatedAt = product.CreatedAt,
                UpdatedAt = product.UpdatedAt
            };
        }
    }
}
