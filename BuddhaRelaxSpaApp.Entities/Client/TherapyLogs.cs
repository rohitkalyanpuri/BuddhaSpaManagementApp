using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace BuddhaRelaxSpaApp.Entities.Client
{
    public class TherapyLogs
    {
        public long LogId { get; set; }
        public long? ClientId { get; set; }
        public string ClientName { get; set; }
        public long? EmployeeId { get; set; } = 0;

        public string EmployeeName { get; set; }

        [JsonConverter(typeof(CustomDateTimeConverter))]
        public DateTime? StartDatetime { get; set; }

        [JsonConverter(typeof(CustomDateTimeConverter))]
        public DateTime? EndDateTime { get; set; }

        public int MassageTime { get; set; } = 30;

        public int CompletedMassageTime { get; set; }

        public bool IsCompleted { get; set; } = false;

        public bool IsStarted { get; set; } = false;
        public string RoomNo { get; set; } = "0";

        public bool IsDeleted { get; set; } = false;

        public string DeleteReason { get; set; }
    }
}
