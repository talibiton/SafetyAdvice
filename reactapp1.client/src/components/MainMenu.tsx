import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Container, 
    Paper, 
    Typography, 
    Button, 
    Grid, 
    Box,
    Divider 
} from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ListAltIcon from '@mui/icons-material/ListAlt';
import QuizIcon from '@mui/icons-material/Quiz';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

const MainMenu: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
                    מערכת ניהול מבדקי בטיחות
                </Typography>

                {/* קטגוריית מבדקים */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                        מבדקי בטיחות
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                size="large"
                                startIcon={<AssessmentIcon />}
                                onClick={() => navigate('/auditForm')}
                                sx={{ py: 2 }}
                            >
                                מבדק בטיחות
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                size="large"
                                startIcon={<ListAltIcon />}
                                onClick={() => navigate('/auditTable')}
                                sx={{ py: 2 }}
                            >
                                מבדקי בטיחות
                            </Button>
                        </Grid>
                    </Grid>
                </Box>

                <Divider sx={{ my: 4 }} />

                {/* קטגוריית ניהול שאלות */}
                <Box>
                    <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                        ניהול שאלות במבדק
                    </Typography>
                    
                    {/* שאלות רגילות */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ mb: 2, color: 'text.secondary' }}>
                            שאלות רגילות
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    color="success"
                                    size="large"
                                    startIcon={<AddCircleIcon />}
                                    onClick={() => navigate('/addQuestion')}
                                    sx={{ py: 1.5 }}
                                >
                                    הוספת שאלה
                                </Button>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    color="error"
                                    size="large"
                                    startIcon={<RemoveCircleIcon />}
                                    onClick={() => navigate('/questionsTable')}
                                    sx={{ py: 1.5 }}
                                >
                                    הסרת שאלה
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* שאלות פר חלל */}
                    <Box>
                        <Typography variant="h6" gutterBottom sx={{ mb: 2, color: 'text.secondary' }}>
                            שאלות פר חלל
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    color="success"
                                    size="large"
                                    startIcon={<AddCircleIcon />}
                                    onClick={() => navigate('/addQuestionForSpace')}
                                    sx={{ py: 1.5 }}
                                >
                                    הוספת שאלה פר חלל
                                </Button>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    color="error"
                                    size="large"
                                    startIcon={<RemoveCircleIcon />}
                                    onClick={() => navigate('/questionsTableForSpace')}
                                    sx={{ py: 1.5 }}
                                >
                                    הסרת שאלה פר חלל
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>

                {/* כפתור חזרה */}
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                    <Button
                        variant="text"
                        onClick={() => navigate(-1)}
                        sx={{ px: 4 }}
                    >
                        חזרה
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default MainMenu;
