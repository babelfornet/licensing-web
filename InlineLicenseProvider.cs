using Babel.Licensing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LicensingWeb
{
    public delegate ILicense GetLicenseFunc(ILicenseContext context, Type type, object instance);

    public class InlineLicenseProvider : ILicenseProvider
    {
        GetLicenseFunc _call;

        public InlineLicenseProvider(GetLicenseFunc call)
        {
            _call = call;
        }

        public ILicense GetLicense(ILicenseContext context, Type type, object instance)
        {
            return _call(context, type, instance);
        }
    }
}
