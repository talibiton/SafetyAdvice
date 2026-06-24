import { useState } from 'react';
import { Button, Container, Typography, TextField } from '@mui/material';
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { IconButton, List, ListItem, ListItemText, ListItemSecondaryAction } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { post } from '../libs/rest-service';

const AddQuestion = () => {
    const [question, setQuestion] = useState("");
    const [questionType, setQuestionType] = useState("");
    const [priority, setPriority] = useState(0);
    const [options, setOptions] = useState<string[]>([]);
    const [newOption, setNewOption] = useState("");

    const handleSave = async () => {
        if (!question || !questionType) {
            alert("נא למלא את כל השדות");
            return;
        }

        if (questionType === "multiple-choice" && options.length === 0) {
            alert("נא להוסיף לפחות אפשרות אחת");
            return;
        }

        const newQuestion = {
            question: question,  // ודאי שהשדות מתאימים לשירות בשרת
            type: questionType,
            priority: priority,
            options: options.length > 0 ? options.map(option => ({ option })) : [] // אם אין אופציות, שולחים null
        };

        try {
            const response = await post("/Save/AddQuestion", newQuestion);
            alert('השאלה נשמרה בהצלחה!');
            setQuestion("");
            setQuestionType("");
            setPriority(0);
            setOptions([]);
        } catch (error) {
            console.error("Error saving Question:", error);
            alert('שגיאה בחיבור לשרת');
        }
    };

    const handleAddOption = () => {
        if (newOption.trim() === "") return;
        setOptions([...options, newOption]);
        setNewOption("");
    };

    const handleRemoveOption = (index: number) => {
        setOptions(options.filter((_, i) => i !== index));
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: "20px" }}>
            <Typography variant="h5" gutterBottom>
                הוספת שאלה חדשה
            </Typography>

            <TextField
                fullWidth
                label="הזן את השאלה"
                variant="outlined"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                margin="normal"
            />

            <FormControl fullWidth margin="normal">
                <InputLabel>סוג השאלה</InputLabel>
                <Select value={questionType} onChange={(e) => setQuestionType(e.target.value)}>
                    <MenuItem value="text">טקסט</MenuItem>
                    <MenuItem value="date">תאריך</MenuItem>
                    <MenuItem value="boolean">בוליאני</MenuItem>
                    <MenuItem value="multiple-choice">בחירה מרובה</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
                <InputLabel>קדימות</InputLabel>
                <Select value={priority} onChange={(e) => setPriority(Number(e.target.value))}>
                    <MenuItem value={0}>0 - רגילה</MenuItem>
                    <MenuItem value={1}>1 - בינונית</MenuItem>
                    <MenuItem value={2}>2 - גבוהה</MenuItem>
                </Select>
            </FormControl>

            {/* הוספת אפשרויות במקרה של בחירה מרובה */}
            {questionType === "multiple-choice" && (
                <>
                    <Typography variant="subtitle1" style={{ marginTop: "10px" }}>
                        אפשרויות תשובה:
                    </Typography>
                    <List>
                        {options.map((option, index) => (
                            <ListItem key={index}>
                                <ListItemText primary={option} />
                                <ListItemSecondaryAction>
                                    <IconButton edge="end" onClick={() => handleRemoveOption(index)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>

                    <TextField
                        fullWidth
                        label="הוסף אפשרות"
                        variant="outlined"
                        value={newOption}
                        onChange={(e) => setNewOption(e.target.value)}
                        margin="normal"
                    />
                    <Button variant="contained" onClick={handleAddOption} style={{ marginBottom: "10px" }}>
                        הוסף אפשרות
                    </Button>
                </>
            )}

            <Button variant="contained" color="primary" fullWidth onClick={handleSave} style={{ marginTop: "10px" }}>
                שמור שאלה
            </Button>
        </Container>
    ); 
};

export default AddQuestion;
