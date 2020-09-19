using BuddhaRelaxSpaApp.Entities.Authentication;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;

namespace BuddhaRelaxSpaApp.Utility
{
    public class JWTHelper
    {
        public static UserDetail GetDetailsFromHeader(string authHeader)
        {
            var handler = new JwtSecurityTokenHandler();
            authHeader = authHeader.Replace("Bearer ", "");
            var jsonToken = handler.ReadToken(authHeader);
            var tokenS = handler.ReadToken(authHeader) as JwtSecurityToken;

            UserDetail Customer = new UserDetail();
            Customer.UserId = Convert.ToInt32(tokenS.Claims.First(claim => claim.Type == "userid").Value);
            Customer.UserType = Convert.ToString(tokenS.Claims.First(claim => claim.Type == "usertype").Value);
            Customer.RoleId = Convert.ToInt32(tokenS.Claims.First(claim => claim.Type == "roleid").Value);
            return Customer;
        }
    }
}
