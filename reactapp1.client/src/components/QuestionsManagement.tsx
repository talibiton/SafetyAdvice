import { Button, Container, Typography, Stack, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const QuestionsManagement = () => {
    const navigate = useNavigate();

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
                    ניהול שאלות במבדק
                </Typography>

                <Stack spacing={2} mt={4}>
                    <CustomMenuButton onClick={() => navigate("/addQuestion")}>
                        הוספת שאלה/ות למבדק
                    </CustomMenuButton>
                    <CustomMenuButton onClick={() => navigate("/questionsTable", {
                        state: {
                            apiBasePath: "/question",
                            title: "שאלות כלליות"
                        }
                    })}>
                        הסרת שאלה/ות מהמבדק
                    </CustomMenuButton>
                    <CustomMenuButton onClick={() => navigate("/addQuestionForSpace")}>
                        הוספת שאלה/ות פר חלל למבדק
                    </CustomMenuButton>
                    <CustomMenuButton onClick={() => navigate("/questionsTable", {
                        state: {
                            apiBasePath: "/questionsForSpace",
                            title: "שאלות פר חלל"
                        }
                    })}>
                        הסרת שאלה/ות פר חלל מהמבדק
                    </CustomMenuButton>
                    <CustomMenuButton 
                        onClick={() => navigate(-1)}
                        sx={{
                            marginTop: 4,
                            backgroundColor: '#f5f5f5',
                            borderColor: '#999',
                            color: '#666',
                            '&:hover': {
                                backgroundColor: '#e0e0e0',
                                borderColor: '#777',
                            },
                        }}
                    >
                        חזרה
                    </CustomMenuButton>
                </Stack>
            </Container>
        </Box>
    );
};

// כפתור מותאם אישית
const CustomMenuButton = ({ children, onClick, sx }: { children: React.ReactNode, onClick: () => void, sx?: object }) => {
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
                '&:hover': {
                    backgroundColor: '#fcefee',
                    borderColor: '#8b2b3f',
                },
                ...sx
            }}
        >
            {children}
        </Button>
    );
};

export default QuestionsManagement;
