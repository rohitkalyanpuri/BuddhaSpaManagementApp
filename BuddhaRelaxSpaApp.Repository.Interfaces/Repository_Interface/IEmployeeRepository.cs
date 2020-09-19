using BuddhaRelaxSpaApp.Entities.Employee;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace BuddhaRelaxSpaApp.Repository.Interfaces.Repository_Interface
{
    public interface IEmployeeRepository
    {
        Task<IEnumerable<EmployeeEnt>> GetAllEmp(long CompanyId, long UserId);

        Task<IEnumerable<EmployeeEnt>> GetEmpBranchId(long BranchId);

        Task<EmployeeEnt> GetEmpById(long id);

        IEnumerable<EmployeeEnt> GetEmployeesByFilter(string ClientName, string Phone, string Email = "", bool IsAdding = false);
        
        Task AddEmp(EmployeeEnt entity);
        Task DeleteEmp(long id);
        Task UpdateEmp(EmployeeEnt entity);

        Task AddExpnses(ExpensesEnt expenses);

        Task UpdateExpenses(ExpensesEnt expenses);

        Task<IEnumerable<ExpensesEntDc>> GetExpenses(long UserId, long CompanyId,long BranchId, int LastDays = 30);

        Task<IEnumerable<ExpensesEntDc>> GetExpensesGroupByEmployee(long CompanyId,long BranchId);

        Task<ExpensesEntDc> GetExpensesById(long ExpensesId);
    }
}
