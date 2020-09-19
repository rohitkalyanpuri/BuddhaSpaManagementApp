using System;
using System.Collections.Generic;
using System.Text;

namespace BuddhaRelaxSpaApp.Entities.Employee
{
    public class ExpensesEnt
    {
        public long ExpensesId { get; set; }
        public long CreatedbyEmployeeId { get; set; }
        public long CompanyId { get; set; }
        public long? EmployeeId { get; set; }
        public string Note { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string TransactionType { get; set; }
        public decimal? Amount { get; set; }

        public long? BranchId { get; set; }
    }

    public class ExpensesEntDc
    {
        public long ExpensesId { get; set; }
        public long CreatedbyEmployeeId { get; set; }

        public string CreatedbyEmployeeName { get; set; }
        public long CompanyId { get; set; }
        public long? EmployeeId { get; set; }

        public string EmployeeName { get; set; }
        public string Note { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string TransactionType { get; set; }
        public decimal? Amount { get; set; } = 0;
        public long? BranchId { get; set; }

        public decimal TotalCredit { get; set; }
        public decimal TotalDebit { get; set; }
    }
}
