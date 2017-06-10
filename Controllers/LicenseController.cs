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
    [Route("api/license")]
    public class LicenseController : Controller
    {
        [HttpPost("create/{format}/{sign}")]
        public IActionResult CreateLicense(string format, string sign, [FromBody] LicenseModel model)
        {            
            ILicense license = null;
            format = format.ToUpperInvariant();
            switch (format)
            {
                case "XML":
                    license = new XmlLicense();
                    break;
                case "ASCII":
                case "BASE32":
                    license = new StringLicense();
                    break;
                default:
                    return BadRequest();
            }

            ISignatureProvider signature = null;
            switch (sign.ToUpperInvariant())
            {
                case "ECDSA":
                    var ecdsa = new ECDsaSignature(ECDsaKeySize.KeySize112bit);
                    ecdsa.CreateKeyPair();
                    // Embed public key information in the license
                    ecdsa.GenerateKeyInfo = true;
                    model.PublicKey = ecdsa.PublicKey;
                    signature = ecdsa;
                    break;
                case "RSA":
                    var rsa = new RSASignature(1024);
                    rsa.CreateKeyPair();
                    signature = rsa;
                    break;
                default:
                    return BadRequest();
            }

            // Fill license
            license.WithId(model.Id ?? "1")
                .IssuedAt(DateTime.UtcNow)
                .WithType(model.Type ?? string.Empty)
                .ForProduct(model.Product ?? string.Empty, model.Version ?? string.Empty)
                .LicensedTo(model.Licensee ?? string.Empty);

            if (model.ExpireDate.HasValue)
                license.ExpiresAt(model.ExpireDate.Value.ToUniversalTime());

            if (model.SupportExpireDate.HasValue)
                license.SupportExpiresAt(model.SupportExpireDate.Value.ToUniversalTime());

            // Sign license
            var licenseBuilder = license.SignWith(signature);

            var stringBuilder = licenseBuilder as StringLicenseBuilder;
            if (stringBuilder != null)
            {
                switch (format)
                {
                    case "ASCII":
                        stringBuilder.Format = StringFormat.Ascii;
                        break;
                    case "BASE32":
                        stringBuilder.Format = StringFormat.Base32;
                        break;
                }
            }

            // Get license key
            model.LicenseKey = licenseBuilder.ToReadableString();

            return Ok(model);
        }

        [HttpPost]
        [Route("validate/{format}")]
        public IActionResult Validate(string format, [FromBody]LicenseModel model)
        {
            try
            {
                ILicense license = null;
                format = format.ToUpperInvariant();
                switch (format)
                {
                    case "XML":
                        {
                            var mng = new XmlLicenseManager();
                            license = mng.Validate(model.LicenseKey);
                        }
                        break;
                    case "ASCII":
                    case "BASE32":
                        {
                            var mng = new StringLicenseManager();
                            license = mng.Validate(model.LicenseKey);
                        }
                        break;
                    default:
                        return BadRequest();
                }

                model.Id = license.Id;
                model.Type = license.Type;
                model.ExpireDate = license.ExpireDate;
                model.SupportExpireDate = license.SupportExpireDate;
                model.Product = license?.Product?.Name;
                model.Version = license?.Product?.Version;
                model.Licensee = license?.Licensee?.Name;

                return Ok(model);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
