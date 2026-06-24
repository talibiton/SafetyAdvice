/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Paper, 
    Typography, 
    TextField, 
    Grid, 
    Button, 
    Table, 
    TableHead, 
    TableRow, 
    TableCell, 
    TableBody, 
    Select, 
    MenuItem,
    Alert,
    Snackbar,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Box,
    IconButton,
    Dialog,
    DialogContent,
    DialogActions
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { get, put } from '../libs/rest-service';

const AuditEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [audit, setAudit] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState<any[]>([]);
    const [questionsError, setQuestionsError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [auditType, setAuditType] = useState<number>(0);
    const [approvalStatus, setApprovalStatus] = useState<number>(0);
    const [imageDialogOpen, setImageDialogOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            setLoading(true);
            get(`/AuditDetail/GetFullAuditWithQuestions/${id}`)
                .then((data) => {
                    console.log("Received API response:", data);
                    if (data && data.audit) {
                        setAudit(data.audit);
                        setAuditType(data.audit.auditDetail.type || 0);
                        setApprovalStatus(data.audit.auditDetail.approvalStatus || 0);
                        if (Array.isArray(data.questions)) {
                            const processedQuestions = data.questions.map((q: any) => {
                                const originalAnswerId = q.answer || '';
                                
                                return {
                                    ...q,
                                    answer: originalAnswerId,
                                    answerOptions: Array.isArray(q.answerOptions) ? q.answerOptions : [],
                                    img: q.img || null,
                                    imagePreview: q.img || null
                                };
                            });
                            console.log("Processed questions:", processedQuestions);
                            setQuestions(processedQuestions);
                            setQuestionsError(null);
                        } else {
                            console.error("Questions data is not an array:", data.questions);
                            setQuestionsError('מבנה השאלות שהתקבל אינו תקין');
                            setQuestions([]);
                        }
                    } else {
                        console.error("Invalid data received:", data);
                        setQuestionsError('מבנה הנתונים שהתקבל אינו תקין');
                    }
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching audit and questions:', error);
                    setQuestionsError('שגיאה בטעינת המבדק והשאלות');
                    setQuestions([]);
                    setLoading(false);
                });
        }
    }, [id]);

    const handleAnswerChange = (questionId: number, value: string) => {
        console.log("Changing answer:", { questionId, value });
        setQuestions(prevQuestions => 
            prevQuestions.map(q => 
                q.questionId === questionId 
                    ? { ...q, answer: value }
                    : q
            )
        );
    };

    const handlePriorityChange = (questionId: number, value: number) => {
        console.log("Changing priority:", { questionId, value });
        setQuestions(prevQuestions => 
            prevQuestions.map(q => 
                q.questionId === questionId 
                    ? { ...q, priority: value }
                    : q
            )
        );
    };

    const handleImageUpload = (questionId: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('גודל התמונה גדול מדי. מקסימום 5MB');
                return;
            }
            
            // דחיסת התמונה לפני העלאה
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    // יצירת canvas לדחיסת התמונה
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // הגדרת גודל מקסימלי לתמונה (800px ברוחב)
                    const maxWidth = 800;
                    const maxHeight = 800;
                    let width = img.width;
                    let height = img.height;
                    
                    // חישוב יחס התמונה
                    if (width > height) {
                        if (width > maxWidth) {
                            height = (height * maxWidth) / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width = (width * maxHeight) / height;
                            height = maxHeight;
                        }
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    
                    // ציור התמונה על ה-canvas
                    ctx?.drawImage(img, 0, 0, width, height);
                    
                    // m המרה ל-base64 עם דחיסה (איכות 0.7 = 70%)
                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
                    
                    // בדיקת גודל התמונה המדוחסת
                    const compressedSize = Math.round((compressedBase64.length * 3) / 4);
                    console.log(`Original size: ${file.size} bytes, Compressed size: ${compressedSize} bytes`);
                    
                    setQuestions(prevQuestions =>
                        prevQuestions.map(q =>
                            q.questionId === questionId
                                ? { ...q, img: compressedBase64, imagePreview: compressedBase64 }
                                : q
                        )
                    );
                };
                img.src = e.target?.result as string;
            };
            reader.readAsDataURL(file);
            
            // איפוס ה-input
            event.target.value = '';
        }
    };

    const handleImageDelete = (questionId: number) => {
        setQuestions(prevQuestions =>
            prevQuestions.map(q =>
                q.questionId === questionId
                    ? { ...q, img: null, imagePreview: null }
                    : q
            )
        );
    };

    const handleImageClick = (imageUrl: string) => {
        setSelectedImage(imageUrl);
        setImageDialogOpen(true);
    };

    const handleAuditTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAuditType(parseInt(event.target.value));
    };

    const handleApprovalStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setApprovalStatus(parseInt(event.target.value));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!id) {
            setError('מזהה המבדק חסר');
            return;
        }

        try {
            setSaving(true);
            setError(null);

            const questionsToSend = questions.map(q => ({
                questionId: q.questionId,
                questionText: q.questionText || '',
                answer: q.answer || '',
                img: q.img || '',
                priority: q.priority || 0,
                options: q.options || [],
                answerOptions: q.answerOptions || [],
                questionType: q.questionType || 'רגילה'
            }));

            const updateData = {
                questions: questionsToSend,
                type: auditType,
                approvalStatus: approvalStatus
            };

            console.log("Submitting updated data:", JSON.stringify(updateData, null, 2));

            await put(`/AuditDetail/UpdateAudit/${id}`, updateData);

            setShowSuccess(true);

            setTimeout(() => navigate(-1), 2000);
        } catch (err: any) {
            console.error('Error updating audit:', err);
            console.error('Error response:', err.response);
            console.error('Error data:', err.response?.data);
            setError('שגיאה בעדכון המבדק');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <Typography>טוען...</Typography>;
    }

    if (!audit) {
        return <Typography>לא נמצא מבדק לעריכה</Typography>;
    }

    return (
        <Paper sx={{ p: 3, m: 2 }}>
            <Typography variant="h5" gutterBottom>עריכת מבדק</Typography>
            
            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}
            
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="תאריך המבדק" value={new Date(audit.auditDetail.auditDate).toLocaleDateString()} disabled /></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="סמל משפחתון" value={audit.kindergarten?.code || ''} disabled /></Grid>
                    
                    <Grid item xs={12}>
                        <FormControl 
                            component="fieldset"
                            sx={{ 
                                width: '100%',
                                border: '1px solid rgba(0, 0, 0, 0.23)',
                                borderRadius: 1,
                                padding: 2
                            }}
                        >
                            <FormLabel component="legend" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                                סוג המבדק *
                            </FormLabel>
                            <RadioGroup
                                row
                                name="auditType"
                                value={auditType.toString()}
                                onChange={handleAuditTypeChange}
                            >
                                <FormControlLabel 
                                    value="1" 
                                    control={<Radio />} 
                                    label="מבדק שנתי"
                                />
                                <FormControlLabel 
                                    value="2" 
                                    control={<Radio />} 
                                    label="פתיחת שנה"
                                />
                                <FormControlLabel 
                                    value="3" 
                                    control={<Radio />} 
                                    label="מילוי מקום"
                                />
                            </RadioGroup>
                        </FormControl>
                    </Grid>

                    
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            fullWidth 
                            label="תוקף עד" 
                            value={
                                audit.auditDetail.approvalStatus 
                                    ? new Date(audit.auditDetail.validity).toLocaleDateString('he-IL')
                                    : 'לא רלוונטי'
                            } 
                            disabled 
                            sx={{
                                '& .MuiInputBase-input': {
                                    color: audit.auditDetail.approvalStatus ? 'success.main' : 'text.secondary'
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="ארגון" value={audit.organization?.name || ''} disabled /></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="עיר" value={audit.kindergarten?.city?.name || ''} disabled /></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="רכזת" value={`${audit.hub?.firstName || ''} ${audit.hub?.lastName || ''}`} disabled /></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="מטפלת" value={`${audit.nanny?.firstName || ''} ${audit.nanny?.lastName || ''}`} disabled /></Grid>
                </Grid>

                <Typography variant="h6" sx={{ mt: 3 }}>שאלות המבדק</Typography>
                {questionsError && <Alert severity="error" sx={{ mb: 2 }}>{questionsError}</Alert>}
                
                {questions.length === 0 && !questionsError && (
                    <Typography color="text.secondary">לא נמצאו שאלות למבדק זה</Typography>
                )}
                
                {questions.length > 0 && (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>שאלה</TableCell>
                                <TableCell>קדימות</TableCell>
                                <TableCell>תשובה</TableCell>
                                <TableCell>תמונה</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {questions.map((question) => (
                                <TableRow key={question.questionId}>
                                    <TableCell>{question.questionText || ''}</TableCell>
                                    <TableCell>
                                        <TextField
                                            type="number"
                                            value={question.priority || 0}
                                            onChange={(e) => handlePriorityChange(question.questionId, Number(e.target.value))}
                                            inputProps={{ min: 0, max: 2, step: 1 }}
                                            size="small"
                                            sx={{ width: '80px' }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {question.answerOptions && question.answerOptions.length > 0 ? (
                                            <Select
                                                value={question.answer || ''}
                                                onChange={(e) => handleAnswerChange(question.questionId, e.target.value)}
                                                fullWidth
                                                size="small"
                                                displayEmpty
                                            >
                                                <MenuItem value="" disabled>בחר תשובה</MenuItem>
                                                {question.answerOptions.map((option: any) => (
                                                    <MenuItem key={option.id} value={option.id.toString()}>
                                                        {option.option}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        ) : (
                                            <TextField
                                                value={question.answer}
                                                onChange={(e) => handleAnswerChange(question.questionId, e.target.value)}
                                                fullWidth
                                                size="small"
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexDirection: 'column' }}>
                                            {question.imagePreview && (
                                                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                                                    <img 
                                                        src={question.imagePreview} 
                                                        alt="Preview" 
                                                        style={{ 
                                                            width: '80px', 
                                                            height: '80px', 
                                                            objectFit: 'cover',
                                                            borderRadius: '8px',
                                                            cursor: 'pointer',
                                                            border: '2px solid #4caf50'
                                                        }}
                                                        onClick={() => handleImageClick(question.imagePreview)}
                                                    />
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleImageDelete(question.questionId)}
                                                        sx={{

                                                            position: 'absolute',
                                                            top: -8,
                                                            right: -8,
                                                            backgroundColor: '#f44336',
                                                            color: 'white',
                                                            '&:hover': {
                                                                backgroundColor: '#d32f2f',
                                                            },
                                                            width: 24,
                                                            height: 24
                                                        }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleImageClick(question.imagePreview)}
                                                        sx={{
                                                            position: 'absolute',
                                                            bottom: -8,
                                                            left: -8,
                                                            backgroundColor: 'rgba(33, 150, 243, 0.9)',
                                                            color: 'white',
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(25, 118, 210, 1)',
                                                            },
                                                            width: 24,
                                                            height: 24
                                                        }}
                                                    >
                                                        <ZoomInIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            )}
                                            
                                            {!question.imagePreview && (
                                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                                                    {/* כפתור צילום ישיר */}
                                                    <input
                                                        accept="image/*"
                                                        capture="environment"
                                                        style={{ display: 'none' }}
                                                        id={`camera-capture-${question.questionId}`}
                                                        type="file"
                                                        onChange={(e) => handleImageUpload(question.questionId, e)}
                                                    />
                                                    <label htmlFor={`camera-capture-${question.questionId}`}>
                                                        <IconButton
                                                            color="primary"
                                                            component="span"
                                                            size="small"
                                                            sx={{
                                                                border: '1px solid',
                                                                borderColor: '#2196f3',
                                                                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                                                                '&:hover': {
                                                                    backgroundColor: 'rgba(33, 150, 243, 0.2)',
                                                                }
                                                            }}
                                                        >
                                                            <PhotoCamera />
                                                        </IconButton>
                                                    </label>
                                                    
                                                    {/* כפתור בחירה מהגלריה */}
                                                    <input
                                                        accept="image/*"
                                                        style={{ display: 'none' }}
                                                        id={`gallery-upload-${question.questionId}`}
                                                        type="file"
                                                        onChange={(e) => handleImageUpload(question.questionId, e)}
                                                    />
                                                    <label htmlFor={`gallery-upload-${question.questionId}`}>
                                                        <IconButton
                                                            color="success"
                                                            component="span"
                                                            size="small"
                                                            sx={{
                                                                border: '1px solid',
                                                                borderColor: '#4caf50',
                                                                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                                                '&:hover': {
                                                                    backgroundColor: 'rgba(76, 175, 80, 0.2)',
                                                                }
                                                            }}
                                                        >
                                                            <PhotoCamera />
                                                        </IconButton>
                                                    </label>
                                                </Box>
                                            )}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}

                <Grid item xs={12} sx={{ mt: 2 }}>
                    <FormControl
                        component="fieldset"
                        sx={{
                            width: '100%',
                            border: '1px solid rgba(0, 0, 0, 0.23)',
                            borderRadius: 1,
                            padding: 2
                        }}
                    >
                        <FormLabel component="legend" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                            סטטוס אישור *
                        </FormLabel>
                        <RadioGroup
                            row
                            name="approvalStatus"
                            value={approvalStatus.toString()}
                            onChange={handleApprovalStatusChange}
                        >
                            <FormControlLabel
                                value="1"
                                control={<Radio />}
                                label="ניתן להוציא אישור"
                            />
                            <FormControlLabel
                                value="0"
                                control={<Radio />}
                                label="לא ניתן להוציא אישור"
                            />
                            <FormControlLabel
                                value="2"
                                control={<Radio />}
                                label="סגירת משפחתון במיידי"
                            />
                        </RadioGroup>
                    </FormControl>
                </Grid>

                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary" 
                        disabled={saving}
                    >
                        {saving ? 'שומר...' : 'עדכן'}
                    </Button>
                    
                    <Button 
                        variant="outlined" 
                        onClick={() => navigate(-1)}
                        disabled={saving}
                    >
                        ביטול
                    </Button>
                </Box>
            </form>

            <Dialog 
                open={imageDialogOpen} 
                onClose={() => setImageDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogContent>
                    {selectedImage && (
                        <img 
                            src={selectedImage} 
                            alt="Full size" 
                            style={{ width: '100%', height: 'auto' }} 
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setImageDialogOpen(false)}>סגור</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={showSuccess}
                autoHideDuration={2000}
                onClose={() => setShowSuccess(false)}
            >
                <Alert severity="success">
                    המבדק עודכן בהצלחה
                </Alert>
            </Snackbar>
        </Paper>
    );
};

export default AuditEdit;