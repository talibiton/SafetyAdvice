import React, { useState } from 'react';
import { 
    Button, 
    Container, 
    Typography, 
    Box, 
    Paper, 
    TextField,
    FormControlLabel,
    Checkbox,
    Alert,
    Snackbar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import { post } from '../libs/rest-service';

interface City {
    cityCode?: number;
    name: string;
    active: boolean;
}

const AddCity = () => {
    const navigate = useNavigate();
    const [cityName, setCityName] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!cityName.trim()) {
            setError('שם העיר הוא שדה חובה');
            return;
        }

        setLoading(true);
        setError('');

        const newCity: City = {
            name: cityName.trim(),
            active: isActive
        };

        console.log('Sending city data:', newCity);

        try {
            const result = await post('/Cities/AddCity', newCity);
            console.log('City added successfully:', result);
            
            setSuccess(true);
            
            // ניקוי הטופס
            setCityName('');
            setIsActive(true);
            
            // חזרה למסך הקודם אחרי 2 שניות
            setTimeout(() => {
                navigate('/secretary-management');
            }, 2000);
            
        } catch (err: unknown) {
            console.error('Error adding city:', err);
            
            // טיפול בשגיאות מהשרת
            let errorMessage = 'שגיאה לא ידועה בהוספת העיר';
            
            if (err && typeof err === 'object' && 'response' in err) {
                const axiosError = err as { response?: { data?: { message?: string }, status?: number } };
                
                if (axiosError.response?.status === 409) {
                    // שגיאת Conflict - עיר כבר קיימת
                    errorMessage = axiosError.response.data?.message || 'עיר עם שם זה כבר קיימת במערכת';
                } else if (axiosError.response?.data?.message) {
                    errorMessage = axiosError.response.data.message;
                } else if (typeof axiosError.response?.data === 'string') {
                    errorMessage = axiosError.response.data;
                }
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/secretary-management');
    };

    const handleCloseSuccess = () => {
        setSuccess(false);
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: '4rem' }}>
            <Paper elevation={3} style={{ padding: '3rem' }}>
                <Box textAlign="center">
                    <LocationCityIcon 
                        style={{ fontSize: 80, color: '#1976d2', marginBottom: '1rem' }} 
                    />
                    
                    <Typography variant="h4" gutterBottom style={{ marginBottom: '2rem', color: '#1976d2' }}>
                        הוספת עיר חדשה
                    </Typography>
                    
                    <form onSubmit={handleSubmit}>
                        <Box style={{ marginBottom: '2rem' }}>
                            <TextField
                                fullWidth
                                label="שם העיר"
                                variant="outlined"
                                value={cityName}
                                onChange={(e) => setCityName(e.target.value)}
                                required
                                error={!!error && !cityName.trim()}
                                helperText={error && !cityName.trim() ? error : ''}
                                style={{ marginBottom: '1rem' }}
                                InputProps={{
                                    style: { textAlign: 'right' }
                                }}
                                InputLabelProps={{
                                    style: { right: 0, left: 'auto', transformOrigin: 'right' }
                                }}
                            />

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={isActive}
                                        onChange={(e) => setIsActive(e.target.checked)}
                                        color="primary"
                                    />
                                }
                                label="פעיל"
                                style={{ marginBottom: '1rem' }}
                            />
                        </Box>

                        {error && (
                            <Alert severity="error" style={{ marginBottom: '1rem' }}>
                                {error}
                            </Alert>
                        )}

                        <Box style={{ display: 'flex', gap: '1rem' }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                startIcon={<SaveIcon />}
                                disabled={loading}
                                style={{ padding: '1rem' }}
                            >
                                {loading ? 'שומר...' : 'שמור'}
                            </Button>

                            <Button
                                variant="outlined"
                                color="secondary"
                                fullWidth
                                onClick={handleBack}
                                startIcon={<ArrowBackIcon />}
                                disabled={loading}
                                style={{ padding: '1rem' }}
                            >
                                חזור
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Paper>

            <Snackbar
                open={success}
                autoHideDuration={2000}
                onClose={handleCloseSuccess}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
                    העיר נוספה בהצלחה!
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default AddCity;
