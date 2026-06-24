using Microsoft.Data.SqlClient;
using System.Data;
using Microsoft.Extensions.Logging;

namespace ReactApp1.Server.Services
{
    public class ReportService
    {
        private readonly string _connectionString;
        private readonly ILogger<ReportService> _logger;

        public ReportService(IConfiguration configuration, ILogger<ReportService> logger)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection") 
                ?? throw new ArgumentNullException("Connection string not found");
            _logger = logger;
        }

        public async Task<List<CounselorDto>> GetAllCounselorsAsync()
        {
            var results = new List<CounselorDto>();

            try
            {
                _logger.LogInformation("Connecting to database with connection string: {ConnectionString}", _connectionString.Substring(0, Math.Min(50, _connectionString.Length)) + "...");

                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    _logger.LogInformation("Database connection opened successfully");

                    var query = @"
                        SELECT DISTINCT 
                            id,
                            firstName,
                            lastName
                        FROM Counselors
                        WHERE id IS NOT NULL 
                            AND firstName IS NOT NULL
                            AND lastName IS NOT NULL
                        ORDER BY firstName, lastName";

                    _logger.LogInformation("Executing query: {Query}", query);

                    using (var command = new SqlCommand(query, connection))
                    {
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            int count = 0;
                            while (await reader.ReadAsync())
                            {
                                var firstName = reader["firstName"].ToString() ?? string.Empty;
                                var lastName = reader["lastName"].ToString() ?? string.Empty;
                                var fullName = $"{firstName} {lastName}".Trim();
                                var id = reader["id"].ToString() ?? string.Empty;

                                results.Add(new CounselorDto
                                {
                                    CounselorId = id,
                                    CounselorName = fullName
                                });
                                count++;
                            }
                            _logger.LogInformation("Retrieved {Count} counselors from database", count);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetAllCounselorsAsync: {Message}", ex.Message);
                throw;
            }

            return results;
        }

        public async Task<List<KindergartenAuditReportDto>>   GetKindergartensAuditedByCounselorOnDateAsync(string counselorId, DateTime selectedDate)
        {
            var results = new List<KindergartenAuditReportDto>();
            var dateOnly = selectedDate.Date;

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                var query = @"
                    SELECT DISTINCT 
                        ad.kindergartenCode,
                        n.firstName,
                        n.lastName
                    FROM AuditDetails ad
                    INNER JOIN Nannies n ON ad.kindergartenCode = n.kindergartenCode
                    WHERE ad.counselorId = @CounselorId
                        AND CAST(ad.updateDate AS DATE) = @SelectedDate
                    ORDER BY ad.kindergartenCode";

                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@CounselorId", counselorId);
                    command.Parameters.AddWithValue("@SelectedDate", dateOnly);

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var firstName = reader["firstName"].ToString() ?? string.Empty;
                            var lastName = reader["lastName"].ToString() ?? string.Empty;
                            var fullName = $"{firstName} {lastName}".Trim();

                            results.Add(new KindergartenAuditReportDto
                            {
                                KindergartenCode = reader["kindergartenCode"].ToString() ?? string.Empty,
                                NannyName = fullName
                            });
                        }
                    }
                }
            }

            return results;
        }

        public async Task<List<KindergartenDetailedReportDto>> GetKindergartensByApprovalStatusAsync(int approvalStatus, int? year = null)
        {
            var results = new List<KindergartenDetailedReportDto>();

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                // אם לא צוין שנה, ברירת מחדל היא שנה אחורה
                var dateFilter = year.HasValue 
                    ? $"AND YEAR(ad.auditDate) = @Year"
                    : "AND ad.auditDate >= DATEADD(YEAR, -1, GETDATE())";

                var query = $@"
                    SELECT DISTINCT
                        k.code AS KindergartenCode,
                        n.firstName AS NannyFirstName,
                        n.lastName AS NannyLastName,
                        n.id AS NannyId,
                        c.name AS CityName,
                        k.street,
                        k.homeNum,
                        k.floor,
                        ad.auditDate,
                        ad.approvalStatus
                    FROM AuditDetails ad
                    INNER JOIN Kindergartens k ON ad.kindergartenCode = k.code
                    INNER JOIN Nannies n ON k.code = n.kindergartenCode
                    LEFT JOIN Cities c ON k.cityCode = c.cityCode
                    WHERE ad.approvalStatus = @ApprovalStatus
                    {dateFilter}
                    AND k.seqNr = (
                        SELECT MAX(seqNr) 
                        FROM Kindergartens 
                        WHERE code = k.code
                    )
                    ORDER BY ad.auditDate DESC, k.code";

                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@ApprovalStatus", approvalStatus);
                    if (year.HasValue)
                    {
                        command.Parameters.AddWithValue("@Year", year.Value);
                    }

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var firstName = reader["NannyFirstName"].ToString() ?? string.Empty;
                            var lastName = reader["NannyLastName"].ToString() ?? string.Empty;
                            var street = reader["street"].ToString() ?? string.Empty;
                            var homeNum = reader["homeNum"].ToString() ?? string.Empty;
                            var floor = reader["floor"].ToString() ?? string.Empty;

                            results.Add(new KindergartenDetailedReportDto
                            {
                                KindergartenCode = reader["KindergartenCode"].ToString() ?? string.Empty,
                                NannyName = $"{firstName} {lastName}".Trim(),
                                NannyId = reader["NannyId"].ToString() ?? string.Empty,
                                City = reader["CityName"].ToString() ?? string.Empty,
                                Address = $"{street} {homeNum}, קומה {floor}".Trim(),
                                AuditDate = reader["auditDate"] != DBNull.Value ? (DateTime)reader["auditDate"] : null,
                                ApprovalStatus = reader["approvalStatus"] != DBNull.Value ? (int)reader["approvalStatus"] : null
                            });
                        }
                    }
                }
            }

            var yearText = year.HasValue ? $"year {year.Value}" : "last year";
            _logger.LogInformation("Found {Count} kindergartens with approval status {Status} from {Year}", results.Count, approvalStatus, yearText);
            return results;
        }

        // Wrapper methods for backwards compatibility and clarity
        public async Task<List<KindergartenDetailedReportDto>> GetKindergartensClosedImmediatelyAsync(int? year = null)
        {
            return await GetKindergartensByApprovalStatusAsync(2, year);
        }

        public async Task<List<KindergartenDetailedReportDto>> GetKindergartensNeedRepairsAsync(int? year = null)
        {
            return await GetKindergartensByApprovalStatusAsync(0, year);
        }

        public async Task<List<KindergartenDetailedReportDto>> GetKindergartensApprovedImmediatelyAsync(int? year = null)
        {
            return await GetKindergartensByApprovalStatusAsync(1, year);
        }

        public async Task<List<KindergartenDetailedReportDto>> GetKindergartensNotAuditedYetAsync()
        {
            var results = new List<KindergartenDetailedReportDto>();

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                var query = @"
                    SELECT DISTINCT
                        k.code AS KindergartenCode,
                        n.firstName AS NannyFirstName,
                        n.lastName AS NannyLastName,
                        n.id AS NannyId,
                        c.name AS CityName,
                        k.street,
                        k.homeNum,
                        k.floor
                    FROM Kindergartens k
                    INNER JOIN Nannies n ON k.code = n.kindergartenCode
                    LEFT JOIN Cities c ON k.cityCode = c.cityCode
                    LEFT JOIN AuditDetails ad ON k.code = ad.kindergartenCode
                    WHERE ad.id IS NULL
                    AND k.seqNr = (
                        SELECT MAX(seqNr) 
                        FROM Kindergartens 
                        WHERE code = k.code
                    )
                    ORDER BY k.code";

                using (var command = new SqlCommand(query, connection))
                {
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var firstName = reader["NannyFirstName"].ToString() ?? string.Empty;
                            var lastName = reader["NannyLastName"].ToString() ?? string.Empty;
                            var street = reader["street"].ToString() ?? string.Empty;
                            var homeNum = reader["homeNum"].ToString() ?? string.Empty;
                            var floor = reader["floor"].ToString() ?? string.Empty;

                            results.Add(new KindergartenDetailedReportDto
                            {
                                KindergartenCode = reader["KindergartenCode"].ToString() ?? string.Empty,
                                NannyName = $"{firstName} {lastName}".Trim(),
                                NannyId = reader["NannyId"].ToString() ?? string.Empty,
                                City = reader["CityName"].ToString() ?? string.Empty,
                                Address = $"{street} {homeNum}, קומה {floor}".Trim(),
                                AuditDate = null,
                                ApprovalStatus = null
                            });
                        }
                    }
                }
            }

            return results;
        }

        public async Task<List<KindergartenAddressChangeDto>> GetKindergartensWithAddressChangesAsync()
        {
            var results = new List<KindergartenAddressChangeDto>();

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                var query = @"
                    WITH AddressHistory AS (
                        SELECT 
                            k.code,
                            k.seqNr,
                            k.street,
                            k.homeNum,
                            k.floor,
                            k.cityCode,
                            c.name AS CityName,
                            k.updateDate,
                            n.firstName AS NannyFirstName,
                            n.lastName AS NannyLastName,
                            n.id AS NannyId,
                            ROW_NUMBER() OVER (PARTITION BY k.code ORDER BY k.seqNr DESC) AS RowNum
                        FROM Kindergartens k
                        LEFT JOIN Cities c ON k.cityCode = c.cityCode
                        LEFT JOIN Nannies n ON k.code = n.kindergartenCode
                        WHERE k.code IN (
                            SELECT code
                            FROM Kindergartens
                            GROUP BY code
                            HAVING COUNT(*) > 1
                        )
                    )
                    SELECT 
                        curr.code AS KindergartenCode,
                        curr.NannyFirstName,
                        curr.NannyLastName,
                        curr.NannyId,
                        prev.street AS OldStreet,
                        prev.homeNum AS OldHomeNum,
                        prev.floor AS OldFloor,
                        prev.CityName AS OldCity,
                        curr.street AS NewStreet,
                        curr.homeNum AS NewHomeNum,
                        curr.floor AS NewFloor,
                        curr.CityName AS NewCity,
                        curr.updateDate AS ChangeDate
                    FROM AddressHistory curr
                    INNER JOIN AddressHistory prev ON curr.code = prev.code 
                        AND prev.RowNum = 2
                    WHERE curr.RowNum = 1
                    ORDER BY curr.updateDate DESC, curr.code";

                using (var command = new SqlCommand(query, connection))
                {
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var firstName = reader["NannyFirstName"].ToString() ?? string.Empty;
                            var lastName = reader["NannyLastName"].ToString() ?? string.Empty;

                            results.Add(new KindergartenAddressChangeDto
                            {
                                KindergartenCode = reader["KindergartenCode"].ToString() ?? string.Empty,
                                NannyName = $"{firstName} {lastName}".Trim(),
                                NannyId = reader["NannyId"].ToString() ?? string.Empty,
                                OldAddress = $"{reader["OldStreet"]} {reader["OldHomeNum"]}, קומה {reader["OldFloor"]}".Trim(),
                                OldCity = reader["OldCity"].ToString() ?? string.Empty,
                                NewAddress = $"{reader["NewStreet"]} {reader["NewHomeNum"]}, קומה {reader["NewFloor"]}".Trim(),
                                NewCity = reader["NewCity"].ToString() ?? string.Empty,
                                ChangeDate = reader["ChangeDate"] != DBNull.Value ? (DateTime)reader["ChangeDate"] : null
                            });
                        }
                    }
                }
            }

            return results;
        }
    }

    public class CounselorDto
    {
        public string CounselorId { get; set; } = string.Empty;
        public string CounselorName { get; set; } = string.Empty;
    }

    public class KindergartenAuditReportDto
    {
        public string KindergartenCode { get; set; } = string.Empty;
        public string NannyName { get; set; } = string.Empty;
    }

    public class KindergartenDetailedReportDto
    {
        public string KindergartenCode { get; set; } = string.Empty;
        public string NannyName { get; set; } = string.Empty;
        public string NannyId { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public DateTime? AuditDate { get; set; }
        public int? ApprovalStatus { get; set; }
    }

    public class KindergartenAddressChangeDto
    {
        public string KindergartenCode { get; set; } = string.Empty;
        public string NannyName { get; set; } = string.Empty;
        public string NannyId { get; set; } = string.Empty;
        public string OldAddress { get; set; } = string.Empty;
        public string OldCity { get; set; } = string.Empty;
        public string NewAddress { get; set; } = string.Empty;
        public string NewCity { get; set; } = string.Empty;
        public DateTime? ChangeDate { get; set; }
    }
}
