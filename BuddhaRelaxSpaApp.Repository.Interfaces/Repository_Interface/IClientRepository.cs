using BuddhaRelaxSpaApp.Entities.Client;
using BuddhaRelaxSpaApp.Entities.Employee;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace BuddhaRelaxSpaApp.Repository.Interfaces.Repository_Interface
{
    public interface IClientRepository
    {
        Task<IEnumerable<Client>> GetAllClients(int RowNumber);

        IEnumerable<Client> GetClientsByFilter(string ClientName, string Phone,string Email="",bool IsAdding=false);

        Task<Client> GetClientById(long id);
        Task AddClient(Client entity);
        Task DeleteClient(long id);
        Task UpdateClient(Client entity);

        Task UpdateClientQRCode(string QRCode, long ClientId);
        Task AddClientInvoice(ClientInvoice clientInvoice);

        Task UpdateInvoice(ClientInvoice clientInvoice);

        Task<IEnumerable<ClientInvoice>> GetInvoices();
        Task<IEnumerable<ClientInvoice>> GetInvoicesByClientId(long ClientId);

        Task<DashBoardDetail> GetDashBoardDetail(long userid);

        Task AddTherapyLog(TherapyLogs therapyLogs);

        Task UpdateTherapyLog(TherapyLogs therapyLogs);
        Task<IEnumerable<TherapyLogs>> GetTherapyLogs(string FromDate, string ToDate);

        Task<TherapyLogs> GetTherapyLogById(long LogId);

        Task<IEnumerable<TherapyLogs>> GetTherapyLogByClientId(long ClientId);
    }
}
