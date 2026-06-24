using System.Drawing;
using System.IO;
using System;
using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations.Schema;
//using System.ComponentModel.DataAnnotations;

namespace pro.Server.Classes
{
    public class Kindergarten
    {
        public int code { get; set; }

        public int id { get; set; }
        //public int code { get; set; }
        //public int cityCode { get; set; }
        public string street { get; set; }
        public int homeNum { get; set; }
        public int floor { get; set; }
        public string hubId { get; set; }
        public string organizationsId { get; set; }
        public int seqNr { get; set; }
        public bool active { get; set; }
        public DateTime updateDate { get; set; }

        public City city { get; set; }
        //public Organization organization { get; set; }
        [JsonIgnore] 
        public Hub hub { get; set; }

        public Nanny nanny { get; set; }

        public Kindergarten()
        {

        }
    }
}
