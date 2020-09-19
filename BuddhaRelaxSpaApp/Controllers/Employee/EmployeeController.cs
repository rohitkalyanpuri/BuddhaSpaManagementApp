using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using BuddhaRelaxSpaApp.Entities.Employee;
using BuddhaRelaxSpaApp.Models;
using BuddhaRelaxSpaApp.Repository.Interfaces.Repository_Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;


namespace BuddhaRelaxSpaApp.Controllers.Employee
{
    //[Authorize(AuthenticationSchemes = "Bearer")]
    [ApiController]
    [Route("api/employee")]
    public class EmployeeController : ControllerBase
    {

        IEmployeeRepository _employeeRepository;
        private readonly IHttpContextAccessor _context;
        private IHostingEnvironment _environment;

        public EmployeeController(IEmployeeRepository employeeRepository, IHttpContextAccessor context, IHostingEnvironment environment)
        {
            _employeeRepository = employeeRepository; _context = context; _environment = environment;
        }

        [HttpPost, Route("addemployee")]
        public async Task<IActionResult> AddEmployee(EmployeeEnt employeeEnt)
        {
            var response = new SingleResponse<EmployeeEnt>();
            try
            {
                //Check ClientName, Gender, Phone
                if (string.IsNullOrEmpty(employeeEnt.FirstName) || string.IsNullOrEmpty(employeeEnt.LastName) 
                    || string.IsNullOrEmpty(employeeEnt.Gender) 
                    || string.IsNullOrEmpty(employeeEnt.MobileNumber)
                    || string.IsNullOrEmpty(employeeEnt.UserName)
                    || string.IsNullOrEmpty(employeeEnt.Password)
                    || employeeEnt.RoleId==0)
                {
                    response.Message = "All (*) marked fields are mandatory.";
                    response.Status = (int)HttpStatusCode.BadRequest;
                    return response.ToHttpResponse();
                }
                List<KeyValuePair<string, string>> responses = IsPhoneNoAndEmailExist(employeeEnt.FirstName, employeeEnt.MobileNumber);
                if (responses.Count > 0)
                {
                    response.Message = responses[0].Value;
                    response.Status = (int)HttpStatusCode.BadRequest;
                    return response.ToHttpResponse();
                }
                else
                {
                    
                    await _employeeRepository.AddEmp(employeeEnt);
                    response.Model = await _employeeRepository.GetEmpById(employeeEnt.EmployeeId);
                    response.Message = "Employee Created Successfully.";
                    response.Status = (int)HttpStatusCode.OK;
                }
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

        [HttpPut, Route("updateemployee")]
        public async Task<IActionResult> UpdateClient(EmployeeEnt employeeEnt)
        {
            var response = new SingleResponse<EmployeeEnt>();
            try
            {
                //Check ClientName, Gender, Phone
                if (string.IsNullOrEmpty(employeeEnt.FirstName) || string.IsNullOrEmpty(employeeEnt.LastName) 
                    || string.IsNullOrEmpty(employeeEnt.Gender) 
                    || string.IsNullOrEmpty(employeeEnt.MobileNumber)
                    || string.IsNullOrEmpty(employeeEnt.UserName)
                    || string.IsNullOrEmpty(employeeEnt.Password)
                    || employeeEnt.RoleId == 0)
                {
                    response.Message = "All (*) marked fields are mandatory.";
                    response.Status = (int)HttpStatusCode.BadRequest;
                    return response.ToHttpResponse();
                }
                List<KeyValuePair<string, string>> responses = IsPhoneNoAndEmailExist(employeeEnt.FirstName, employeeEnt.MobileNumber,employeeEnt.EmployeeId);
                if (responses.Count > 0)
                {
                    response.Message = responses[0].Value;
                    response.Status = (int)HttpStatusCode.BadRequest;
                    return response.ToHttpResponse();
                }
                else
                {
                    await _employeeRepository.UpdateEmp(employeeEnt);
                    response.Model = await _employeeRepository.GetEmpById(employeeEnt.EmployeeId);
                    response.Message = "Employee Update Successfully.";
                    response.Status = (int)HttpStatusCode.OK;
                }
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


        [HttpGet, Route("getemployeebyid/{employeeid:long}")]
        public async Task<IActionResult> GetClientById(long employeeid)
        {
            var response = new SingleResponse<EmployeeEnt>();

            try
            {
                response.Model = await _employeeRepository.GetEmpById(employeeid);
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


        [HttpGet, Route("getallemployee")]
        public async Task<IActionResult> GetAllEmployees(long companyId , long userId)
        {
            var response = new ListResponse<EmployeeEnt>();
            try
            {
                response.Model = await _employeeRepository.GetAllEmp(companyId, userId);
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

        [HttpGet, Route("getmassagetherapist")]
        public async Task<IActionResult> GetMassageTherapist(long branchId)
        {
            var response = new ListResponse<EmployeeEnt>();
            try
            {
                response.Model = (await _employeeRepository.GetEmpBranchId(branchId)).Where(x=>x.RoleId==4);
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

        [HttpDelete, Route("deleteemployeebyid/{employeeid:long}")]
        public async Task<IActionResult> DeleteEmployeeById(long employeeid)
        {
            var response = new Response();

            try
            {
                await _employeeRepository.DeleteEmp(employeeid);
                response.Status = (int)HttpStatusCode.OK;
                response.Message = "Employee Deleted Successfully.";
            }
            catch (Exception ex)
            {
                response.DidError = true;
                response.Status = (int)HttpStatusCode.InternalServerError;
                response.Message = "There is internal server error.";
                response.ErrorMessage = ex.Message;
            }
            return response.ToHttpResponse();
        }

        [HttpGet, Route("getemployeebyfiler")]
        public IActionResult GetEmployeeByFilter(string EmployeeName, string Phone)
        {
            var response = new ListResponse<EmployeeEnt>();
            try
            {

                response.Model = _employeeRepository.GetEmployeesByFilter(EmployeeName,Phone);
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

        [HttpGet, Route("getexpenses")]
        public async Task<IActionResult> GetExpenses(long companyId, long userId,long branchId,int lastdays=30)
        {
            var response = new ListResponse<ExpensesEntDc>();
            try
            {
                response.Model = await _employeeRepository.GetExpenses(userId, companyId, branchId,lastdays);
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

        [HttpPost, Route("addexpenses")]
        public async Task<IActionResult> AddExpenses(ExpensesEnt expensesEntDc)
        {
            var response = new SingleResponse<ExpensesEntDc>();
            try
            {
                //Check ClientName, Gender, Phone
                if (string.IsNullOrEmpty(expensesEntDc.Note) || string.IsNullOrEmpty(expensesEntDc.TransactionType) || expensesEntDc.Amount == 0)
                {
                    response.Message = "All (*) marked fields are mandatory.";
                    response.Status = (int)HttpStatusCode.BadRequest;
                    return response.ToHttpResponse();
                }
                else
                {
                    expensesEntDc.CreatedDate = DateTime.Now;
                    await _employeeRepository.AddExpnses(expensesEntDc);
                    response.Model = await _employeeRepository.GetExpensesById(expensesEntDc.ExpensesId);
                    response.Message = "Expenses Created Successfully.";
                    response.Status = (int)HttpStatusCode.OK;
                }
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

        [HttpGet, Route("getexpensesgroupbyemployee")]
        public async Task<IActionResult> GetExpensesGroupByEmployee(long companyId, long branchId)
        {
            var response = new ListResponse<ExpensesEntDc>();
            try
            {
                response.Model = await _employeeRepository.GetExpensesGroupByEmployee(companyId, branchId);
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
        private List<KeyValuePair<string, string>> IsPhoneNoAndEmailExist(string EmployeeName, string Phone, long EmployeeId = 0)
        {
            List<KeyValuePair<string, string>> responses = new List<KeyValuePair<string, string>>();
            bool isPhoneEmailExists = false;

            if (EmployeeId > 0) //Edit
            {
                isPhoneEmailExists = (_employeeRepository.GetEmployeesByFilter(EmployeeName, Phone, "", true)).Where(x => x.EmployeeId != EmployeeId && x.MobileNumber == Phone).Any();
            }
            else //Add
            {
                isPhoneEmailExists = (_employeeRepository.GetEmployeesByFilter(EmployeeName, Phone, "", true)).Where(x => x.MobileNumber == Phone).Any();
            }
            if ((isPhoneEmailExists))
            {
                KeyValuePair<string, string> mesgStr = new KeyValuePair<string, string>("Key", "Phone Number already exists.");
                responses.Add(mesgStr);
            }

            return responses;
        }
    }
}