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
    Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { get } from '../libs/rest-service';

interface AddressChangeData {
    kindergartenCode: string;
    nannyName: string;
    nannyId: string;
    oldAddress: string;
    oldCity: string;
    newAddress: string;
    newCity: string;
    changeDate?: string;
}

const AddressChangeReport = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<AddressChangeData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await get('/api/report/address-changed');
            setData(result || []);
        } catch (err) {
            console.error('Error fetching address change report:', err);
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

    return (
        <Box
            sx={{
                backgroundColor: '#ffffff',
                minHeight: '100vh',
                padding: 3,
                direction: 'rtl',
            }}
        >
            <Container maxWidth="xl">
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
                    משפחתונים שכתובתם השתנתה
                </Typography>

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
                        לא נמצאו משפחתונים ששינו כתובת
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
                                            כתובת ישנה
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            sx={{
                                                color: '#ffffff',
                                                fontWeight: 'bold',
                                                fontSize: '1.1rem',
                                            }}
                                        >
                                            כתובת חדשה
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            sx={{
                                                color: '#ffffff',
                                                fontWeight: 'bold',
                                                fontSize: '1.1rem',
                                            }}
                                        >
                                            תאריך שינוי
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
                                            <TableCell align="center" sx={{ fontSize: '1rem' }}>
                                                {row.nannyId}
                                            </TableCell>
                                            <TableCell align="center" sx={{ fontSize: '0.95rem' }}>
                                                <Box>
                                                    <Typography sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
                                                        {row.oldAddress}
                                                    </Typography>
                                                    <Typography sx={{ fontSize: '0.85rem', color: '#666' }}>
                                                        {row.oldCity}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell align="center" sx={{ fontSize: '0.95rem' }}>
                                                <Box>
                                                    <Typography sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                                                        {row.newAddress}
                                                    </Typography>
                                                    <Typography sx={{ fontSize: '0.85rem', color: '#666' }}>
                                                        {row.newCity}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell align="center" sx={{ fontSize: '1rem' }}>
                                                {formatDate(row.changeDate)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Box mt={3} display="flex" justifyContent="center">
                            <Typography variant="body2" color="textSecondary">
                                סך הכל: {data.length} משפחתונים שינו כתובת
                            </Typography>
                        </Box>
                    </>
                )}
            </Container>
        </Box>
    );
};

export default AddressChangeReport;
