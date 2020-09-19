using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BuddhaRelaxSpaApp.Models
{
    public class Request
    {
        public string email { get; set; }
        public string password { get; set; }
        public string newpassword { get; set; }
        public string RegistrationStatus { get; set; }

        public IFormFile File { get; set; }
    }
}
