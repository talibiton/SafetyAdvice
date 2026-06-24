import React, { useState } from 'react';
import { Button, Container, Typography, TextField, Paper, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { post } from '../libs/rest-service';

const AddCounselor = () => {
    const navigate = useNavigate();
    const [id, setId] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [documentary, setDocumentary] = useState('');
    const [signature, setSignature] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        // ולידציות
        if (!id.trim()) {
            alert('נא למלא מספר תעודת זהות');
            return;
        }

        if (id.trim().length !== 9) {
            alert('מספר תעודת זהות חייב להיות 9 ספרות');
            return;
        }

        if (!firstName.trim()) {
            alert('נא למלא שם פרטי');
            return;
        }

        if (!lastName.trim()) {
            alert('נא למלא שם משפחה');
            return;
        }

        if (!email.trim()) {
            alert('נא למלא כתובת אימייל');
            return;
        }

        // ולידציה לאימייל
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('נא להזין כתובת אימייל תקינה');
            return;
        }

        if (!password.trim()) {
            alert('נא למלא סיסמה');
            return;
        }

        if (password.trim().length < 6) {
            alert('הסיסמה חייבת להכיל לפחות 6 תווים');
            return;
        }

        if (!documentary.trim()) {
            alert('נא למלא תיעוד');
            return;
        }

        if (!signature.trim()) {
            alert('נא למלא חתימה');
            return;
        }

        const newCounselor = {
            id: id.trim(),
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            phone: phone.trim() || null,
            email: email.trim(),
            password: password.trim(),
            documentary: documentary.trim(),
            signature: signature.trim()
        };

        try {
            setLoading(true);
            await post('/Counselor/AddCounselor', newCounselor);
            alert('היועץ נשמר בהצלחה!');
            navigate('/admin-management');
        } catch (error: any) {
            console.error('Error saving counselor:', error);
            
            // טיפול מיוחד בשגיאת תעודת זהות קיימת (409 Conflict)
            if (error.response?.status === 409) {
                alert('יועץ עם תעודת זהות זו כבר קיים במערכת');
            } else if (error.response?.data?.message) {
                alert(`שגיאה: ${error.response.data.message}`);
            } else if (error.response?.data) {
                // אם data הוא string ולא אובייקט
                const errorMessage = typeof error.response.data === 'string' 
                    ? error.response.data 
                    : JSON.stringify(error.response.data);
                alert(`שגיאה: ${errorMessage}`);
            } else {
                alert('שגיאה בשמירת היועץ. אנא נסה שוב.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/admin-management');
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
            <Paper elevation={3} style={{ padding: '2rem' }}>
                <Box textAlign="center" marginBottom="2rem">
                    <PersonAddIcon
                        style={{ fontSize: 60, color: '#1976d2', marginBottom: '1rem' }}
                    />
                    <Typography variant="h4" gutterBottom style={{ color: '#1976d2' }}>
                        הוספת יועץ חדש
                    </Typography>
                </Box>

                <TextField
                    fullWidth
                    label="תעודת זהות (9 ספרות)"
                    variant="outlined"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    margin="normal"
                    required
                    disabled={loading}
                    inputProps={{ maxLength: 9 }}
                />

                <TextField
                    fullWidth
                    label="שם פרטי"
                    variant="outlined"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    margin="normal"
                    required
                    disabled={loading}
                />

                <TextField
                    fullWidth
                    label="שם משפחה"
                    variant="outlined"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    margin="normal"
                    required
                    disabled={loading}
                />

                <TextField
                    fullWidth
                    label="טלפון"
                    variant="outlined"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    margin="normal"
                    disabled={loading}
                />

                <TextField
                    fullWidth
                    label="אימייל"
                    variant="outlined"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    margin="normal"
                    required
                    disabled={loading}
                />

                <TextField
                    fullWidth
                    label="סיסמה"
                    variant="outlined"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    margin="normal"
                    required
                    disabled={loading}
                />

                <TextField
                    fullWidth
                    label="תיעוד"
                    variant="outlined"
                    value={documentary}
                    onChange={(e) => setDocumentary(e.target.value)}
                    margin="normal"
                    required
                    disabled={loading}
                    multiline
                    rows={3}
                />

                <TextField
                    fullWidth
                    label="חתימה"
                    variant="outlined"
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
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
                        {loading ? 'שומר...' : 'שמור יועץ'}
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

export default AddCounselor;
