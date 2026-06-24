import { Button, Container, Typography, Stack, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Reports = () => {
    const navigate = useNavigate();

    const handleClosedImmediately = () => {
        navigate('/reports/kindergartens', { state: { reportType: 'closed-immediately' } });
    };

    const handleNeedRepairs = () => {
        navigate('/reports/kindergartens', { state: { reportType: 'need-repairs' } });
    };

    const handleApprovedImmediately = () => {
        navigate('/reports/kindergartens', { state: { reportType: 'approved-immediately' } });
    };

    const handleAuditedOnDate = () => {
        navigate('/reports/audited-by-counselor');
    };

    const handleNotAuditedYet = () => {
        navigate('/reports/kindergartens', { state: { reportType: 'not-audited' } });
    };

    const handleAddressChanged = () => {
        navigate('/reports/address-changed');
    };

    return (
        <Box
            sx={{
                backgroundColor: '#ffffff',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                direction: 'rtl',
                padding: 2,
            }}
        >
            <Container maxWidth="sm">
                <Typography
                    variant="h4"
                    align="center"
                    gutterBottom
                    sx={{
                        fontWeight: 'bold',
                        color: '#800020',
                    }}
                >
                    דוחות
                </Typography>

                <Stack spacing={2} mt={4}>
                    <ReportButton onClick={handleClosedImmediately}>
משפחתונים שנסגרו מיידית וסגורים כעת                    </ReportButton>
                    <ReportButton onClick={handleNeedRepairs}>
משפחתונים שצריכים לתקן ליקויים                     </ReportButton>
                    <ReportButton onClick={handleApprovedImmediately}>
משפחתונים שקיבלו אישור מיידי                     </ReportButton>
                    <ReportButton onClick={handleAuditedOnDate}>
באיזה משפחתונים נמצא היועץ ביום מסויים  
                    </ReportButton>
                    <ReportButton onClick={handleNotAuditedYet}>
                        משפחתונים שלא נבדקו עדיין
                    </ReportButton>
                    <ReportButton onClick={handleAddressChanged}>
                      משפחתונים שכתובתם השתנתה
                    </ReportButton>
                </Stack>

                <Box mt={4} display="flex" justifyContent="center">
                    {/*<Button*/}
                    {/*    variant="contained"*/}
                    {/*    onClick={() => navigate('/consultantMenuForm')}*/}
                    {/*    sx={{*/}
                    {/*        backgroundColor: '#800020',*/}
                    {/*        color: '#ffffff',*/}
                    {/*        fontWeight: 'bold',*/}
                    {/*        paddingX: 4,*/}
                    {/*        paddingY: 1,*/}
                    {/*        '&:hover': {*/}
                    {/*            backgroundColor: '#a8324a',*/}
                    {/*        },*/}
                    {/*    }}*/}
                    {/*>*/}
                        
                    {/*</Button>*/}
                </Box>
            </Container>
        </Box>
    );
};

const ReportButton = ({ children, onClick }: { children: React.ReactNode, onClick: () => void }) => {
    return (
        <Button
            variant="outlined"
            fullWidth
            onClick={onClick}
            sx={{
                backgroundColor: '#ffffff',
                borderColor: '#a8324a',
                color: '#a8324a',
                fontWeight: 'bold',
                borderWidth: 2,
                fontSize: '1rem',
                paddingY: 1.5,
                borderRadius: 2,
                textAlign: 'center',
                '&:hover': {
                    backgroundColor: '#fcefee',
                    borderColor: '#8b2b3f',
                },
            }}
        >
            {children}
        </Button>
    );
};

export default Reports;
