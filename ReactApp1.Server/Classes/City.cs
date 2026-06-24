using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace pro.Server.Classes
{
    public class City
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int cityCode { get; set; }
        
        [Required]
        [StringLength(100)]
        public string name { get; set; }
        
        public bool active { get; set; }

        public City()
        {
                
        }
    }
}
