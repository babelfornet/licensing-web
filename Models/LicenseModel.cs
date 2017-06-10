using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LicensingWeb.Models
{
    public class LicenseModel
    {
        public string Id { get; set; }
        public string Type { get; set; }
        public DateTime? ExpireDate { get; set; }
        public int? ExpireDays { get; set; }
        public DateTime? SupportExpireDate { get; set; }
        public string Licensee { get; set; }
        public string Product { get; set; }
        public string Version { get; set; }

        public string LicenseKey { get; set; }
        public string SerialKey { get; set; }
        public string PublicKey { get; set; }
    }
}
