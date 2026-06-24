using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using pro.Server.Classes;
using pro.Server.Services;

namespace pro.Server.Controllers
{
    [ApiController]
    [Route("Kindergarten")]
    public class KindergartenController : ControllerBase
    {
        private readonly KindergartenService _kindergartenService;

        public KindergartenController(KindergartenService kindergartenService)
        {
            _kindergartenService = kindergartenService;
        }

        [HttpGet("GetKindergarten")]
        public ActionResult<List<Kindergarten>> GetKindergarten()
        {
            return _kindergartenService.GetKindergartens();
        }

        [HttpGet("GetKindergartenByCode/{code}")]
        public async Task<ActionResult<Kindergarten>> GetKindergartenByCode(int code)
        {
            var Kindergarten = await _kindergartenService.GetKindergartenByCodeAsync(code); // using the service to fetch data

            if (Kindergarten == null)
            {
                return NotFound(); // אם לא נמצא מחזירים 404
            }

            return Kindergarten; // מחזירים את פרטי הארגון 
        }


     
    }
}
