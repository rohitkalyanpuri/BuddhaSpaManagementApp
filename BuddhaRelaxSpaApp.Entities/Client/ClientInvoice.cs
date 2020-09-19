using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace BuddhaRelaxSpaApp.Entities.Client
{
    public class ClientInvoice
    {
        public long ReceiptNo { get; set; }

        [JsonConverter(typeof(CustomDateTimeConverter))]
        public DateTime? ReceiptDate { get; set; }
        
        public string ClientName { get; set; }
        public long? MemberShipNo { get; set; }
        public string Mobile { get; set; }
        public string PaymentMode { get; set; }
        public string AmountInWord { get; set; }
        public decimal? Amount { get; set; }
        public string ManagerSignature { get; set; }

        public int MassageCount { get; set; } = 0;
        public string InvoiceFileName { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}
