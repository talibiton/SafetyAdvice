import React from 'react';
import { Button, Container, Typography, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const UserReports = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        localStorage.removeItem('userId');
        navigate('/');
    };

    return (
        <Container maxWidth="md" style={{ marginTop: '4rem' }}>
            <Paper elevation={3} style={{ padding: '3rem' }}>
                <Box textAlign="center">
                    <Typography variant="h4" gutterBottom style={{ marginBottom: '2rem', color: '#1976d2' }}>
                        מסך ניהול משתמש
                    </Typography>
                    
                    <Typography variant="body1" style={{ marginBottom: '3rem' }}>
                        ברוך הבא למערכת
                    </Typography>

                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleLogout}
                        fullWidth
                        startIcon={<ExitToAppIcon />}
                        style={{ 
                            padding: '1rem',
                            fontSize: '1rem'
                        }}
                    >
                        התנתק
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default UserReports;
