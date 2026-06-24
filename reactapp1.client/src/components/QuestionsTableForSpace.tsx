/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Box } from "@mui/material";
import UpdateQuestion from "./Update-question";
import { get, post } from "../libs/rest-service";
import { useNavigate } from "react-router-dom";

interface Question {
    id: number;
    question: string;
    active: boolean;
    type: string;
    priority: number;
}

const QuestionsTableForSpace = () => {
    const navigate = useNavigate();
    const apiBasePath = "/QuestionsForSpace";

    const [questions, setQuestions] = useState<Question[]>([]);
    const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
    const [isDialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        get(`${apiBasePath}/GetAllQuestions`)
            .then((data) => {
                if (Array.isArray(data)) {
                    setQuestions(data);
                } else {
                    console.error("Invalid data format:", data);
                }
            })
            .catch((err) => console.error("Error fetching questions", err));
    }, []);

    const handleRowDoubleClick = (question: Question) => {
        setSelectedQuestion(question);
        setDialogOpen(true);
    };

    const handleSaveStatus = async (id: number, newStatus: boolean) => {
        try {
            const questionToUpdate = questions.find(q => q.id === id);
            if (!questionToUpdate) return;

            const updatedQuestion = { ...questionToUpdate, active: newStatus };
            await post(`${apiBasePath}/UpdateQuestion`, updatedQuestion);

            setQuestions(prev =>
                prev.map(q => (q.id === id ? updatedQuestion : q))
            );
            alert("השאלה עודכנה בהצלחה!");
        } catch (error) {
            console.error("Error updating question", error);
            alert("שגיאה בעדכון השאלה.");
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">
                    שאלות פר חלל
                </Typography>
                <Button variant="outlined" onClick={() => navigate(-1)}>
                    חזרה
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>מספר שאלה</TableCell>
                            <TableCell>שאלה</TableCell>
                            <TableCell>סוג</TableCell>
                            <TableCell>קדימות</TableCell>
                            <TableCell>פעיל</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {questions.map((question) => (
                            <TableRow 
                                key={question.id} 
                                onDoubleClick={() => handleRowDoubleClick(question)} 
                                style={{ cursor: "pointer" }}
                                hover
                            >
                                <TableCell>{question.id}</TableCell>
                                <TableCell>{question.question}</TableCell>
                                <TableCell>{question.type}</TableCell>
                                <TableCell>{question.priority || 0}</TableCell>
                                <TableCell>{question.active ? "כן" : "לא"}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {selectedQuestion && (
                <UpdateQuestion
                    open={isDialogOpen}
                    onClose={() => {
                        setDialogOpen(false);
                        setSelectedQuestion(null);
                    }}
                    question={selectedQuestion}
                    onSave={handleSaveStatus}
                    apiBasePath={apiBasePath}
                />
            )}
        </Box>
    );
};

export default QuestionsTableForSpace;
