/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { RadioGroup, FormControlLabel, Radio, TextField, FormControl, Box, IconButton, Tooltip, Button } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Question.css";
import { dateToString } from '../libs/date-utils';
import { compressImage, validateFileSize, validateFileType, formatFileSize } from '../libs/image-utils';


const Question = (props: any) => {

    const { quest, handleAnswerChange, isForSpace, isSubmitting } = props;
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [currentAnswer, setCurrentAnswer] = useState<string>('');
    const [priority, setPriority] = useState<number>(quest.priority || 0);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageData, setImageData] = useState<string>('');
    const [isCompressing, setIsCompressing] = useState<boolean>(false);

    const dateChange = (date: any) => {
        setSelectedDate(date);
        const dateStr = dateToString(date);
        setCurrentAnswer(dateStr);
        answerChange(dateStr, imageData, priority);
    }; 

    const answerChange = (answerValue: any, imgValue: string = imageData, priorityValue: number = priority) => {
        const answer = {
            id: 0,
            auditId: 0,
            questionId: quest.id,
            answer: answerValue,
            img: imgValue,
            priority: priorityValue,
            ...(isForSpace && { spaceIndex: quest.spaceIndex })
        };
        handleAnswerChange(answer);
    }

    const handleAnswerSelection = (value: string) => {
        setCurrentAnswer(value);
        answerChange(value, imageData, priority);
    }

    const handlePriorityChange = (newPriority: number) => {
        setPriority(newPriority);
        answerChange(currentAnswer, imageData, newPriority);
    }

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        
        // בדיקת גודל קובץ
        if (!validateFileSize(file, 5)) {
            alert('גודל התמונה גדול מדי. מקסימום 5MB');
            return;
        }
        
        // בדיקת סוג קובץ
        if (!validateFileType(file)) {
            alert('נא להעלות קובץ תמונה בלבד (JPG, PNG, GIF, WEBP)');
            return;
        }
        
        try {
            setIsCompressing(true);
            
            const result = await compressImage(file, {
                maxWidth: 800,
                maxHeight: 800,
                quality: 0.7
            });
            
            console.log(`✅ דחיסה הושלמה:`);
            console.log(`   גודל מקורי: ${formatFileSize(result.originalSize)}`);
            console.log(`   גודל לאחר דחיסה: ${formatFileSize(result.compressedSize)}`);
            console.log(`   חיסכון: ${result.savingPercent}%`);
            
            setImagePreview(result.compressedImage);
            setImageData(result.compressedImage);
            
            // עדכון התשובה עם התמונה
            answerChange(currentAnswer, result.compressedImage, priority);
            
        } catch (error) {
            console.error('❌ שגיאה בדחיסת התמונה:', error);
            alert('שגיאה בעיבוד התמונה. נסה שוב.');
        } finally {
            setIsCompressing(false);
            // איפוס ה-input כדי לאפשר העלאה של אותה תמונה שוב
            event.target.value = '';
        }
    };

    const handleImageDelete = () => {
        setImagePreview(null);
        setImageData('');
        
        // עדכון התשובה ללא תמונה
        answerChange(currentAnswer, '', priority);
    };

    return (
        <Box sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1, bgcolor: 'background.paper' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <p style={{ fontWeight: 'bold', margin: 0 }}>{quest.question}</p>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span style={{ fontSize: '0.875rem', color: '#666' }}>קדימות:</span>
                    <TextField
                        type="number"
                        value={priority}
                        onChange={(e) => handlePriorityChange(Number(e.target.value))}
                        inputProps={{ min: 0, max: 2, step: 1 }}
                        size="small"
                        disabled={isSubmitting}
                        sx={{ width: '70px' }}
                    />
                </Box>
            </Box>

            {quest.type?.trim() === 'multiple-choice' && (
                <FormControl component="fieldset" fullWidth disabled={isSubmitting}>
                    <RadioGroup
                        name={`answer-${quest.id}`}
                        onChange={(e) => handleAnswerSelection(e.target.value)}
                        aria-label="Select an option"
                    >
                        {quest.options?.map((opt: any) => (
                            <FormControlLabel 
                                key={opt.id} 
                                value={opt.id} 
                                control={<Radio />} 
                                label={opt.option}
                                sx={{ mb: 0.5 }}
                            />
                        ))}
                    </RadioGroup>
                </FormControl>
            )}

            {quest.type?.trim() === 'date' && (
                // react-datepicker types can be strict in some build setups; cast props to any to avoid mismatches
                <DatePicker
                    selected={selectedDate as any}
                    onChange={(date: any) => dateChange(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="בחר תאריך"
                    className="date-picker-custom"
                    disabled={isSubmitting}
                />
            )}

            {quest.type?.trim() === 'text' && (
                <TextField
                    name={`text-answer-${quest.id}`}
                    label="תשובה"
                    onChange={(e) => handleAnswerSelection(e.target.value)}
                    variant="outlined"
                    fullWidth
                    size="small"
                    disabled={isSubmitting}
                />
            )}

            {/* הוספת תמונה */}
            <Box sx={{ mt: 2 }}>
                {imagePreview && (
                    <Box sx={{ mb: 2, position: 'relative', display: 'inline-block' }}>
                        <img 
                            src={imagePreview} 
                            alt="תצוגה מקדימה" 
                            style={{ 
                                width: '150px', 
                                height: '150px', 
                                objectFit: 'cover',
                                borderRadius: '8px',
                                border: '3px solid #4caf50',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                            }} 
                        />
                        <Tooltip title="מחק תמונה">
                            <IconButton
                                size="small"
                                onClick={handleImageDelete}
                                sx={{
                                    position: 'absolute',
                                    top: -8,
                                    right: -8,
                                    backgroundColor: '#f44336',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: '#d32f2f',
                                    },
                                    width: 28,
                                    height: 28,
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                                }}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                )}
                
                {!imagePreview && (
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {/* כפתור צילום ישיר (טלפון/טאבלט) */}
                        <input
                            accept="image/*"
                            capture="environment"
                            style={{ display: 'none' }}
                            id={`camera-capture-${quest.id}-${isForSpace ? quest.spaceIndex : 'regular'}`}
                            type="file"
                            onChange={handleImageUpload}
                            disabled={isCompressing || isSubmitting}
                        />
                        <label htmlFor={`camera-capture-${quest.id}-${isForSpace ? quest.spaceIndex : 'regular'}`}>
                            <Button
                                variant="contained"
                                component="span"
                                disabled={isCompressing || isSubmitting}
                                startIcon={<CameraAltIcon />}
                                sx={{
                                    backgroundColor: '#2196f3',
                                    '&:hover': {
                                        backgroundColor: '#1976d2',
                                    },
                                    textTransform: 'none',
                                    fontWeight: 'bold'
                                }}
                            >
                                צלם תמונה
                            </Button>
                        </label>

                        {/* כפתור בחירה מהגלריה */}
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id={`gallery-upload-${quest.id}-${isForSpace ? quest.spaceIndex : 'regular'}`}
                            type="file"
                            onChange={handleImageUpload}
                            disabled={isCompressing || isSubmitting}
                        />
                        <label htmlFor={`gallery-upload-${quest.id}-${isForSpace ? quest.spaceIndex : 'regular'}`}>
                            <Button
                                variant="outlined"
                                component="span"
                                disabled={isCompressing || isSubmitting}
                                startIcon={<AddPhotoAlternateIcon />}
                                sx={{
                                    borderColor: '#4caf50',
                                    color: '#4caf50',
                                    '&:hover': {
                                        borderColor: '#388e3c',
                                        backgroundColor: 'rgba(76, 175, 80, 0.04)',
                                    },
                                    textTransform: 'none',
                                    fontWeight: 'bold'
                                }}
                            >
                                בחר מהגלריה
                            </Button>
                        </label>
                    </Box>
                )}

                {/* אינדיקטור עיבוד */}
                {isCompressing && (
                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                            sx={{
                                width: 20,
                                height: 20,
                                border: '3px solid #ff9800',
                                borderTop: '3px solid transparent',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite',
                                '@keyframes spin': {
                                    '0%': { transform: 'rotate(0deg)' },
                                    '100%': { transform: 'rotate(360deg)' }
                                }
                            }}
                        />
                        <span style={{ 
                            fontSize: '0.875rem', 
                            color: '#ff9800',
                            fontWeight: 'bold'
                        }}>
                            מעבד תמונה...
                        </span>
                    </Box>
                )}

                {/* הצלחה */}
                {imagePreview && !isCompressing && (
                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span style={{ 
                            fontSize: '0.875rem', 
                            color: '#4caf50',
                            fontWeight: 'bold'
                        }}>
                            ✓ תמונה צורפה בהצלחה
                        </span>
                    </Box>
                )}
            </Box>
        </Box>
    );
};


export default Question;
