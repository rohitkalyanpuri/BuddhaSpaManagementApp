using System;
using System.Collections.Generic;
using System.Net;
using System.Linq;
using System.Threading.Tasks;
using BuddhaRelaxSpaApp.Entities.Client;
using BuddhaRelaxSpaApp.Models;
using BuddhaRelaxSpaApp.Repository.Interfaces.Repository_Interface;
using BuddhaRelaxSpaApp.Utility;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IO;
using Microsoft.AspNetCore.Authorization;

namespace BuddhaRelaxSpaApp.Controllers.Employee
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    [ApiController]
    [Route("api/client")]
    public class ClientController : ControllerBase
    {
        IClientRepository _clientRepository;
        private readonly IHttpContextAccessor _context;
        private IHostingEnvironment _environment;
        public ClientController(IClientRepository clientRepository, IHttpContextAccessor context, IHostingEnvironment environment)
        {
            _clientRepository = clientRepository; _context = context; _environment = environment;
        }

        [HttpGet, Route("getclients/{rownumber:int}")]
        public async Task<IActionResult> GetClients(int rownumber = 0)
        {
            var response = new ListResponse<Client>();
            try
            {

                response.Model = await _clientRepository.GetAllClients(rownumber);
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

        [HttpGet, Route("getclientbyfiler")]
        public IActionResult GetClientByFilter(string ClientName, string Phone)
        {
            var response = new ListResponse<Client>();
            try
            {

                response.Model =  _clientRepository.GetClientsByFilter(ClientName,Phone);
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

        [HttpPost, Route("createclient")]
        public async Task<IActionResult> AddClient(Client client)
        {
            var response = new SingleResponse<Client>();
            try
            {
                //Check ClientName, Gender, Phone
                if (string.IsNullOrEmpty(client.ClientName) || string.IsNullOrEmpty(client.Gender) || string.IsNullOrEmpty(client.DateOfBirth) || string.IsNullOrEmpty(client.Phone))
                {
                    response.Message = "All (*) marked fields are mandatory.";
                    response.Status = (int)HttpStatusCode.BadRequest;
                    return response.ToHttpResponse();
                }
                List<KeyValuePair<string, string>> responses = IsPhoneNoAndEmailExist(client.ClientName,client.Phone);
                if (responses.Count > 0)
                {
                    response.Message = responses[0].Value;
                    response.Status = (int)HttpStatusCode.BadRequest;
                    return response.ToHttpResponse();
                }
                else
                {
                    client.MassageBalance = client.MassageCount;
                    await _clientRepository.AddClient(client);
                    string Url = "http://" + _context.HttpContext.Request.Host.Value + "/scanqrcode/" + client.ClientId;
                    string QRbase64String = GeneralHelper.QRCodeBase64String(Url);
                    await _clientRepository.UpdateClientQRCode(QRbase64String,client.ClientId);
                    response.Model = client;
                    response.Message = "Client Created Successfully.";
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

        [AllowAnonymous]
        [HttpGet, Route("getclientbyid/{clientid:long}")]
        public async Task<IActionResult> GetClientById(long clientid)
        {
            var response = new SingleResponse<Client>();

            try
            {
                response.Model = await _clientRepository.GetClientById(clientid);
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

        [HttpPut, Route("updateclient")]
        public async Task<IActionResult> UpdateClient(Client client)
        {
            var response = new SingleResponse<Client>();
            try
            {
                //Check ClientName, Gender, Phone
                if (string.IsNullOrEmpty(client.ClientName) || string.IsNullOrEmpty(client.Gender) || string.IsNullOrEmpty(client.DateOfBirth) || string.IsNullOrEmpty(client.Phone))
                {
                    response.Message = "All (*) marked fields are mandatory.";
                    response.Status = (int)HttpStatusCode.BadRequest;
                    return response.ToHttpResponse();
                }
                List<KeyValuePair<string, string>> responses = IsPhoneNoAndEmailExist(client.ClientName, client.Phone,client.ClientId);
                if (responses.Count > 0)
                {
                    response.Message = responses[0].Value;
                    response.Status = (int)HttpStatusCode.BadRequest;
                    return response.ToHttpResponse();
                }
                else
                {
                    if (client.IsFromEditPage)
                    {
                        Client clientDetail = await _clientRepository.GetClientById(client.ClientId);
                        int diffCount = client.MassageCount - clientDetail.MassageCount;
                        client.MassageBalance += diffCount;
                    }
                    await _clientRepository.UpdateClient(client);
                    response.Model = client;
                    response.Message = "Client Update Successfully.";
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

        [HttpDelete, Route("deleteclientbyid/{clientid:long}")]
        public async Task<IActionResult> DeleteClientById(long clientid)
        {
            var response = new Response();

            try
            {
                await _clientRepository.DeleteClient(clientid);
                response.Status = (int)HttpStatusCode.OK;
                response.Message = "Client Deleted Successfully.";
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

        [AllowAnonymous]
        [HttpPost, Route("createinvoice")]
        public async Task<IActionResult> CreateClientInvoice(ClientInvoice clientInvoice)
        {
            var response = new SingleResponse<ClientInvoice>();
            try
            {
                //Check Amount
                if (clientInvoice.Amount < 0 || clientInvoice.Amount == null)
                {
                    response.Message = "Invoice of equal to or smaller then zero not permitted.";
                    response.Status = (int)HttpStatusCode.BadRequest;
                    return response.ToHttpResponse();
                }
                else
                {

                    await _clientRepository.AddClientInvoice(clientInvoice);
                    response.Model = clientInvoice;
                    if (clientInvoice.MassageCount > 0)
                    {
                        Client client = await _clientRepository.GetClientById(clientInvoice.MemberShipNo.Value);
                        client.MassageCount = clientInvoice.MassageCount;
                        client.MassageBalance = clientInvoice.MassageCount;
                        await _clientRepository.UpdateClient(client);
                    }

                    string AutoKey = Guid.NewGuid().ToString("N").Substring(0, 8);
                    string InvoicePdf = "Invoice_For_" + clientInvoice.ClientName.Replace(" ", "") + "_" + AutoKey + ".pdf";

                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\Invoices", InvoicePdf);
                    string CompanyLogoUrl = "http://" + _context.HttpContext.Request.Host.Value + "/CompanyLogo1.jpg";
                    string html = GeneralHelper.InvoiceTemplate(clientInvoice.ReceiptNo, clientInvoice.ClientName, "Jodhpur, Raj.", clientInvoice.Amount.Value, clientInvoice.ReceiptDate.Value, clientInvoice.PaymentMode, CompanyLogoUrl);
                    if (GeneralHelper.HtmlToPdfSaveLocation(html, filePath))
                    {
                        clientInvoice.InvoiceFileName = "http://" + _context.HttpContext.Request.Host.Value + "/Invoices/" + InvoicePdf;
                        await _clientRepository.UpdateInvoice(clientInvoice);
                        response.Message = "Invoice Created Successfully. Invoice Number is '" + clientInvoice.ReceiptNo + "'";
                        response.Status = (int)HttpStatusCode.OK;
                    }
                    else
                    {
                        response.Message = "Failed";
                        response.Status = (int)HttpStatusCode.InternalServerError;
                    }
                }
            }
            catch(Exception ex)
            {
                response.DidError = true;
                response.Model = null;
                response.Status = (int)HttpStatusCode.InternalServerError;
                response.Message = "There is internal server error.";
                response.ErrorMessage = ex.Message;
            }
            return response.ToHttpResponse();
        }

        [HttpGet, Route("getinvoicesbyclientid/{clientid:long}")]
        public async Task<IActionResult> GetInvoicesByClientId(long ClientId)
        {
            var response = new ListResponse<ClientInvoice>();
            try
            {

                response.Model = await _clientRepository.GetInvoicesByClientId(ClientId);
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

        [AllowAnonymous]
        [HttpGet, Route("scanqrcode/{clientid:long}")]
        public async Task<IActionResult> ScanQRCode(long ClientId)
        {
            var response = new SingleResponse<ScanQRCode>();

            try
            {
                Client client = await _clientRepository.GetClientById(ClientId);
                ScanQRCode scanQRCode = new ScanQRCode();
                scanQRCode.ClientId = client.ClientId;
                scanQRCode.ClientName = client.ClientName;
                if (client.MassageBalance > 0)
                {
                    
                    #region Create Invoice
                    ClientInvoice clientInvoice = (await _clientRepository.GetInvoicesByClientId(ClientId)).FirstOrDefault();
                    
                    if(clientInvoice == null)
                    {
                        scanQRCode.MassageLeftInPackage = -2;
                        response.Status = (int)HttpStatusCode.OK;
                        response.Model = scanQRCode;
                        return response.ToHttpResponse();
                    }
                    clientInvoice.ReceiptDate = DateTime.Now;
                    clientInvoice.CreatedDate = DateTime.Now;
                    clientInvoice.Amount = 0;
                    await _clientRepository.AddClientInvoice(clientInvoice);
                    string AutoKey = Guid.NewGuid().ToString("N").Substring(0, 8);
                    string InvoicePdf = "Invoice_For_" + clientInvoice.ClientName.Replace(" ", "") + "_" + AutoKey + ".pdf";

                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\Invoices", InvoicePdf);
                    string CompanyLogoUrl = "http://" + _context.HttpContext.Request.Host.Value + "/CompanyLogo1.jpg";
                    string html = GeneralHelper.InvoiceTemplate(clientInvoice.ReceiptNo, clientInvoice.ClientName, "Jodhpur, Raj.", clientInvoice.Amount.Value, clientInvoice.ReceiptDate.Value, clientInvoice.PaymentMode, CompanyLogoUrl);
                    if (GeneralHelper.HtmlToPdfSaveLocation(html, filePath))
                    {
                        clientInvoice.InvoiceFileName = "http://" + _context.HttpContext.Request.Host.Value + "/Invoices/" + InvoicePdf;
                        await _clientRepository.UpdateInvoice(clientInvoice);
                        
                        scanQRCode.MassageLeftInPackage = client.MassageBalance -1 > 0 ? client.MassageBalance - 1  : 0;
                        client.MassageBalance = client.MassageBalance - 1 > 0 ? client.MassageBalance - 1 : 0;
                        await _clientRepository.UpdateClient(client);

                        TherapyLogs therapyLogs = new TherapyLogs();
                        therapyLogs.ClientId = ClientId;
                        therapyLogs.ClientName = clientInvoice.ClientName;
                        therapyLogs.StartDatetime = DateTime.Now;

                        await _clientRepository.AddTherapyLog(therapyLogs);

                        scanQRCode.Message = "Success";
                        response.Message = "Success";
                        response.Status = (int)HttpStatusCode.OK;
                    }
                    else
                    {
                        scanQRCode.MassageLeftInPackage =  - 1;
                        response.Message = "Failed.";
                        response.Status = (int)HttpStatusCode.InternalServerError;
                    }

                    
                }
                else
                {
                    response.Message = "No Massage In Balance.";
                    scanQRCode.MassageLeftInPackage = 0;
                    response.Status = (int)HttpStatusCode.OK;
                }
                response.Model = scanQRCode;
                #endregion

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


        [HttpGet, Route("gettherapylogs")]
        public async Task<IActionResult> GetTherapyLogs(string fromDate, string toDate)
        {
            var response = new ListResponse<TherapyLogs>();
            try
            {

                response.Model = await _clientRepository.GetTherapyLogs(fromDate,toDate);
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

        [HttpGet, Route("gettherapylogbyid/{LogId:long}")]
        public async Task<IActionResult> GetTherapyLogById(long LogId)
        {
            var response = new SingleResponse<TherapyLogs>();
            try
            {

                response.Model = await _clientRepository.GetTherapyLogById(LogId);
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

        [HttpGet, Route("gettherapylogbyclientid/{ClientId:long}")]
        public async Task<IActionResult> GetTherapyLogByClientId(long ClientId)
        {
            var response = new ListResponse<TherapyLogs>();
            try
            {

                response.Model = await _clientRepository.GetTherapyLogByClientId(ClientId);
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

        [HttpPut, Route("updatetherapylog")]
        public async Task<IActionResult> UpdateTherapyLog(TherapyLogs therapyLogs)
        {
            var response = new SingleResponse<TherapyLogs>();
            try
            {
                //Check ClientName, Gender, Phone
                if (therapyLogs.EmployeeId == null || therapyLogs.EmployeeId==0)
                {
                    response.Message = "All (*) marked fields are mandatory.";
                    response.Status = (int)HttpStatusCode.BadRequest;
                    return response.ToHttpResponse();
                }
                
                else
                {
                    
                    await _clientRepository.UpdateTherapyLog(therapyLogs);
                    response.Model = await _clientRepository.GetTherapyLogById(therapyLogs.LogId);
                    response.Message = "Log Update Successfully.";
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

        [HttpPut, Route("assignmassagetherapist")]
        public async Task<IActionResult> AssignMassageTherapist(TherapyLogs therapyLogs)
        {
            var response = new Response();
            try
            {
                TherapyLogs tblTherapyLogs = await _clientRepository.GetTherapyLogById(therapyLogs.LogId);
                tblTherapyLogs.EmployeeId = therapyLogs.EmployeeId;

                await _clientRepository.UpdateTherapyLog(tblTherapyLogs);

                response.Status = (int)HttpStatusCode.OK;
                response.Message = "Record Updated Successfully.";
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

        [HttpPut, Route("assignroomno")]
        public async Task<IActionResult> AssignRoomNo(TherapyLogs therapyLogs)
        {
            var response = new Response();
            try
            {
                TherapyLogs tblTherapyLogs = await _clientRepository.GetTherapyLogById(therapyLogs.LogId);
                tblTherapyLogs.RoomNo = therapyLogs.RoomNo;

                await _clientRepository.UpdateTherapyLog(tblTherapyLogs);

                response.Status = (int)HttpStatusCode.OK;
                response.Message = "Record Updated Successfully.";
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

        [HttpPut, Route("completemassagesession")]
        public async Task<IActionResult> CompleteMassageSession(TherapyLogs therapyLogs)
        {
            var response = new Response();
            try
            {
                TherapyLogs tblTherapyLogs = await _clientRepository.GetTherapyLogById(therapyLogs.LogId);
                tblTherapyLogs.IsCompleted = therapyLogs.IsCompleted;
                tblTherapyLogs.EndDateTime = DateTime.Now;
                await _clientRepository.UpdateTherapyLog(tblTherapyLogs);

                response.Status = (int)HttpStatusCode.OK;
                response.Message = "Record Updated Successfully.";
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

        [HttpPut, Route("setstartedmassagetime")]
        public async Task<IActionResult> SetStartedMassageTime(TherapyLogs therapyLogs)
        {
            var response = new Response();
            try
            {
                TherapyLogs tblTherapyLogs = await _clientRepository.GetTherapyLogById(therapyLogs.LogId);
                tblTherapyLogs.IsStarted = therapyLogs.IsStarted;
                tblTherapyLogs.CompletedMassageTime = therapyLogs.CompletedMassageTime;
                await _clientRepository.UpdateTherapyLog(tblTherapyLogs);

                response.Status = (int)HttpStatusCode.OK;
                response.Message = "Record Updated Successfully.";
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

        [HttpPut, Route("deletemassage")]
        public async Task<IActionResult> DeleteMassage(TherapyLogs therapyLogs)
        {
            var response = new Response();
            try
            {
                if (!string.IsNullOrEmpty(therapyLogs.DeleteReason))
                {
                    TherapyLogs tblTherapyLogs = await _clientRepository.GetTherapyLogById(therapyLogs.LogId);
                    tblTherapyLogs.IsDeleted = therapyLogs.IsDeleted;
                    tblTherapyLogs.DeleteReason = therapyLogs.DeleteReason;
                    await _clientRepository.UpdateTherapyLog(tblTherapyLogs);

                    response.Status = (int)HttpStatusCode.OK;
                    response.Message = "Record Updated Successfully.";
                }
                else
                {
                    response.Status = (int)HttpStatusCode.BadRequest;
                    response.Message = "Delete Reason Cannot be empty.";
                }
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
        private List<KeyValuePair<string, string>> IsPhoneNoAndEmailExist(string ClientName, string Phone, long ClientId = 0)
        {
            List<KeyValuePair<string, string>> responses = new List<KeyValuePair<string, string>>();
            bool isClientPhoneEmailExists = false;

                if (ClientId > 0) //Edit
                {
                  isClientPhoneEmailExists = (_clientRepository.GetClientsByFilter(ClientName, Phone, "", true)).Where(x => x.ClientId != ClientId &&  x.Phone==Phone).Any();
                }
                else //Add
                {
                  isClientPhoneEmailExists = (_clientRepository.GetClientsByFilter(ClientName, Phone, "", true)).Where(x => x.Phone == Phone).Any();
                }
                if ((isClientPhoneEmailExists))
                {
                    KeyValuePair<string, string> mesgStr = new KeyValuePair<string, string>("Key", "Phone Number already exists.");
                    responses.Add(mesgStr);
                }

            return responses;
        }

    }
}