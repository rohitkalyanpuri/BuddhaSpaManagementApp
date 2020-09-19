using System;
using System.Collections.Generic;
using System.Text;

namespace BuddhaRelaxSpaApp.Entities.Employee
{
    public class EmployeeEnt
    {
        public long EmployeeId { get; set; }
        public long RoleId { get; set; }

        public string RoleName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string EmailId { get; set; }
        public string MobileNumber { get; set; }
        public string Gender { get; set; }
        public string Address { get; set; }
        public string ProfileImg { get; set; }
        public bool IsActive { get; set; } = true;
        public string CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; } = DateTime.Now;
        public string ModifyBy { get; set; }
        public DateTime? ModifyDate { get; set; }
        public bool IsDelete { get; set; } = false;

        public long? CompanyId { get; set; }
        public long? BranchId { get; set; }

        public string BranchName { get; set; }

        public string UserName { get; set; }

        public string Password { get; set; }

        public string UserType { get; set; }
    }
}
