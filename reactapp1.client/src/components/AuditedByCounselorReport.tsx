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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
    TextField
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface Counselor {
    counselorId: string;
    counselorName: string;
}

interface AuditedKindergarten {
    kindergartenCode: string;
    nannyName: string;
}

const AuditedByCounselorReport = () => {
    const navigate = useNavigate();
    const [counselors, setCounselors] = useState<Counselor[]>([]);
    const [selectedCounselorId, setSelectedCounselorId] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [data, setData] = useState<AuditedKindergarten[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingCounselors, setLoadingCounselors] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        fetchCounselors();
    }, []);

    const fetchCounselors = async () => {
        try {
            setLoadingCounselors(true);
            setError(null);
            console.log('Fetching counselors from /api/report/counselors');
            const response = await fetch('/api/report/counselors');
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(`שגיאה בטעינת רשימת היועצים: ${response.status} - ${errorText}`);
            }

            const result = await response.json();
            console.log('Counselors received:', result);
            
            if (!Array.isArray(result)) {
                throw new Error('התגובה מהשרת אינה במבנה הצפוי');
            }
            
            setCounselors(result);
        } catch (err) {
            console.error('Error fetching counselors:', err);
            const errorMessage = err instanceof Error ? err.message : 'שגיאה לא ידועה בטעינת רשימת היועצים';
            setError(errorMessage);
        } finally {
            setLoadingCounselors(false);
        }
    };

    const handleCounselorChange = (event: SelectChangeEvent<string>) => {
        setSelectedCounselorId(event.target.value);
        setHasSearched(false);
        setData([]);
        setError(null);
    };

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(event.target.value);
        setHasSearched(false);
        setData([]);
        setError(null);
    };

    const handleSearch = async () => {
        if (!selectedCounselorId) {
            setError('אנא בחר יועץ');
            return;
        }

        if (!selectedDate) {
            setError('אנא בחר תאריך');
            return;
        }

        try {
            setLoading(true);
            setHasSearched(true);
            const response = await fetch(`/api/report/audited-by-counselor?counselorId=${encodeURIComponent(selectedCounselorId)}&date=${encodeURIComponent(selectedDate)}`);
            
            if (!response.ok) {
                throw new Error('שגיאה בטעינת הנתונים');
            }

            const result = await response.json();
            setData(result);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'שגיאה לא ידועה');
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    const selectedCounselor = counselors.find(c => c.counselorId === selectedCounselorId);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('he-IL');
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
            <Container maxWidth="md">
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
                        mb: 4,
                    }}
                >
                    באיזה משפחתונים נמצא היועץ ביום מסויים
                </Typography>

                {loadingCounselors ? (
                    <Box display="flex" justifyContent="center" mt={4}>
                        <CircularProgress sx={{ color: '#800020' }} />
                        <Typography sx={{ ml: 2, color: '#800020' }}>טוען רשימת יועצים...</Typography>
                    </Box>
                ) : error ? (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                        <Box mt={2}>
                            <Button
                                variant="outlined"
                                onClick={fetchCounselors}
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
                ) : (
                    <>
                        <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="counselor-select-label">בחר יועץ</InputLabel>
                                    <Select
                                        labelId="counselor-select-label"
                                        id="counselor-select"
                                        value={selectedCounselorId}
                                        label="בחר יועץ"
                                        onChange={handleCounselorChange}
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
                                        {counselors.map((counselor) => (
                                            <MenuItem key={counselor.counselorId} value={counselor.counselorId}>
                                                {counselor.counselorName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <TextField
                                    label="בחר תאריך"
                                    type="date"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#a8324a',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#800020',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#800020',
                                            },
                                        },
                                    }}
                                />
                            </Box>

                            <Button
                                variant="contained"
                                onClick={handleSearch}
                                disabled={!selectedCounselorId || !selectedDate || loading}
                                sx={{
                                    backgroundColor: '#800020',
                                    color: '#ffffff',
                                    fontWeight: 'bold',
                                    paddingY: 1.5,
                                    '&:hover': {
                                        backgroundColor: '#a8324a',
                                    },
                                    '&:disabled': {
                                        backgroundColor: '#cccccc',
                                    },
                                }}
                            >
                                {loading ? <CircularProgress size={24} sx={{ color: '#ffffff' }} /> : 'חפש'}
                            </Button>
                        </Box>

                        {error && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {error}
                            </Alert>
                        )}

                        {hasSearched && !loading && !error && data.length === 0 && (
                            <Alert severity="info" sx={{ mt: 2 }}>
                                {selectedCounselor 
                                    ? `לא נמצאו משפחתונים שהיועץ ${selectedCounselor.counselorName} ביקר בהם בתאריך ${formatDate(selectedDate)}`
                                    : 'לא נמצאו משפחתונים'
                                }
                            </Alert>
                        )}

                        {!loading && data.length > 0 && (
                            <>
                                {selectedCounselor && (
                                    <Typography
                                        variant="h6"
                                        align="center"
                                        sx={{
                                            mb: 2,
                                            color: '#800020',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        משפחתונים שהיועץ {selectedCounselor.counselorName} ביקר בהם בתאריך {formatDate(selectedDate)}
                                    </Typography>
                                )}

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
                                                    קוד משפחתון
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
                    </>
                )}
            </Container>
        </Box>
    );
};

export default AuditedByCounselorReport;
