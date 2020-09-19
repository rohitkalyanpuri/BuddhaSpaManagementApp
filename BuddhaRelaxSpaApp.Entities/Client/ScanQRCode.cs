using System;
using System.Collections.Generic;
using System.Text;

namespace BuddhaRelaxSpaApp.Entities.Client
{
    public class ScanQRCode
    {
        public int MassageLeftInPackage { get; set; }

        public string ClientName { get; set; }

        public string Message { get; set; }

        public long ClientId { get; set; }
    }
}
