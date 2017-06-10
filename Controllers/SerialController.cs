using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using Babel.Licensing;
using LicensingWeb.Models;

namespace LicensingWeb.Controllers
{
    [Route("api/serial")]
    public class SerialController : Controller
    {
        [HttpPost("create")]
        public IActionResult Create([FromBody] LicenseModel model)
        {
            SerialBuilder builder = new SerialBuilder();

            // Create sign keys
            builder.CreateKeyPair();

            int id;
            if (int.TryParse(model.Id ?? "1", out id))
                builder.LicenseId = id;

            builder.LicenseInfo = model.Type;

            if (model.ExpireDate.HasValue)
                builder.ExpireDate = model.ExpireDate.Value.ToUniversalTime();

            if (model.ExpireDays.HasValue)
                builder.ExpireDays = model.ExpireDays.Value;

            model.PublicKey = builder.PublicKey;
            model.SerialKey = builder.GenerateSerial(5);

            return Ok(model);
        }

        [HttpPost]
        [Route("validate")]
        public IActionResult Validate([FromBody]LicenseModel model)
        {
            try
            {
                SerialManager mng = new SerialManager();
                
                // Needed to validate the license
                mng.PublicKey = model.PublicKey;

                ILicense license = mng.Validate(model.SerialKey);

                model.Id = license.Id;
                model.Type = license.Type;
                model.ExpireDate = license.ExpireDate;

                return Ok(model);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
