using System;
using System.Collections.Generic;
using System.Text;

namespace BuddhaRelaxSpaApp.Entities.Client
{
    public class Client
    {
        public long ClientId { get; set; }
        public string ClientName { get; set; }
        public string MemberName { get; set; }
        public string CardNo { get; set; }
        public string DateOfBirth { get; set; }
        public string Gender { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Phone { get; set; }
        public string CustomerImage { get; set; }
        public string CustomerQRCode { get; set; }

        public bool IsDeleted { get; set; }

        public bool IsFromEditPage { get; set; } = false;

        public string Email { get; set; }
        public string TherapyPreference { get; set; }

        public string InjuryOrDisease { get; set; }

        public string MassagePreference { get; set; }

        public string PainingArea { get; set; }

        public int MassageCount { get; set; }

        public int MassageBalance { get; set; }

        public int MassageTime { get; set; } = 30;

        public long? CompanyId { get; set; }

        public long? BranchId { get; set; }
    }

}
