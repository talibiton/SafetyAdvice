/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Switch, FormControlLabel, TextField } from "@mui/material";
import { post } from "../libs/rest-service";

interface StatusPopupProps {
    open: boolean;
    onClose: () => void;
    question: { id: number; question: string; active: boolean, type: string, priority?: number } | null;
    onSave: (id: number, newStatus: boolean) => void;
    apiBasePath: string;
}
const UpdateQuestion: React.FC<StatusPopupProps> = ({ open, onClose, question, onSave, apiBasePath }) => {
    const [isActive, setIsActive] = useState(question?.active ?? false);
    const [priority, setPriority] = useState(question?.priority ?? 0);

    useEffect(() => {
        if (question) {
            setIsActive(question.active ?? false);
            setPriority(question.priority ?? 0);
        }
    }, [question]);

    const handleSave = async () => {
        if (!question) return;

        const questionUpdate = {
            id: question.id,
            question: question.question,
            active: isActive,
            type: question.type,
            priority: priority
        };

        try {
            const response = await post(`${apiBasePath}/UpdateQuestion`, questionUpdate);

            if (response) {
                onSave(question.id, isActive); // עדכון הטבלה בקומפוננטת ההורה
                onClose(); // סגירת הפופ-אפ
            } else {
                throw new Error("Failed to update question");
            }
        } catch (error) {
            console.error("Error saving Question:", error);
            alert("שגיאה בחיבור לשרת");
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle> שאלה עדכון</DialogTitle>
            <DialogContent>
                <TextField label="שאלה" value={question?.question ?? ''} fullWidth disabled />
                <TextField label="סוג השאלה" value={question?.type ?? ''} fullWidth disabled />
                <TextField 
                    label="קדימות (0, 1, 2)" 
                    type="number"
                    value={priority} 
                    onChange={(e) => setPriority(Number(e.target.value))}
                    fullWidth 
                    inputProps={{ min: 0, max: 2 }}
                    style={{ marginTop: '10px' }}
                />
                <FormControlLabel
                    control={<Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />}
                    label="פעיל"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">ביטול</Button>
                <Button onClick={handleSave} color="primary">שמירה</Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateQuestion;
