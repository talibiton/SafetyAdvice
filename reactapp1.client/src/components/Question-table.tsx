/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import UpdateQuestion from "./Update-question";
import { get, post } from "../libs/rest-service";
import { useLocation } from "react-router-dom";
import { Typography } from "@mui/material";

interface Question {
    id: number;
    question: string;
    active: boolean;
    type: string;
    priority?: number;
}

const QuestionsTable = () => {
    const location = useLocation();
    const apiBasePath = location.state?.apiBasePath || "/question";
    const title = location.state?.title || "שאלות";

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
    }, [apiBasePath]);

    // לחיצה כפולה על שורה תפתח את הדיאלוג
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
        <div style={{ padding: "20px" }}>
            <Typography variant="h4" gutterBottom>
                {title}
            </Typography>
            {/* טבלת השאלות */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>מספר מזהה</TableCell>
                            <TableCell>שאלה</TableCell>
                            <TableCell>סוג</TableCell>
                            <TableCell>פעיל</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {questions.map((question) => (
                            <TableRow key={question.id} onDoubleClick={() => handleRowDoubleClick(question)} style={{ cursor: "pointer" }}>
                                <TableCell>{question.id}</TableCell>
                                <TableCell>{question.question}</TableCell>
                                <TableCell>{question.type}</TableCell>
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
        </div>
    );
};

export default QuestionsTable;
