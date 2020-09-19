using System;
using System.Collections.Generic;
using System.Text;

namespace BuddhaRelaxSpaApp.Entities.Authentication
{
    public class Authentication
    {
        public long AuthenticationId { get; set; }
        public long? UserId { get; set; }
        public string UserType { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public bool? IsLockedOut { get; set; }
        public bool? IsDelete { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? ModifyDate { get; set; }
        public string ModifyBy { get; set; }
        public string LastLoginDate { get; set; }
        public string LastPasswordChangedDate { get; set; }
        public DateTime? LastLockoutDate { get; set; }
        public string Comment { get; set; }
    }
}
