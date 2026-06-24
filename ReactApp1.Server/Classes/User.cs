using System.ComponentModel.DataAnnotations.Schema;

namespace ReactApp1.Server.Classes
{
    [Table("Users")]
    public class User
    {
        [Column("Id")]
        public int id { get; set; }  
        
        [Column("password")]
        public string password { get; set; }

        [Column("kind_auth")]
        public int? kind_auth { get; set; }

        [Column("mail")]
        public string? mail { get; set; }

        [Column("firstName")]
        public string? firstName { get; set; }

        [Column("lastName")]
        public string? lastName { get; set; }

        [Column("phone")]
        public string? phone { get; set; }

        public User()
        {
        }
    }
}
