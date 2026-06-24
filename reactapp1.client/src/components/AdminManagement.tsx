import React from 'react';
import { Button, Container, Typography, Box, Paper, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BusinessIcon from '@mui/icons-material/Business';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

const AdminManagement = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        localStorage.removeItem('userId');
        localStorage.removeItem('kindAuth');
        navigate('/');
    };

    const handleReports = () => {
        navigate('/reports');
    };

    const handleAddOrganization = () => {
        navigate('/add-organization');
    };

    const handleAddCounselor = () => {
        navigate('/add-counselor');
    };

    const handleAddSystemUser = () => {
        navigate('/add-system-user');
    };

    return (
        <Container maxWidth="md" style={{ marginTop: '4rem' }}>
            <Paper elevation={3} style={{ padding: '3rem' }}>
                <Box textAlign="center">
                    <AdminPanelSettingsIcon
                        style={{ fontSize: 80, color: '#1976d2', marginBottom: '1rem' }}
                    />

                    <Typography variant="h4" gutterBottom style={{ marginBottom: '2rem', color: '#1976d2' }}>
                        מסך ניהול מנהל
                    </Typography>

                    <Typography variant="body1" style={{ marginBottom: '3rem' }}>
                        ברוך הבא למערכת ניהול מנהל
                    </Typography>

                    <Box style={{ marginBottom: '2rem' }}>
                        <Typography variant="h6" style={{ marginBottom: '2rem' }}>
                            פעולות ניהול זמינות:
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleReports}
                                    fullWidth
                                    startIcon={<AssessmentIcon />}
                                    style={{
                                        padding: '1.5rem',
                                        fontSize: '1rem'
                                    }}
                                >
                                    דוחות
                                </Button>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleAddOrganization}
                                    fullWidth
                                    startIcon={<BusinessIcon />}
                                    style={{
                                        padding: '1.5rem',
                                        fontSize: '1rem'
                                    }}
                                >
                                    הוספת ארגון
                                </Button>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleAddCounselor}
                                    fullWidth
                                    startIcon={<PersonAddIcon />}
                                    style={{
                                        padding: '1.5rem',
                                        fontSize: '1rem'
                                    }}
                                >
                                    הוספת יועץ
                                </Button>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleAddSystemUser}
                                    fullWidth
                                    startIcon={<GroupAddIcon />}
                                    style={{
                                        padding: '1.5rem',
                                        fontSize: '1rem'
                                    }}
                                >
                                    הוספת משתמשי מערכת
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>

                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleLogout}
                        fullWidth
                        startIcon={<ExitToAppIcon />}
                        style={{
                            padding: '1rem',
                            fontSize: '1rem',
                            marginTop: '2rem'
                        }}
                    >
                        התנתק
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default AdminManagement;
