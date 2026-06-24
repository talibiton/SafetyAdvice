import React, { useState } from 'react';
import { Button, Container, Typography, TextField, Paper, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { post } from '../libs/rest-service';

const AddSystemUser = () => {
    const navigate = useNavigate();
    const [id, setId] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [kindAuth, setKindAuth] = useState('');
    const [mail, setMail] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        // ולידציות
        if (!id.trim()) {
            alert('נא למלא מזהה משתמש');
            return;
        }

        const userId = parseInt(id.trim());
        if (isNaN(userId) || userId <= 0) {
            alert('מזהה משתמש חייב להיות מספר חיובי');
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

        // ולידציה לאימייל אם הוזן
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (mail.trim() && !emailRegex.test(mail)) {
            alert('נא להזין כתובת דואר אלקטרוני תקינה');
            return;
        }

        const newUser = {
            id: userId,
            firstName: firstName.trim() || null,
            lastName: lastName.trim() || null,
            password: password.trim(),
            kind_auth: kindAuth ? parseInt(kindAuth) : null,
            mail: mail.trim() || null,
            phone: phone.trim() || null
        };

        try {
            setLoading(true);
            await post('/User/AddUser', newUser);
            alert('המשתמש נשמר בהצלחה!');
            navigate('/admin-management');
        } catch (error: any) {
            console.error('Error saving user:', error);
            
            // טיפול מיוחד בשגיאת ID קיים (409 Conflict)
            if (error.response?.status === 409) {
                alert('משתמש עם מזהה זה כבר קיים במערכת');
            } else if (error.response?.data?.message) {
                alert(`שגיאה: ${error.response.data.message}`);
            } else if (error.response?.data) {
                const errorMessage = typeof error.response.data === 'string' 
                    ? error.response.data 
                    : JSON.stringify(error.response.data);
                alert(`שגיאה: ${errorMessage}`);
            } else {
                alert('שגיאה בשמירת המשתמש. אנא נסה שוב.');
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
                        הוספת משתמש מערכת
                    </Typography>
                </Box>

                <TextField
                    fullWidth
                    label="מזהה משתמש (מספר)"
                    variant="outlined"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    margin="normal"
                    required
                    disabled={loading}
                    type="number"
                />

                <TextField
                    fullWidth
                    label="שם פרטי"
                    variant="outlined"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    margin="normal"
                    disabled={loading}
                />

                <TextField
                    fullWidth
                    label="שם משפחה"
                    variant="outlined"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    margin="normal"
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
                    label="סוג הרשאה (מספר)"
                    variant="outlined"
                    value={kindAuth}
                    onChange={(e) => setKindAuth(e.target.value)}
                    margin="normal"
                    disabled={loading}
                    type="number"
                />

                <TextField
                    fullWidth
                    label="דואר אלקטרוני"
                    variant="outlined"
                    type="email"
                    value={mail}
                    onChange={(e) => setMail(e.target.value)}
                    margin="normal"
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
                        {loading ? 'שומר...' : 'שמור משתמש'}
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

export default AddSystemUser;
