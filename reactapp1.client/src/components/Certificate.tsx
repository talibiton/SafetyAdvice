/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Paper, Typography, Button, Divider, useMediaQuery, useTheme } from '@mui/material';
import { Print as PrintIcon } from '@mui/icons-material';
import { get } from '../libs/rest-service';

const Certificate = () => {
    const { auditId } = useParams<{ auditId: string }>();
    const [audit, setAudit] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        loadAuditDetails();
    }, [auditId]);

    const loadAuditDetails = async () => {
        try {
            const data = await get(`/auditDetail/${auditId}`);
            setAudit(data);
        } catch (error) {
            console.error('Error loading audit:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const formatDate = (date: any): string => {
        if (!date) return '';
        try {
            return new Date(date).toLocaleDateString('he-IL', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch {
            return '';
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <Typography>טוען...</Typography>
            </Box>
        );
    }

    if (!audit) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <Typography>מבדק לא נמצא</Typography>
            </Box>
        );
    }

    const InfoRow = ({ label, value }: { label: string; value: string }) => (
        <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: '150px 1fr' },
            gap: { xs: 0.5, sm: 2 },
            mb: { xs: 1.5, sm: 1 }
        }}>
            <Typography 
                sx={{ 
                    fontWeight: 'bold',
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
            >
                {label}
            </Typography>
            <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                {value}
            </Typography>
        </Box>
    );

    return (
        <Box sx={{ 
            p: { xs: 1, sm: 2, md: 4 }, 
            maxWidth: '800px', 
            margin: '0 auto',
            width: '100%'
        }}>
            <Button 
                variant="contained" 
                startIcon={<PrintIcon />}
                onClick={handlePrint}
                sx={{ 
                    mb: 2,
                    width: { xs: '100%', sm: 'auto' }
                }}
                className="no-print"
                size={isMobile ? 'small' : 'medium'}
            >
                הדפס אישור
            </Button>

            <Paper 
                sx={{ 
                    p: { xs: 2, sm: 3, md: 4 },
                    direction: 'rtl',
                    '@media print': {
                        boxShadow: 'none',
                        border: '1px solid #000'
                    }
                }}
            >
                {/* כותרת */}
                <Box sx={{ textAlign: 'center', mb: { xs: 2, sm: 3, md: 4 } }}>
                    <Typography 
                        variant="h3" 
                        sx={{ 
                            fontWeight: 'bold', 
                            mb: 1,
                            fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' }
                        }}
                    >
                        אישור ביקור משפחתון
                    </Typography>
                    <Typography 
                        variant="h6" 
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' } }}
                    >
                        מערכת ייעוץ בטיחות משפחתונים
                    </Typography>
                </Box>

                <Divider sx={{ my: { xs: 2, sm: 3 } }} />

                {/* פרטי המבדק */}
                <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                    <Typography 
                        variant="h5" 
                        sx={{ 
                            mb: 2, 
                            fontWeight: 'bold',
                            fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' }
                        }}
                    >
                        פרטי המבדק
                    </Typography>
                    
                    <InfoRow 
                        label="תאריך ביקור:" 
                        value={formatDate(audit.auditDetail?.auditDate)} 
                    />
                    <InfoRow 
                        label="מספר מבדק:" 
                        value={audit.auditDetail?.id} 
                    />
                    <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: { xs: '1fr', sm: '150px 1fr' },
                        gap: { xs: 0.5, sm: 2 },
                        mb: { xs: 1.5, sm: 1 }
                    }}>
                        <Typography 
                            sx={{ 
                                fontWeight: 'bold',
                                fontSize: { xs: '0.875rem', sm: '1rem' }
                            }}
                        >
                            סטטוס:
                        </Typography>
                        <Typography sx={{ 
                            color: audit.auditDetail?.approvalStatus ? 'success.main' : 'error.main',
                            fontWeight: 'bold',
                            fontSize: { xs: '0.875rem', sm: '1rem' }
                        }}>
                            {audit.auditDetail?.approvalStatus ? '? מאושר' : '? לא מאושר'}
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: { xs: 2, sm: 3 } }} />

                {/* פרטי המשפחתון */}
                <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                    <Typography 
                        variant="h5" 
                        sx={{ 
                            mb: 2, 
                            fontWeight: 'bold',
                            fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' }
                        }}
                    >
                        פרטי המשפחתון
                    </Typography>
                    
                    <InfoRow 
                        label="סמל משפחתון:" 
                        value={audit.kindergarten?.code} 
                    />
                    <InfoRow 
                        label="כתובת:" 
                        value={`${audit.kindergarten?.street} ${audit.kindergarten?.homeNum}, קומה ${audit.kindergarten?.floor}`}
                    />
                    <InfoRow 
                        label="עיר:" 
                        value={audit.kindergarten?.city?.name} 
                    />
                    <InfoRow 
                        label="מפעיל:" 
                        value={audit.organization?.name} 
                    />
                </Box>

                <Divider sx={{ my: { xs: 2, sm: 3 } }} />

                {/* פרטי מטפלת */}
                <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                    <Typography 
                        variant="h5" 
                        sx={{ 
                            mb: 2, 
                            fontWeight: 'bold',
                            fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' }
                        }}
                    >
                        פרטי מטפלת
                    </Typography>
                    
                    <InfoRow 
                        label="שם מלא:" 
                        value={`${audit.nanny?.firstName} ${audit.nanny?.lastName}`}
                    />
                    <InfoRow 
                        label="תעודת זהות:" 
                        value={audit.nanny?.id} 
                    />
                    <InfoRow 
                        label="טלפון:" 
                        value={audit.nanny?.phone} 
                    />
                </Box>

                <Divider sx={{ my: { xs: 2, sm: 3 } }} />

                {/* פרטי רכזת */}
                <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                    <Typography 
                        variant="h5" 
                        sx={{ 
                            mb: 2, 
                            fontWeight: 'bold',
                            fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' }
                        }}
                    >
                        רכזת
                    </Typography>
                    
                    <InfoRow 
                        label="שם מלא:" 
                        value={`${audit.hub?.firstName} ${audit.hub?.lastName}`}
                    />
                </Box>

                <Divider sx={{ my: { xs: 2, sm: 3 } }} />

                {/* פרטי היועץ */}
                {audit.counselor && (
                    <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                        <Typography 
                            variant="h5" 
                            sx={{ 
                                mb: 2, 
                                fontWeight: 'bold',
                                fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' }
                            }}
                        >
                            יועץ בטיחות
                        </Typography>
                        
                        <InfoRow 
                            label="שם מלא:" 
                            value={`${audit.counselor?.firstName} ${audit.counselor?.lastName}`}
                        />
                        <InfoRow 
                            label="תעודת זהות:" 
                            value={audit.counselor?.id} 
                        />
                    </Box>
                )}

                {/* סיכום */}
                <Box sx={{ mt: { xs: 3, sm: 4, md: 5 }, textAlign: 'center' }}>
                    <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                    >
                        אישור זה הופק אוטומטית ממערכת ייעוץ בטיחות משפחתונים
                    </Typography>
                    <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                    >
                        תאריך הפקה: {formatDate(new Date())}
                    </Typography>
                </Box>
            </Paper>

            <style>
                {`
                    @media print {
                        .no-print {
                            display: none !important;
                        }
                        body {
                            print-color-adjust: exact;
                            -webkit-print-color-adjust: exact;
                        }
                        @page {
                            margin: 1cm;
                        }
                    }
                `}
            </style>
        </Box>
    );
};

export default Certificate;
