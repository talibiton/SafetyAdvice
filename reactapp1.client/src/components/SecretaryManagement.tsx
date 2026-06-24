import React from 'react';
import { Button, Container, Typography, Box, Paper, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import UpdateIcon from '@mui/icons-material/Update';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

const SecretaryManagement = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        localStorage.removeItem('userId');
        navigate('/');
    };

    const handleAddCities = () => {
        navigate('/add-city');
    };

    const handleLoadDB = () => {
        // TODO: Implement load DB functionality
        console.log('טעינת DB');
    };

    const handleUpdateCities = () => {
        navigate('/cities-table');
    };

    const handleUpdateHubs = () => {
        navigate('/hubs-table');
    };

    return (
        <Container maxWidth="md" style={{ marginTop: '4rem' }}>
            <Paper elevation={3} style={{ padding: '3rem' }}>
                <Box textAlign="center">
                    <BusinessCenterIcon 
                        style={{ fontSize: 80, color: '#1976d2', marginBottom: '1rem' }} 
                    />
                    
                    <Typography variant="h4" gutterBottom style={{ marginBottom: '2rem', color: '#1976d2' }}>
                        מסך ניהול מזכירות
                    </Typography>
                    
                    <Typography variant="body1" style={{ marginBottom: '3rem' }}>
                        ברוך הבא למערכת ניהול מזכירות
                    </Typography>

                    <Box style={{ marginBottom: '2rem' }}>
                        <Typography variant="h6" style={{ marginBottom: '2rem' }}>
                            פעולות מזכירות זמינות:
                        </Typography>
                        
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleAddCities}
                                    fullWidth
                                    startIcon={<LocationCityIcon />}
                                    style={{ 
                                        padding: '1rem',
                                        fontSize: '1rem'
                                    }}
                                >
                                    הוספת ערים
                                </Button>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleLoadDB}
                                    fullWidth
                                    startIcon={<CloudUploadIcon />}
                                    style={{ 
                                        padding: '1rem',
                                        fontSize: '1rem'
                                    }}
                                >
                                    טעינת DB
                                </Button>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleUpdateCities}
                                    fullWidth
                                    startIcon={<UpdateIcon />}
                                    style={{ 
                                        padding: '1rem',
                                        fontSize: '1rem'
                                    }}
                                >
                                    עדכון ערים
                                </Button>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleUpdateHubs}
                                    fullWidth
                                    startIcon={<AccountTreeIcon />}
                                    style={{ 
                                        padding: '1rem',
                                        fontSize: '1rem'
                                    }}
                                >
                                    עדכון רכזות
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
                            marginTop: '1rem'
                        }}
                    >
                        התנתק
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default SecretaryManagement;
