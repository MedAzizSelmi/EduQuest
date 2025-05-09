using ELearningPlatform.API.Data;
using ELearningPlatform.API.DTOs;
using ELearningPlatform.API.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ELearningPlatform.API.Services
{
    public class ModuleService : IModuleService
    {
        private readonly ApplicationDbContext _context;

        public ModuleService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ModuleDto> CreateModule(CreateModuleDto moduleDto)
        {
            var module = new Module
            {
                Title = moduleDto.Title,
                Description = moduleDto.Description,
                Order = moduleDto.Order,
                CourseId = moduleDto.CourseId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Modules.Add(module);
            await _context.SaveChangesAsync();

            return MapToModuleDto(module);
        }

        public async Task<ModuleDto> GetModule(int id)
        {
            var module = await _context.Modules
                .Include(m => m.Lessons)
                .FirstOrDefaultAsync(m => m.Id == id);

            return module == null ? null : MapToModuleDto(module);
        }

        public async Task<List<ModuleDto>> GetModulesByCourse(int courseId)
        {
            var modules = await _context.Modules
                .Where(m => m.CourseId == courseId)
                .Include(m => m.Lessons)
                .OrderBy(m => m.Order)
                .ToListAsync();

            return modules.Select(MapToModuleDto).ToList();
        }

        public async Task<ModuleDto> UpdateModule(int id, UpdateModuleDto moduleDto)
        {
            var module = await _context.Modules.FindAsync(id);
            if (module == null) return null;

            module.Title = moduleDto.Title ?? module.Title;
            module.Description = moduleDto.Description ?? module.Description;
            module.Order = moduleDto.Order ?? module.Order;
            module.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return MapToModuleDto(module);
        }

        public async Task<bool> DeleteModule(int id)
        {
            var module = await _context.Modules.FindAsync(id);
            if (module == null) return false;

            _context.Modules.Remove(module);
            return await _context.SaveChangesAsync() > 0;
        }

        private ModuleDto MapToModuleDto(Module module)
        {
            return new ModuleDto
            {
                Id = module.Id,
                Title = module.Title,
                Description = module.Description,
                Order = module.Order,
                CourseId = module.CourseId,
                CreatedAt = module.CreatedAt,
                UpdatedAt = module.UpdatedAt,
                Lessons = module.Lessons?.Select(l => new LessonDto
                {
                    Id = l.Id,
                    Title = l.Title,
                    Content = l.Content,
                    VideoUrl = l.VideoUrl,
                    Order = l.Order,
                    DurationInMinutes = l.DurationInMinutes,
                    ModuleId = l.ModuleId,
                    CreatedAt = l.CreatedAt,
                    UpdatedAt = l.UpdatedAt,
                    Type = l.Type
                }).ToList()
            };
        }
    }
}