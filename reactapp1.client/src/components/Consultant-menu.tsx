import { Button, Container, Typography, Stack, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ConsultantMenuForm = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                backgroundColor: '#ffffff', // רקע לבן חלק
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
                        color: '#800020', // בורדו כהה
                    }}
                >
                    תפריט יועץ
                </Typography>

                <Stack spacing={2} mt={4}>
                    <CustomMenuButton onClick={() => navigate("/auditForm")}>
                        מבדק בטיחות
                    </CustomMenuButton>
                    <CustomMenuButton onClick={() => navigate("/auditTable")}>
                        מבדקי בטיחות
                    </CustomMenuButton>
                    <CustomMenuButton onClick={() => navigate("/questionsManagement")}>
                        ניהול שאלות במבדק
                    </CustomMenuButton>
                </Stack>
            </Container>
        </Box>
    );
};

// כפתור מותאם אישית
const CustomMenuButton = ({ children, onClick }: { children: React.ReactNode, onClick: () => void }) => {
    return (
        <Button
            variant="outlined"
            fullWidth
            onClick={onClick}
            sx={{
                backgroundColor: '#ffffff',     // לבן
                borderColor: '#a8324a',         // בורדו בהיר
                color: '#a8324a',               // בורדו בהיר
                fontWeight: 'bold',
                borderWidth: 2,
                fontSize: '1rem',
                paddingY: 1.5,
                borderRadius: 2,
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

export default ConsultantMenuForm;
