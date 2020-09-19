using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using BuddhaRelaxSpaApp.Entities.Authentication;
using BuddhaRelaxSpaApp.Models;
using BuddhaRelaxSpaApp.Repository.Interfaces.Repository_Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace BuddhaRelaxSpaApp.Controllers.Employee
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        IAuthenticationRepository _authentication ;

        public AuthController(IAuthenticationRepository authentication)
        {
            _authentication = authentication;
        }

        IConfigurationRoot _configuration = new ConfigurationBuilder()
            .AddJsonFile(Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json"))
            .Build();

        [HttpPost, Route("login")]
        public async Task<IActionResult> Login([FromBody]Request request)
        {
            var response = new SingleResponse<UserDetail>();
            var test = _configuration["SecretKey"];
            UserDetail userDetail  = new UserDetail();
            try
            {
                userDetail = await _authentication.GetUserDetail(request.email,request.password);
                if (userDetail == null)
                {
                    response.Message = "Invalid Email or Password.";
                    response.Status = (int)HttpStatusCode.BadRequest;
                    response.IsAuthenticated = false;
                    return response.ToHttpResponse();
                }

                response.Status = (int)HttpStatusCode.OK;
                response.Model = userDetail;
                response.IsAuthenticated = true;

                var claims = new[]
                {
                    new Claim("userid",Convert.ToString(userDetail.UserId)),
                    new Claim("usertype",Convert.ToString(userDetail.UserType)),
                    new Claim("roleid",Convert.ToString(userDetail.RoleId)),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                };

                var token = new JwtSecurityToken
                (
                    issuer: "",
                    audience: "",
                    claims: claims,
                    signingCredentials: new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["SecretKey"])),
                            SecurityAlgorithms.HmacSha256)
                );

                response.Token = new JwtSecurityTokenHandler().WriteToken(token);

            }
            catch (Exception ex)
            {
                response.DidError = true;
                response.IsAuthenticated = false;
                response.Model = null;
                response.Status = (int)HttpStatusCode.InternalServerError;
                response.Message = "There is internal server error.";
                response.ErrorMessage = ex.Message;
            }

            return response.ToHttpResponse();
        }
    }
}