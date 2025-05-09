using ELearningPlatform.API.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;
using ELearningPlatform.API.Models;

namespace ELearningPlatform.API.Services
{
    public interface IModuleService
    {
        Task<ModuleDto> CreateModule(CreateModuleDto moduleDto);
        Task<ModuleDto> GetModule(int id);
        Task<List<ModuleDto>> GetModulesByCourse(int courseId);
        Task<ModuleDto> UpdateModule(int id, UpdateModuleDto moduleDto);
        Task<bool> DeleteModule(int id);
    }
}