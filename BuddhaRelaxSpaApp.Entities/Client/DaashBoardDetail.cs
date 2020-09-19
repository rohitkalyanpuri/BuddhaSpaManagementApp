using BuddhaRelaxSpaApp.Entities.Employee;
using System;
using System.Collections.Generic;
using System.Text;

namespace BuddhaRelaxSpaApp.Entities.Client
{
    public class DashBoardDetail
    {
        public int TotalCustomers { get; set; }

        public decimal Last24HoursTrax { get; set; }
        
        public decimal LastMonthSales { get; set; }

        public int BusinessRate { get; set; }
        public IEnumerable<ClientInvoice> ClientInvoices { get; set; }

        public IEnumerable<TherapyLogs> TherapyLogs { get; set; }

        public IEnumerable<EmployeeMinEnt> MassageTherapist { get; set; }
    }
}
