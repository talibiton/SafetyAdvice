import { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    CircularProgress,
    Alert,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { get } from '../libs/rest-service';

interface KindergartenData {
    kindergartenCode: string;
    nannyName: string;
    nannyId: string;
    city: string;
    address: string;
    auditDate?: string;
    approvalStatus?: number;
}

interface ReportConfig {
    title: string;
    endpoint: string;
    showAuditDate?: boolean;
    showApprovalStatus?: boolean;
}

const KindergartenReport = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [data, setData] = useState<KindergartenData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);

    const reportType = location.state?.reportType || 'closed-immediately';
    
    const reportConfigs: Record<string, ReportConfig> = {
        'closed-immediately': {
            title: 'משפחתונים שנסגרו מיידית',
            endpoint: '/api/report/closed-immediately',
            showAuditDate: true,
            showApprovalStatus: true
        },
        'need-repairs': {
            title: 'משפחתונים שצריכים לתקן ליקויים',
            endpoint: '/api/report/need-repairs',
            showAuditDate: true,
            showApprovalStatus: true
        },
        'approved-immediately': {
            title: 'משפחתונים שקיבלו אישור מיידי',
            endpoint: '/api/report/approved-immediately',
            showAuditDate: true,
            showApprovalStatus: true
        },
        'not-audited': {
            title: 'משפחתונים שלא נבדקו עדיין',
            endpoint: '/api/report/not-audited',
            showAuditDate: false,
            showApprovalStatus: false
        },
        'address-changed': {
            title: 'משפחתונים שכתובתם השתנתה',
            endpoint: '/api/report/address-changed',
            showAuditDate: false,
            showApprovalStatus: false
        }
    };

    const config = reportConfigs[reportType] || reportConfigs['closed-immediately'];

    // יצירת רשימת שנים (10 שנים אחורה מהיום)
    const generateYearOptions = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = 0; i < 10; i++) {
            years.push(currentYear - i);
        }
        return years;
    };

    const yearOptions = generateYearOptions();

    useEffect(() => {
        fetchData();
    }, [reportType, selectedYear]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // הוספת year כ-query parameter אם נבחר
            const url = selectedYear 
                ? `${config.endpoint}?year=${selectedYear}`
                : config.endpoint;
            
            const result = await get(url);
            setData(result || []);
        } catch (err) {
            console.error('Error fetching report data:', err);
            setError('שגיאה בטעינת הנתונים');
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('he-IL');
    };

    const getApprovalStatusLabel = (status?: number) => {
        if (status === undefined || status === null) return '-';
        switch (status) {
            case 1: return 'מאושר';
            case 2: return 'סגירת משפחתון';
            case 0: return 'לא מאושר';
            default: return '-';
        }
    };

    const getApprovalStatusColor = (status?: number) => {
        switch (status) {
            case 1: return 'success';
            case 2: return 'warning';
            case 0: return 'error';
            default: return 'default';
        }
    };

    return (
        <Box
            sx={{
                backgroundColor: '#ffffff',
                minHeight: '100vh',
                padding: 3,
                direction: 'rtl',
            }}
        >
            <Container maxWidth="lg">
                <Box display="flex" alignItems="center" mb={3}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/reports')}
                        sx={{
                            color: '#800020',
                            fontWeight: 'bold',
                        }}
                    >
                        חזרה
                    </Button>
                </Box>

                <Typography
                    variant="h4"
                    align="center"
                    gutterBottom
                    sx={{
                        fontWeight: 'bold',
                        color: '#800020',
                        mb: 2,
                    }}
                >
                    {config.title}
                </Typography>

                {/* Selector לבחירת שנה */}
                {(reportType === 'closed-immediately' || reportType === 'need-repairs' || reportType === 'approved-immediately') && (
                    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center', gap: 2, alignItems: 'center' }}>
                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel id="year-select-label">סינון לפי שנה</InputLabel>
                            <Select
                                labelId="year-select-label"
                                value={selectedYear?.toString() || ''}
                                label="סינון לפי שנה"
                                onChange={(e) => setSelectedYear(e.target.value ? parseInt(e.target.value) : null)}
                                sx={{
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#a8324a',
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#800020',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#800020',
                                    },
                                }}
                            >
                                <MenuItem value="">
                                    <em>שנה אחרונה (ברירת מחדל)</em>
                                </MenuItem>
                                {yearOptions.map((year) => (
                                    <MenuItem key={year} value={year}>
                                        {year}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        
                        {selectedYear && (
                            <Button
                                variant="outlined"
                                onClick={() => setSelectedYear(null)}
                                sx={{
                                    color: '#800020',
                                    borderColor: '#800020',
                                    '&:hover': {
                                        borderColor: '#a8324a',
                                        backgroundColor: 'rgba(128, 0, 32, 0.04)',
                                    },
                                }}
                            >
                                נקה סינון
                            </Button>
                        )}
                    </Box>
                )}

                {(reportType === 'closed-immediately' || reportType === 'need-repairs' || reportType === 'approved-immediately') && (
                    <Alert severity="info" sx={{ mb: 3, maxWidth: 'md', mx: 'auto' }}>
                        <Typography variant="body2">
                            {selectedYear 
                                ? `📅 הדוח מציג משפחתונים מהשנה ${selectedYear}`
                                : '📅 הדוח מציג משפחתונים מהשנה האחרונה בלבד (365 ימים אחורה מהיום)'
                            }
                        </Typography>
                    </Alert>
                )}

                {loading ? (
                    <Box display="flex" justifyContent="center" mt={4}>
                        <CircularProgress sx={{ color: '#800020' }} />
                        <Typography sx={{ ml: 2, color: '#800020' }}>טוען נתונים...</Typography>
                    </Box>
                ) : error ? (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                        <Box mt={2}>
                            <Button
                                variant="outlined"
                                onClick={fetchData}
                                sx={{
                                    color: '#800020',
                                    borderColor: '#800020',
                                    '&:hover': {
                                        borderColor: '#a8324a',
                                        backgroundColor: 'rgba(128, 0, 32, 0.04)',
                                    },
                                }}
                            >
                                נסה שוב
                            </Button>
                        </Box>
                    </Alert>
                ) : data.length === 0 ? (
                    <Alert severity="info" sx={{ mt: 2 }}>
                        לא נמצאו משפחתונים
                    </Alert>
                ) : (
                    <>
                        <TableContainer component={Paper} sx={{ mt: 3 }}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#800020' }}>
                                        <TableCell
                                            align="center"
                                            sx={{
                                                color: '#ffffff',
                                                fontWeight: 'bold',
                                                fontSize: '1.1rem',
                                            }}
                                        >
                                            סמל משפחתון
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            sx={{
                                                color: '#ffffff',
                                                fontWeight: 'bold',
                                                fontSize: '1.1rem',
                                            }}
                                        >
                                            שם מטפלת
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            sx={{
                                                color: '#ffffff',
                                                fontWeight: 'bold',
                                                fontSize: '1.1rem',
                                            }}
                                        >
                                            ת"ז מטפלת
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            sx={{
                                                color: '#ffffff',
                                                fontWeight: 'bold',
                                                fontSize: '1.1rem',
                                            }}
                                        >
                                            עיר
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            sx={{
                                                color: '#ffffff',
                                                fontWeight: 'bold',
                                                fontSize: '1.1rem',
                                            }}
                                        >
                                            כתובת
                                        </TableCell>
                                        {config.showAuditDate && (
                                            <TableCell
                                                align="center"
                                                sx={{
                                                    color: '#ffffff',
                                                    fontWeight: 'bold',
                                                    fontSize: '1.1rem',
                                                }}
                                            >
                                                תאריך מבדק
                                            </TableCell>
                                        )}
                                        {config.showApprovalStatus && (
                                            <TableCell
                                                align="center"
                                                sx={{
                                                    color: '#ffffff',
                                                    fontWeight: 'bold',
                                                    fontSize: '1.1rem',
                                                }}
                                            >
                                                סטטוס
                                            </TableCell>
                                        )}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.map((row, index) => (
                                        <TableRow
                                            key={index}
                                            sx={{
                                                '&:nth-of-type(odd)': {
                                                    backgroundColor: '#fcefee',
                                                },
                                                '&:hover': {
                                                    backgroundColor: '#f5d5d0',
                                                },
                                            }}
                                        >
                                            <TableCell align="center" sx={{ fontSize: '1rem' }}>
                                                {row.kindergartenCode}
                                            </TableCell>
                                            <TableCell align="center" sx={{ fontSize: '1rem' }}>
                                                {row.nannyName}
                                            </TableCell>
                                            <TableCell align="center" sx={{ fontSize: '1rem' }}>
                                                {row.nannyId}
                                            </TableCell>
                                            <TableCell align="center" sx={{ fontSize: '1rem' }}>
                                                {row.city}
                                            </TableCell>
                                            <TableCell align="center" sx={{ fontSize: '1rem' }}>
                                                {row.address}
                                            </TableCell>
                                            {config.showAuditDate && (
                                                <TableCell align="center" sx={{ fontSize: '1rem' }}>
                                                    {formatDate(row.auditDate)}
                                                </TableCell>
                                            )}
                                            {config.showApprovalStatus && (
                                                <TableCell align="center">
                                                    <Chip
                                                        label={getApprovalStatusLabel(row.approvalStatus)}
                                                        color={getApprovalStatusColor(row.approvalStatus) as any}
                                                        size="small"
                                                    />
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Box mt={3} display="flex" justifyContent="center">
                            <Typography variant="body2" color="textSecondary">
                                סך הכל: {data.length} משפחתונים
                            </Typography>
                        </Box>
                    </>
                )}
            </Container>
        </Box>
    );
};

export default KindergartenReport;
