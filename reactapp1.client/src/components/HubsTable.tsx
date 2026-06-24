import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import UpdateHub from "./UpdateHub";
import { get } from "../libs/rest-service";

interface Hub {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    active: boolean;
}

const HubsTable = () => {
    const navigate = useNavigate();
    const [hubs, setHubs] = useState<Hub[]>([]);
    const [selectedHub, setSelectedHub] = useState<Hub | null>(null);
    const [isDialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        loadHubs();
    }, []);

    const loadHubs = () => {
        console.log('Loading hubs...');
        get("/Hub/GetHubs")
            .then((data) => {
                if (Array.isArray(data)) {
                    setHubs(data);
                    console.log("Hubs loaded successfully:", data);
                } else {
                    console.error("Invalid data format:", data);
                }
            })
            .catch((err) => {
                console.error("Error fetching hubs:", err);
                alert("שגיאה בטעינת הרכזות");
            });
    };

    const handleRowDoubleClick = (hub: Hub) => {
        console.log("Row double clicked:", hub);
        setSelectedHub(hub);
        setDialogOpen(true);
    };

    const handleSaveHub = () => {
        console.log('Hub saved, reloading data...');
        // טעינה מחדש של הנתונים מהשרת אחרי עדכון מוצלח
        loadHubs();
    };

    const handleCloseDialog = () => {
        console.log("Closing dialog");
        setDialogOpen(false);
        setSelectedHub(null);
    };

    return (
        <Box
            sx={{
                backgroundColor: '#ffffff',
                minHeight: '100vh',
                padding: 3,
                direction: 'rtl'
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#800020' }}>
                    עדכון רכזות
                </Typography>
                <Button
                    variant="outlined"
                    onClick={() => navigate(-1)}
                    sx={{
                        borderColor: '#a8324a',
                        color: '#a8324a',
                        '&:hover': {
                            backgroundColor: '#fcefee',
                            borderColor: '#8b2b3f',
                        }
                    }}
                >
                    חזרה
                </Button>
            </Box>

            <Typography variant="body1" sx={{ mb: 2, color: '#666' }}>
                לחץ לחיצה כפולה על רכזת לעריכת הפרטים
            </Typography>

            {hubs.length === 0 ? (
                <Typography variant="body1" sx={{ textAlign: 'center', mt: 4, color: '#999' }}>
                    אין רכזות להצגה
                </Typography>
            ) : (
                <TableContainer component={Paper} elevation={3}>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>מזהה</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>שם פרטי</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>שם משפחה</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>טלפון</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>אימייל</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>סטטוס</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {hubs.map((hub) => (
                                <TableRow
                                    key={hub.id}
                                    onDoubleClick={() => handleRowDoubleClick(hub)}
                                    sx={{
                                        cursor: "pointer",
                                        '&:hover': {
                                            backgroundColor: '#f9f9f9'
                                        }
                                    }}
                                >
                                    <TableCell sx={{ textAlign: 'right' }}>{hub.id}</TableCell>
                                    <TableCell sx={{ textAlign: 'right' }}>{hub.firstName}</TableCell>
                                    <TableCell sx={{ textAlign: 'right' }}>{hub.lastName}</TableCell>
                                    <TableCell sx={{ textAlign: 'right' }}>{hub.phone}</TableCell>
                                    <TableCell sx={{ textAlign: 'right' }}>{hub.email}</TableCell>
                                    <TableCell sx={{ textAlign: 'right' }}>
                                        <span style={{
                                            color: hub.active ? 'green' : 'red',
                                            fontWeight: 'bold'
                                        }}>
                                            {hub.active ? "פעיל" : "לא פעיל"}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <UpdateHub
                open={isDialogOpen}
                onClose={handleCloseDialog}
                hub={selectedHub}
                onSave={handleSaveHub}
            />
        </Box>
    );
};

export default HubsTable;
