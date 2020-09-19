using System;
using System.Collections.Generic;
using System.Text;

namespace BuddhaRelaxSpaApp.Entities.Authentication
{
    public class UserDetail
    {
        public long UserId { get; set; }

        public int RoleId { get; set; }
        public string RoleName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string EmailId { get; set; }
        public string MobileNumber { get; set; }

        public string UserType{ get; set; }

        public string Gender { get; set; }
        public string ProfileImg { get; set; }

        public long? CompanyId { get; set; }
        public long? BranchId { get; set; }
    }
}
