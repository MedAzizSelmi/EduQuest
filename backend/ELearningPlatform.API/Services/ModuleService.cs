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

        public async Task<Module> CreateModule(CreateModuleDto moduleDto)
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
            return module;
        }

        public async Task<Module> GetModule(int id)
        {
            return await _context.Modules
                .Include(m => m.Lessons)
                .FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<List<Module>> GetModulesByCourse(int courseId)
        {
            return await _context.Modules
                .Where(m => m.CourseId == courseId)
                .Include(m => m.Lessons)
                .OrderBy(m => m.Order)
                .ToListAsync();
        }

        public async Task<Module> UpdateModule(int id, UpdateModuleDto moduleDto)
        {
            var module = await _context.Modules.FindAsync(id);
            if (module == null) return null;

            module.Title = moduleDto.Title ?? module.Title;
            module.Description = moduleDto.Description ?? module.Description;
            module.Order = moduleDto.Order ?? module.Order;
            module.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return module;
        }

        public async Task<bool> DeleteModule(int id)
        {
            var module = await _context.Modules.FindAsync(id);
            if (module == null) return false;

            _context.Modules.Remove(module);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}