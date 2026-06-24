using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using pro.Server.Classes;
using pro.Server.Services;

namespace pro.Server.Controllers
{
    [ApiController]
    [Route("Nanny")]
    public class NannyController : ControllerBase
    {
        private readonly NannyService _nannyService;

        public NannyController(NannyService nannyService)
        {
            _nannyService = nannyService;
        }

        [HttpGet("GetNannies")]
        public ActionResult<List<Nanny>> GetNannies()
        {
            return _nannyService.GetNannies();
        }

        [HttpGet("GetNannyById/{id}")]
        public async Task<ActionResult<Nanny>> GetNannyById(string id)
        {
            var nanny = await _nannyService.GetNannyByIdAsync(id); // using the service to fetch data

            if (nanny == null)
            {
                return NotFound(); // אם לא נמצא מחזירים 404
            }

            return nanny; // מחזירים את פרטי הארגון 
        }

        [HttpGet("GetNanniesByHubId/{hubId}")]
        public async Task<List<Nanny>> GetNanniesByHubIdAsync(string hubId)
        {
            return await _nannyService.GetNanniesByHubIdAsync(hubId);
        }
    }
}
