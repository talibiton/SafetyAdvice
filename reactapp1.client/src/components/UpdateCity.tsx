import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Switch, FormControlLabel, TextField } from "@mui/material";
import { post } from "../libs/rest-service";

interface UpdateCityProps {
    open: boolean;
    onClose: () => void;
    city: { cityCode: number; name: string; active: boolean } | null;
    onSave: (cityCode: number, newStatus: boolean) => void;
}

const UpdateCity: React.FC<UpdateCityProps> = ({ open, onClose, city, onSave }) => {
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (city) {
            setIsActive(city.active);
        }
    }, [city]);

    const handleSave = async () => {
        if (!city) return;

        const cityUpdate = {
            cityCode: city.cityCode,
            name: city.name,
            active: isActive
        };

        try {
            const response = await post("/Cities/UpdateCity", cityUpdate);

            if (response) {
                onSave(city.cityCode, isActive);
                onClose();
            } else {
                throw new Error("Failed to update city");
            }
        } catch (error) {
            console.error("Error saving city:", error);
            alert("שגיאה בחיבור לשרת");
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ textAlign: 'right', fontWeight: 'bold' }}>עדכון עיר</DialogTitle>
            <DialogContent>
                <TextField 
                    label="שם העיר" 
                    value={city?.name || ''} 
                    fullWidth 
                    disabled 
                    margin="normal"
                    InputProps={{
                        style: { textAlign: 'right' }
                    }}
                />
                <TextField 
                    label="קוד עיר" 
                    value={city?.cityCode || ''} 
                    fullWidth 
                    disabled 
                    margin="normal"
                    InputProps={{
                        style: { textAlign: 'right' }
                    }}
                />
                <FormControlLabel
                    control={
                        <Switch 
                            checked={isActive} 
                            onChange={(e) => setIsActive(e.target.checked)}
                            color="primary"
                        />
                    }
                    label="פעיל"
                    sx={{ marginTop: 2 }}
                />
            </DialogContent>
            <DialogActions sx={{ padding: 2, justifyContent: 'space-between' }}>
                <Button onClick={onClose} color="secondary" variant="outlined">
                    ביטול
                </Button>
                <Button onClick={handleSave} color="primary" variant="contained">
                    עדכון
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateCity;
