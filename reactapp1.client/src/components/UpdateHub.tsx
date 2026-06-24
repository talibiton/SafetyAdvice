import React, { useState, useEffect } from "react";
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button, 
    TextField, 
    Box, 
    Switch, 
    FormControlLabel,
    Alert,
    CircularProgress
} from "@mui/material";
import { put } from "../libs/rest-service";

interface UpdateHubProps {
    open: boolean;
    onClose: () => void;
    hub: {
        id: string;
        firstName: string;
        lastName: string;
        phone: string;
        email: string;
        active: boolean;
    } | null;
    onSave: (hub: any) => void;
}

const UpdateHub: React.FC<UpdateHubProps> = ({ open, onClose, hub, onSave }) => {
    const [formData, setFormData] = useState({
        id: "",
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        active: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (hub) {
            setFormData({
                id: hub.id,
                firstName: hub.firstName,
                lastName: hub.lastName,
                phone: hub.phone,
                email: hub.email,
                active: hub.active
            });
            setError(null);
        }
    }, [hub]);

    const handleChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        setError(null); // מנקה שגיאות בזמן שינוי
    };

    const handleSave = async () => {
        if (!hub) return;

        // Validation
        if (!formData.firstName.trim()) {
            setError("שם פרטי הוא שדה חובה");
            return;
        }

        if (!formData.lastName.trim()) {
            setError("שם משפחה הוא שדה חובה");
            return;
        }

        if (!formData.phone.trim()) {
            setError("טלפון הוא שדה חובה");
            return;
        }

        if (!formData.email.trim()) {
            setError("אימייל הוא שדה חובה");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            console.log('Updating hub with data:', formData);
            const response = await put("/Hub/UpdateHub", formData);
            console.log('Hub updated successfully:', response);
            
            onSave(formData);
            onClose();
            alert("הרכזת עודכנה בהצלחה!");
        } catch (error: any) {
            console.error("Error saving hub:", error);
            
            let errorMessage = "שגיאה לא ידועה בעדכון רכזת";
            
            if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (typeof error?.response?.data === 'string') {
                errorMessage = error.response.data;
            } else if (error?.message) {
                errorMessage = error.message;
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ textAlign: 'right', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                עדכון רכזת
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <TextField
                        label="מזהה רכזת"
                        value={formData.id}
                        fullWidth
                        disabled
                        InputProps={{
                            style: { textAlign: 'right' }
                        }}
                    />
                    
                    <TextField
                        label="שם פרטי"
                        value={formData.firstName}
                        onChange={(e) => handleChange('firstName', e.target.value)}
                        fullWidth
                        required
                        error={!formData.firstName.trim()}
                        helperText={!formData.firstName.trim() ? "שדה חובה" : ""}
                        InputProps={{
                            style: { textAlign: 'right' }
                        }}
                    />
                    
                    <TextField
                        label="שם משפחה"
                        value={formData.lastName}
                        onChange={(e) => handleChange('lastName', e.target.value)}
                        fullWidth
                        required
                        error={!formData.lastName.trim()}
                        helperText={!formData.lastName.trim() ? "שדה חובה" : ""}
                        InputProps={{
                            style: { textAlign: 'right' }
                        }}
                    />
                    
                    <TextField
                        label="טלפון"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        fullWidth
                        required
                        error={!formData.phone.trim()}
                        helperText={!formData.phone.trim() ? "שדה חובה" : ""}
                        InputProps={{
                            style: { textAlign: 'right' }
                        }}
                    />
                    
                    <TextField
                        label="אימייל"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        fullWidth
                        required
                        type="email"
                        error={!formData.email.trim()}
                        helperText={!formData.email.trim() ? "שדה חובה" : ""}
                        InputProps={{
                            style: { textAlign: 'right' }
                        }}
                    />
                    
                    <FormControlLabel
                        control={
                            <Switch 
                                checked={formData.active} 
                                onChange={(e) => handleChange('active', e.target.checked)}
                                color="primary"
                            />
                        }
                        label="פעיל"
                        sx={{ marginTop: 2 }}
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ padding: 2, justifyContent: 'space-between' }}>
                <Button 
                    onClick={onClose} 
                    color="secondary" 
                    variant="outlined"
                    disabled={loading}
                >
                    ביטול
                </Button>
                <Button 
                    onClick={handleSave} 
                    color="primary" 
                    variant="contained"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                    {loading ? "מעדכן..." : "עדכון"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateHub;
