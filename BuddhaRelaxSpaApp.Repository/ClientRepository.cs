using BuddhaRelaxSpaApp.Entities.Client;
using BuddhaRelaxSpaApp.Entities.Employee;
using BuddhaRelaxSpaApp.Repository.Interfaces.Repository_Interface;
using Dapper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BuddhaRelaxSpaApp.Repository
{
    public class ClientRepository : IClientRepository
    {
        private readonly IConfiguration _config;
        private readonly IHttpContextAccessor _context;
        private IHostingEnvironment _environment;
        public ClientRepository(IConfiguration config, IHttpContextAccessor context, IHostingEnvironment environment)
        {
            _config = config; _context = context; _environment = environment;
        }
        internal IDbConnection DbConnection => new SqlConnection(_config.GetConnectionString("SQLDBConnectionString"));

        public async Task AddClient(Client entity)
        {
            using (IDbConnection con = DbConnection)
            {
                DynamicParameters parameters = new DynamicParameters();
                string insertQuery = @"INSERT INTO [dbo].[tblClient] ([ClientName],[MemberName],[CardNo],[DateOfBirth],[Gender],[Address],[City],[State],[Phone],[CustomerImage],[CustomerQRCode]
                                       ,[TherapyPreference],[InjuryOrDisease],[MassagePreference],[PainingArea],[MassageCount],[MassageBalance],[MassageTime]
                                       ,[CompanyId],[BranchId]) 
                                       VALUES (@ClientName, @MemberName, @CardNo, @DateOfBirth, @Gender, @Address,@City,@State,@Phone,@CustomerImage,@CustomerQRCode
                                        ,@TherapyPreference,@InjuryOrDisease,@MassagePreference,@PainingArea,@MassageCount,@MassageBalance,@MassageTime
                                        ,@CompanyId,@BranchId)
                                       SELECT CAST(SCOPE_IDENTITY() as bigint)";
                entity.ClientId = await con.ExecuteScalarAsync<long>(insertQuery, entity);

            }
        }

        public async Task DeleteClient(long ClientId)
        {
            using (IDbConnection con = DbConnection)
            {
                DynamicParameters parameters = new DynamicParameters();
                string updateQuery = @"UPDATE [dbo].[tblClient] SET [IsDeleted] = 1  WHERE [ClientId]=@ClientId";
                var result = await con.ExecuteAsync(updateQuery, new
                {
                    ClientId
                });
            }
        }

        public async Task<IEnumerable<Client>> GetAllClients(int RowNumber)
        {
            using (IDbConnection con = DbConnection)
            {
                DynamicParameters parameters = new DynamicParameters();
                parameters.Add("RowNumber", RowNumber);
                IEnumerable<Client> clients = (await SqlMapper.QueryAsync<Client>(con, "spGetClients", parameters, commandType: CommandType.StoredProcedure));
                return clients;
            }
        }

        public async Task<Client> GetClientById(long ClientId)
        {
            using (IDbConnection con = DbConnection)
            {
                DynamicParameters parameters = new DynamicParameters();
                parameters.Add("ClientId", ClientId);
                Client client = (await SqlMapper.QueryAsync<Client>(con, "spGetClientById", parameters, commandType: CommandType.StoredProcedure)).FirstOrDefault();
                return client;
            }

        }

        public IEnumerable<Client> GetClientsByFilter(string ClientName, string Phone, string Email = "", bool IsAdding = false)
        {
            using (IDbConnection con = DbConnection)
            {
                string Condition = string.Empty;
                if (!string.IsNullOrEmpty(ClientName))
                    Condition += " CL.ClientName like '%" + ClientName + "%'";
                if (IsAdding)
                {
                    if (!string.IsNullOrEmpty(Phone))
                        Condition += " OR CL.Phone like '%" + Phone + "%'";
                }
                else
                {
                    if (!string.IsNullOrEmpty(Phone))
                        Condition += " AND CL.Phone like '%" + Phone + "%'";
                }
                DynamicParameters parameters = new DynamicParameters();
                parameters.Add("Query", Condition);
                IEnumerable<Client> clients = (SqlMapper.Query<Client>(con, "spGetClientWithFilter", parameters, commandType: CommandType.StoredProcedure));
                return clients;
            }
        }

        public async Task UpdateClient(Client entity)
        {

            using (IDbConnection con = DbConnection)
            {
                DynamicParameters parameters = new DynamicParameters();
                string updateQuery = @"UPDATE [dbo].[tblClient] SET [ClientName]=@ClientName,
                                                                     [MemberName]=@MemberName,
                                                                     [CardNo]=@CardNo,
                                                                     [DateOfBirth]=@DateOfBirth,
                                                                     [Gender]=@Gender,
                                                                     [Address]=@Address,
                                                                     [City]=@City,
                                                                     [State]=@State,
                                                                     [Phone]=@Phone,
                                                                     [TherapyPreference] = @TherapyPreference, 
                                                                     [InjuryOrDisease] = @InjuryOrDisease,
                                                                     [MassagePreference] = @MassagePreference,
                                                                     [PainingArea] = @PainingArea,
                                                                     [MassageCount]=@MassageCount,
                                                                     [MassageBalance]=@MassageBalance,
                                                                     [MassageTime]=@MassageTime
                                                      
                                                                     WHERE [ClientId]=@ClientId";
                await con.ExecuteAsync(updateQuery, new
                {
                    entity.ClientName,
                    entity.MemberName,
                    entity.CardNo,
                    entity.DateOfBirth,
                    entity.Gender,
                    entity.Address,
                    entity.City,
                    entity.State,
                    entity.Phone,
                    entity.TherapyPreference,
                    entity.InjuryOrDisease,
                    entity.MassagePreference,
                    entity.PainingArea,
                    entity.MassageCount,
                    entity.MassageBalance,
                    entity.MassageTime,
                    entity.ClientId
                    
                });

            }
        }

        public async Task UpdateClientQRCode(string CustomerQRCode, long ClientId)
        {

            using (IDbConnection con = DbConnection)
            {
                DynamicParameters parameters = new DynamicParameters();
                string updateQuery = @"UPDATE [dbo].[tblClient] SET [CustomerQRCode]=@CustomerQRCode WHERE [ClientId]=@ClientId";
                await con.ExecuteAsync(updateQuery, new
                {
                    CustomerQRCode,
                    ClientId

                });

            }
        }
        #region Client Invoice


        public async Task AddClientInvoice(ClientInvoice clientInvoice)
        {
            using (IDbConnection con = DbConnection)
            {
                clientInvoice.CreatedDate = DateTime.Now;
                DynamicParameters parameters = new DynamicParameters();
                string insertQuery = @"INSERT INTO [dbo].[tblClientInvoice] ([ReceiptDate],[ClientName],[MemberShipNo],[Mobile],[PaymentMode],[AmountInWord],[Amount],[CreatedDate]) 
                                       VALUES (@ReceiptDate, @ClientName, @MemberShipNo, @Mobile, @PaymentMode, @AmountInWord,@Amount,@CreatedDate)
                                       SELECT CAST(SCOPE_IDENTITY() as bigint)";
                clientInvoice.ReceiptNo = await con.ExecuteScalarAsync<long>(insertQuery, clientInvoice);
            }
        }

        public async Task<IEnumerable<ClientInvoice>> GetInvoicesByClientId(long ClientId)
        {
            using (IDbConnection con = DbConnection)
            {
                DynamicParameters parameters = new DynamicParameters();
                parameters.Add("ClientId", ClientId);
                IEnumerable<ClientInvoice> clientInvoices = (await SqlMapper.QueryAsync<ClientInvoice>(con, "spGetInvoicesByClientId", parameters, commandType: CommandType.StoredProcedure));
                return clientInvoices;
            }
        }

        public async Task UpdateInvoice(ClientInvoice clientInvoice)
        {
            using (IDbConnection con = DbConnection)
            {
                DynamicParameters parameters = new DynamicParameters();
                string updateQuery = @"UPDATE [dbo].[tblClientInvoice]
                                                SET  [PaymentMode] = @PaymentMode
                                                    ,[AmountInWord] = @AmountInWord
                                                    ,[Amount] = @Amount
                                                    ,[InvoiceFileName] = @InvoiceFileName
                                                    WHERE [ReceiptNo]=@ReceiptNo";
                await con.ExecuteAsync(updateQuery, new
                {
                    clientInvoice.PaymentMode,
                    clientInvoice.AmountInWord,
                    clientInvoice.Amount,
                    clientInvoice.InvoiceFileName,
                    clientInvoice.ReceiptNo

                });

            }
        }

        public async Task<IEnumerable<ClientInvoice>> GetInvoices()
        {
            using (IDbConnection con = DbConnection)
            {
                DynamicParameters parameters = new DynamicParameters();
                IEnumerable<ClientInvoice> clientInvoices  = (await SqlMapper.QueryAsync<ClientInvoice>(con, "spGetInvoices", commandType: CommandType.StoredProcedure));
                return clientInvoices;
            }
        }

        public async Task<DashBoardDetail> GetDashBoardDetail(long userid)
        {
            using (IDbConnection con = DbConnection)
            {
                DynamicParameters parameters = new DynamicParameters();
                parameters.Add("UserId", userid);
                DashBoardDetail dashBoardDetail  = (await SqlMapper.QueryAsync<DashBoardDetail>(con, "spDashboardDetails", parameters, commandType: CommandType.StoredProcedure)).FirstOrDefault();

                dashBoardDetail.MassageTherapist= (await SqlMapper.QueryAsync<EmployeeMinEnt>(con, "spGetMassageTherapist", parameters, commandType: CommandType.StoredProcedure));
                return dashBoardDetail;
            }
        }

        public async Task AddTherapyLog(TherapyLogs therapyLogs)
        {
            using (IDbConnection con = DbConnection)
            {
                
                DynamicParameters parameters = new DynamicParameters();
                string insertQuery = @"INSERT INTO [dbo].[tblTherapyLogs] ([ClientId],[ClientName],[EmployeeId],[StartDatetime],[EndDateTime]) 
                                       VALUES (@ClientId, @ClientName, @EmployeeId, @StartDatetime, @EndDateTime)
                                       SELECT CAST(SCOPE_IDENTITY() as bigint)";
                therapyLogs.LogId = await con.ExecuteScalarAsync<long>(insertQuery, therapyLogs);
            }
        }
        public async Task UpdateTherapyLog(TherapyLogs therapyLogs)
        {
            using (IDbConnection con = DbConnection)
            {
                DynamicParameters parameters = new DynamicParameters();
                string updateQuery = @"UPDATE [dbo].[tblTherapyLogs]
                                                SET  [ClientId] = @ClientId
                                                    ,[ClientName] = @ClientName
                                                    ,[EmployeeId] = @EmployeeId
                                                    ,[StartDatetime]  = @StartDatetime
                                                    ,[EndDateTime] = @EndDateTime
                                                    ,[MassageTime] =@CompletedMassageTime
                                                    ,[IsCompleted] = @IsCompleted
                                                    ,[RoomNo] = @RoomNo
                                                    ,[IsStarted]=@IsStarted
                                                    ,[IsDeleted]=@IsDeleted
                                                    ,[DeleteReason]=@DeleteReason
                                                    WHERE [LogId]=@LogId";
                await con.ExecuteAsync(updateQuery, new
                {
                    therapyLogs.ClientId,
                    therapyLogs.ClientName,
                    therapyLogs.EmployeeId,
                    therapyLogs.StartDatetime,
                    therapyLogs.EndDateTime,
                    therapyLogs.CompletedMassageTime,
                    therapyLogs.IsCompleted,
                    therapyLogs.RoomNo,
                    therapyLogs.IsStarted,
                    therapyLogs.IsDeleted,
                    therapyLogs.DeleteReason,
                    therapyLogs.LogId

                });

            }
        }

        public async Task<IEnumerable<TherapyLogs>> GetTherapyLogs(string FromDate , string ToDate)
        {
            using (IDbConnection con = DbConnection)
            {
                DynamicParameters parameters = new DynamicParameters();
                if(string.IsNullOrEmpty(FromDate) || string.IsNullOrEmpty(ToDate))
                {
                    FromDate = DateTime.Now.AddDays(-3).ToString("yyyy-MM-dd");
                    ToDate = DateTime.Now.ToString("yyyy-MM-dd");
                }
                parameters.Add("FromDate",FromDate);
                parameters.Add("ToDate", ToDate);
                IEnumerable<TherapyLogs> therapyLogs = (await SqlMapper.QueryAsync<TherapyLogs>(con, "spGetTherapyLogs", parameters, commandType: CommandType.StoredProcedure));
                return therapyLogs;
            }
        }

        public async Task<TherapyLogs> GetTherapyLogById(long LogId)
        {
            using (IDbConnection con = DbConnection)
            {
                DynamicParameters parameters = new DynamicParameters();
                parameters.Add("LogId", LogId);
                TherapyLogs therapyLogs  = (await SqlMapper.QueryAsync<TherapyLogs>(con, "spGetTherapyLogById", parameters, commandType: CommandType.StoredProcedure)).FirstOrDefault();
                return therapyLogs;
            }
        }

        public async Task<IEnumerable<TherapyLogs>> GetTherapyLogByClientId(long ClientId)
        {
            using (IDbConnection con = DbConnection)
            {
                DynamicParameters parameters = new DynamicParameters();
                parameters.Add("ClientId", ClientId);
                IEnumerable<TherapyLogs> therapyLogs = (await SqlMapper.QueryAsync<TherapyLogs>(con, "spGetTherapyLogByClientId", parameters, commandType: CommandType.StoredProcedure));
                return therapyLogs;
            }
        }




        #endregion

    }
}
