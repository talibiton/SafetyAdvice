import React, { useState } from 'react';
import { Button, Container, Typography, TextField, Paper, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BusinessIcon from '@mui/icons-material/Business';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { post } from '../libs/rest-service';

const AddOrganization = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        // Validation
        if (!name.trim()) {
            alert('נא למלא את שם הארגון');
            return;
        }

        if (!email.trim()) {
            alert('נא למלא את כתובת האימייל');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('נא להזין כתובת אימייל תקינה');
            return;
        }

        const newOrganization = {
            name: name.trim(),
            email: email.trim()
        };

        try {
            setLoading(true);
            await post('/Organization/AddOrganization', newOrganization);
            alert('הארגון נשמר בהצלחה!');
            navigate('/admin-management');
        } catch (error: any) {
            console.error('Error saving organization:', error);
            
            // טיפול מיוחד בשגיאת שם ארגון קיים (409 Conflict)
            if (error.response?.status === 409) {
                alert('ארגון עם שם זה כבר קיים במערכת');
            } else if (error.response?.data?.message) {
                alert(`שגיאה: ${error.response.data.message}`);
            } else if (error.response?.data) {
                // אם data הוא string ולא אובייקט
                const errorMessage = typeof error.response.data === 'string' 
                    ? error.response.data 
                    : JSON.stringify(error.response.data);
                alert(`שגיאה: ${errorMessage}`);
            } else {
                alert('שגיאה בשמירת הארגון. אנא נסה שוב.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/admin-management');
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: '3rem' }}>
            <Paper elevation={3} style={{ padding: '2rem' }}>
                <Box textAlign="center" marginBottom="2rem">
                    <BusinessIcon
                        style={{ fontSize: 60, color: '#1976d2', marginBottom: '1rem' }}
                    />
                    <Typography variant="h4" gutterBottom style={{ color: '#1976d2' }}>
                        הוספת ארגון חדש
                    </Typography>
                </Box>

                <TextField
                    fullWidth
                    label="שם הארגון"
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    margin="normal"
                    required
                    disabled={loading}
                />

                <TextField
                    fullWidth
                    label="כתובת אימייל"
                    variant="outlined"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    margin="normal"
                    required
                    disabled={loading}
                />

                <Box marginTop="2rem">
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleSave}
                        startIcon={<SaveIcon />}
                        style={{ marginBottom: '1rem', padding: '1rem' }}
                        disabled={loading}
                    >
                        {loading ? 'שומר...' : 'שמור ארגון'}
                    </Button>

                    <Button
                        variant="outlined"
                        color="secondary"
                        fullWidth
                        onClick={handleBack}
                        startIcon={<ArrowBackIcon />}
                        style={{ padding: '1rem' }}
                        disabled={loading}
                    >
                        חזור למסך ניהול
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default AddOrganization;
