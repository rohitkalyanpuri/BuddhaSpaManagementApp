using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using BuddhaRelaxSpaApp.Entities.Client;
using BuddhaRelaxSpaApp.Models;
using BuddhaRelaxSpaApp.Repository.Interfaces.Repository_Interface;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BuddhaRelaxSpaApp.Controllers
{
    [Route("api/dashboard")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        IClientRepository _clientRepository;
        private readonly IHttpContextAccessor _context;

        public DashboardController(IClientRepository clientRepository, IHttpContextAccessor context, IHostingEnvironment environment)
        {
            _clientRepository = clientRepository; _context = context; 
        }


        [HttpGet, Route("getdashboard/{userid:long}")]
        public async Task<IActionResult> GetDashBoardDetails(long userid)
        {
            var response = new SingleResponse<DashBoardDetail>();
            try
            {
                DashBoardDetail DashBoardDetail = new DashBoardDetail();
                DashBoardDetail = await _clientRepository.GetDashBoardDetail(userid);

                DashBoardDetail.TherapyLogs = await _clientRepository.GetTherapyLogs(string.Empty,string.Empty);
                
                //DashBoardDetail.ClientInvoices = await _clientRepository.GetInvoices();
                response.Model = DashBoardDetail;
                response.Status = (int)HttpStatusCode.OK;
            }
            catch (Exception ex)
            {
                response.DidError = true;
                response.Model = null;
                response.Status = (int)HttpStatusCode.InternalServerError;
                response.Message = "There is internal server error.";
                response.ErrorMessage = ex.Message;
            }
            return response.ToHttpResponse();
        }
    }
}