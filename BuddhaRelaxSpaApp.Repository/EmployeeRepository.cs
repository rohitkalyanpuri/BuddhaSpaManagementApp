using BuddhaRelaxSpaApp.Entities.Employee;
using BuddhaRelaxSpaApp.Repository.Interfaces.Repository_Interface;
using Dapper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BuddhaRelaxSpaApp.Repository
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly IConfiguration _config;
        private readonly IHttpContextAccessor _context;
        private IHostingEnvironment _environment;
        public EmployeeRepository(IConfiguration config, IHttpContextAccessor context, IHostingEnvironment environment)
        {
            _config = config; _context = context; _environment = environment;
        }

        internal IDbConnection DbConnection => new SqlConnection(_config.GetConnectionString("SQLDBConnectionString"));

        #region Employee
        public async Task AddEmp(EmployeeEnt entity)
        {
            using (IDbConnection con = DbConnection)
            {
                DynamicParameters parameters = new DynamicParameters();
                string insertQuery = @"INSERT INTO [dbo].[tblEmployee]
                                        ([RoleId],[FirstName],[LastName],[EmailId],[MobileNumber],[Gender]
                                        ,[Address],[ProfileImg],[IsActive],[CreatedBy],[CreatedDate]
                                        ,[IsDelete],[CompanyId],[BranchId]) 
    
                                       VALUES(@RoleId,@FirstName,@LastName,@EmailId,@MobileNumber,@Gender
                                        ,@Address,@ProfileImg,@IsActive,@CreatedBy,@CreatedDate
                                        ,@IsDelete,@CompanyId,@BranchId)
                                       SELECT CAST(SCOPE_IDENTITY() as bigint)";

                entity.EmployeeId = await con.ExecuteScalarAsync<long>(insertQuery, entity);

                entity.UserType = "Employee";

                insertQuery = @"INSERT INTO [dbo].[tblAuthentication]
                                ([UserId],[UserType],[UserName],[Password],[CreatedDate])
                             VALUES
                                (@EmployeeId,@UserType,@UserName,@Password,@CreatedDate)";
                await con.ExecuteScalarAsync<long>(insertQuery, entity);

            }
        }



        public async Task DeleteEmp(long id)
        {
            using (IDbConnection con = DbConnection)
            {
                DynamicParameters parameters = new DynamicParameters();
                string updateQuery = @"UPDATE [dbo].[tblEmployee] SET [IsDelete] = 1  WHERE [EmployeeId]=@id";
                var result = await con.ExecuteAsync(updateQuery, new
                {
                    id
                });
            }
        }


        public async Task<IEnumerable<EmployeeEnt>> GetAllEmp(long CompanyId, long UserId)
        {
            using (IDbConnection con = DbConnection)
            {
                DynamicParameters parameters = new DynamicParameters();
                parameters.Add("CompanyId", CompanyId);
                parameters.Add("UserId", UserId);
                IEnumerable<EmployeeEnt> Employees = (await SqlMapper.QueryAsync<EmployeeEnt>(con, "spGetAllEmployees", parameters, commandType: CommandType.StoredProcedure));
                return Employees;
            }
        }

        public async Task<IEnumerable<EmployeeEnt>> GetEmpBranchId(long BranchId)
        {
            using (IDbConnection con = DbConnection)
            {
                DynamicParameters parameters = new DynamicParameters();
                parameters.Add("BranchId ", BranchId);
                IEnumerable<EmployeeEnt> Employees = (await SqlMapper.QueryAsync<EmployeeEnt>(con, "spGetEmployeeByBranchId", parameters, commandType: CommandType.StoredProcedure));
                return Employees;
            }
        }

        public async Task<EmployeeEnt> GetEmpById(long id)
        {
            using (IDbConnection con = DbConnection)
            {
                DynamicParameters parameters = new DynamicParameters();
                parameters.Add("EmployeeId", id);
                EmployeeEnt employeeEnt = (await SqlMapper.QueryAsync<EmployeeEnt>(con, "spGetEmployeeById", parameters, commandType: CommandType.StoredProcedure)).FirstOrDefault();
                return employeeEnt;
            }
        }

        public IEnumerable<EmployeeEnt> GetEmployeesByFilter(string EmployeeName, string Phone, string Email = "", bool IsAdding = false)
        {
            using (IDbConnection con = DbConnection)
            {
                string Condition = string.Empty;
                if (!string.IsNullOrEmpty(EmployeeName))
                    Condition += " AND (EMP.FirstName like '%" + EmployeeName + "%' OR EMP.LastName like '%" + EmployeeName + "%')";
                if (IsAdding)
                {
                    if (!string.IsNullOrEmpty(Phone))
                        Condition += " OR EMP.MobileNumber like '%" + Phone + "%'";
                }
                else
                {
                    if (!string.IsNullOrEmpty(Phone))
                        Condition += " AND EMP.MobileNumber like '%" + Phone + "%'";
                }
                DynamicParameters parameters = new DynamicParameters();
                parameters.Add("Query", Condition);
                IEnumerable<EmployeeEnt> employeeEnts = (SqlMapper.Query<EmployeeEnt>(con, "spGetEmployeeWithFilter", parameters, commandType: CommandType.StoredProcedure));
                return employeeEnts;
            }
        }

        public async Task UpdateEmp(EmployeeEnt entity)
        {
            entity.ModifyDate = DateTime.Now;
            using (IDbConnection con = DbConnection)
            {
                DynamicParameters parameters = new DynamicParameters();
                string updateQuery = @"UPDATE [dbo].[tblEmployee] SET [RoleId]=@RoleId,
                                                                     [FirstName]=@FirstName,
                                                                     [LastName]=@LastName,
                                                                     [EmailId]=@EmailId,
                                                                     [Gender]=@Gender,
                                                                     [Address]=@Address,
                                                                     [MobileNumber]=@MobileNumber,
                                                                     [IsActive] = @IsActive, 
                                                                     [ModifyDate] = @ModifyDate,
                                                                     [CompanyId]=@CompanyId,
                                                                     [BranchId]=@BranchId
                                                                     WHERE [EmployeeId]=@EmployeeId";
                await con.ExecuteAsync(updateQuery, new
                {
                    entity.RoleId,
                    entity.FirstName,
                    entity.LastName,
                    entity.EmailId,
                    entity.Gender,
                    entity.Address,
                    entity.MobileNumber,
                    entity.IsActive,
                    entity.ModifyDate,
                    entity.CompanyId,
                    entity.BranchId,
                    entity.EmployeeId
                });

                updateQuery = @"UPDATE [dbo].[tblAuthentication]
                                SET [UserName] =@UserName,[Password] = @Password
                                WHERE [UserId] = @EmployeeId";
                await con.ExecuteAsync(updateQuery, new
                {
                    entity.UserName,
                    entity.Password,
                    entity.EmployeeId
                });

            }
        }


        #endregion

        #region Expenses
        public async Task AddExpnses(ExpensesEnt expenses)
        {
            using (IDbConnection con = DbConnection)
            {
                DynamicParameters parameters = new DynamicParameters();
                string insertQuery = @"INSERT INTO [dbo].[tblExpenses]
                                        ([CreatedbyEmployeeId]
                                        ,[CompanyId]
                                        ,[EmployeeId]
                                        ,[Note]
                                        ,[CreatedDate]
                                        ,[TransactionType]
                                        ,[Amount]
                                        ,[BranchId])
                                     VALUES
                                           (@CreatedbyEmployeeId
                                           ,@CompanyId
                                           ,@EmployeeId
                                           ,@Note
                                           ,@CreatedDate
                                           ,@TransactionType
                                           ,@Amount
                                           ,@BranchId)
                                SELECT CAST(SCOPE_IDENTITY() as bigint)";

                expenses.ExpensesId = await con.ExecuteScalarAsync<long>(insertQuery, expenses);
            }
        }

        public async Task UpdateExpenses(ExpensesEnt expenses)
        {
            using (IDbConnection con = DbConnection)
            {
                DynamicParameters parameters = new DynamicParameters();
                string updateQuery = @"UPDATE [dbo].[tblExpenses]
                                     SET [CreatedbyEmployeeId] = @CreatedbyEmployeeId
                                        ,[CompanyId] = @CompanyId
                                        ,[EmployeeId] = @EmployeeId
                                        ,[Note] = @Note
                                        ,[TransactionType] = @TransactionType
                                        ,[Amount] = @Amount
                                        ,[BranchId]=@BranchId
                                      WHERE [ExpensesId]=@ExpensesId";

                await con.ExecuteAsync(updateQuery, new
                {
                    expenses.CreatedbyEmployeeId,
                    expenses.CompanyId,
                    expenses.EmployeeId,
                    expenses.Note,
                    expenses.TransactionType,
                    expenses.Amount,
                    expenses.BranchId,
                    expenses.ExpensesId
                });

            }
        }

        public async Task<IEnumerable<ExpensesEntDc>> GetExpenses(long UserId, long CompanyId, long BranchId, int LastDays = 30)
        {
            using (IDbConnection con = DbConnection)
            {
                DynamicParameters parameters = new DynamicParameters();
                parameters.Add("LastDays", LastDays);
                parameters.Add("UserId", UserId);
                parameters.Add("CompanyId", CompanyId);
                parameters.Add("BranchId", BranchId);
                IEnumerable<ExpensesEntDc> expensesEnts = (await SqlMapper.QueryAsync<ExpensesEntDc>(con, "spGetExpenses", parameters, commandType: CommandType.StoredProcedure));
                return expensesEnts;
            }

        }

        public async Task<ExpensesEntDc> GetExpensesById(long ExpensesId)
        {
            using (IDbConnection con = DbConnection)
            {
                DynamicParameters parameters = new DynamicParameters();
                parameters.Add("ExpensesId", ExpensesId);
                ExpensesEntDc expensesEnt = (await SqlMapper.QueryAsync<ExpensesEntDc>(con, "spGetExpensesById", parameters, commandType: CommandType.StoredProcedure)).FirstOrDefault();
                return expensesEnt;
            }
        }

        public async Task<IEnumerable<ExpensesEntDc>> GetExpensesGroupByEmployee(long CompanyId, long BranchId)
        {
            using (IDbConnection con = DbConnection)
            {
                DynamicParameters parameters = new DynamicParameters();
                parameters.Add("CompanyId", CompanyId);
                parameters.Add("BranchId", BranchId);
                IEnumerable<ExpensesEntDc> expensesEnts = (await SqlMapper.QueryAsync<ExpensesEntDc>(con, "spGetExpensesGroupByEmployee", parameters, commandType: CommandType.StoredProcedure));
                return expensesEnts;
            }
        }

        #endregion
    }
}
