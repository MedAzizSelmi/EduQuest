using ELearningPlatform.API.Models;
using System.Threading.Tasks;

namespace ELearningPlatform.API.Services
{
    public interface ITokenService
    {
        Task<string> CreateToken(AppUser user);
    }
}
