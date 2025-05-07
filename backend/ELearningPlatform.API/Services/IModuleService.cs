using ELearningPlatform.API.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;
using ELearningPlatform.API.Models;

namespace ELearningPlatform.API.Services
{
    public interface IModuleService
    {
        Task<Module> CreateModule(CreateModuleDto moduleDto);
        Task<Module> GetModule(int id);
        Task<List<Module>> GetModulesByCourse(int courseId);
        Task<Module> UpdateModule(int id, UpdateModuleDto moduleDto);
        Task<bool> DeleteModule(int id);
    }
}