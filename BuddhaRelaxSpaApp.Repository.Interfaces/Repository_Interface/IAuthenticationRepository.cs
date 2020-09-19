using BuddhaRelaxSpaApp.Entities.Authentication;
using BuddhaRelaxSpaApp.Entities.Employee;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace BuddhaRelaxSpaApp.Repository.Interfaces.Repository_Interface
{
    public interface IAuthenticationRepository
    {
        Task<UserDetail> GetUserDetail(string email, string password);
    }
}
