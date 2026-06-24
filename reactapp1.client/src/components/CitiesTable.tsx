import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import UpdateCity from "./UpdateCity";
import { get, post } from "../libs/rest-service";

interface City {
    cityCode: number;
    name: string;
    active: boolean;
}

const CitiesTable = () => {
    const navigate = useNavigate();
    const [cities, setCities] = useState<City[]>([]);
    const [selectedCity, setSelectedCity] = useState<City | null>(null);
    const [isDialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        loadCities();
    }, []);

    const loadCities = () => {
        get("/Cities/GetCities")
            .then((data) => {
                if (Array.isArray(data)) {
                    setCities(data);
                    console.log("Cities loaded:", data);
                } else {
                    console.error("Invalid data format:", data);
                }
            })
            .catch((err) => console.error("Error fetching cities", err));
    };

    const handleRowDoubleClick = (city: City) => {
        console.log("Row double clicked:", city);
        setSelectedCity(city);
        setDialogOpen(true);
    };

    const handleSaveStatus = async (cityCode: number, newStatus: boolean) => {
        try {
            const cityToUpdate = cities.find(c => c.cityCode === cityCode);
            if (!cityToUpdate) return;

            const updatedCity = { ...cityToUpdate, active: newStatus };
            await post("/Cities/UpdateCity", updatedCity);

            setCities(prev =>
                prev.map(c => (c.cityCode === cityCode ? updatedCity : c))
            );
            alert("העיר עודכנה בהצלחה!");
        } catch (error) {
            console.error("Error updating city", error);
            alert("שגיאה בעדכון העיר.");
        }
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
                    עדכון ערים
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
                לחץ לחיצה כפולה על עיר לעריכת הסטטוס
            </Typography>

            {cities.length === 0 ? (
                <Typography variant="body1" sx={{ textAlign: 'center', mt: 4, color: '#999' }}>
                    אין ערים להצגה
                </Typography>
            ) : (
                <TableContainer component={Paper} elevation={3}>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>קוד עיר</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>שם העיר</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>סטטוס</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cities.map((city) => (
                                <TableRow
                                    key={city.cityCode}
                                    onDoubleClick={() => handleRowDoubleClick(city)}
                                    sx={{
                                        cursor: "pointer",
                                        '&:hover': {
                                            backgroundColor: '#f9f9f9'
                                        }
                                    }}
                                >
                                    <TableCell sx={{ textAlign: 'right' }}>{city.cityCode}</TableCell>
                                    <TableCell sx={{ textAlign: 'right' }}>{city.name}</TableCell>
                                    <TableCell sx={{ textAlign: 'right' }}>
                                        <span style={{
                                            color: city.active ? 'green' : 'red',
                                            fontWeight: 'bold'
                                        }}>
                                            {city.active ? "פעיל" : "לא פעיל"}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <UpdateCity
                open={isDialogOpen}
                onClose={() => {
                    console.log("Closing dialog");
                    setDialogOpen(false);
                    setSelectedCity(null);
                }}
                city={selectedCity}
                onSave={handleSaveStatus}
            />
        </Box>
    );
};

export default CitiesTable;
