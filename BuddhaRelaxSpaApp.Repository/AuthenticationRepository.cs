using BuddhaRelaxSpaApp.Entities.Authentication;
using BuddhaRelaxSpaApp.Repository.CommonHelper;
using BuddhaRelaxSpaApp.Repository.Interfaces.Repository_Interface;
using Dapper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BuddhaRelaxSpaApp.Repository
{
    public class AuthenticationRepository : IAuthenticationRepository
    {
        private readonly IConfiguration _config;
        private readonly IHttpContextAccessor _context;
        private IHostingEnvironment _environment;
        public AuthenticationRepository(IConfiguration config , IHttpContextAccessor context, IHostingEnvironment environment)
        {
            _config = config; _context = context; _environment = environment;
        }
        internal IDbConnection DbConnection => new SqlConnection(_config.GetConnectionString("SQLDBConnectionString"));

        //public string BaseUrl()
        //{
        //    var request = _context.HttpContext.Request;
        //    string path = Path.Combine(this._environment.WebRootPath, "Uploads");
        //    //D:\Rohit Backup\BuddhaRelaxSpa\BuddhaRelaxSpaAPI\BuddhaRelaxSpaApp\BuddhaRelaxSpaApp
        //    // Now that you have the request you can select what you need from it.
        //    return request.Host.Host;
        //}
        public async Task<UserDetail> GetUserDetail(string email, string password)
        {
            using (IDbConnection con = DbConnection)
            {
                UserDetail userDetail = new UserDetail();
                DynamicParameters parameters = new DynamicParameters();
                parameters.Add("Username", email);
                parameters.Add("Password", password);
                userDetail = (await SqlMapper.QueryAsync<UserDetail>(con, "spGetUserDetailByUserNameAndPassword", parameters, commandType: CommandType.StoredProcedure)).FirstOrDefault();
                if(userDetail != null)
                {
                    userDetail.ProfileImg = CommonImageUrl.GetProfileImageUrl(_context.HttpContext.Request.Host.Value
                                 , this._environment.WebRootPath, userDetail.Gender,userDetail.ProfileImg);

                }
                return userDetail;
            }
        }
    }
}
