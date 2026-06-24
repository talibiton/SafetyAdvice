import React, { useEffect, useState } from 'react';
import { TextField, Button, Container, Typography, Select, MenuItem, Box, Stack } from '@mui/material';
import { post, get } from '../libs/rest-service';
import QuestionList from './QuestionList';
import { HubModel } from '../models/Models';
import Adress from './Adress';
import { useNavigate } from 'react-router-dom';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import axios from 'axios';


const AuditForm: React.FC<any> = (props: any) => {
    const navigate = useNavigate();
    const [hubs, setHubs] = useState([] as any[]);
    const [nannies, setNannies] = useState([]);
    const [approvalValue, setApprovalValue] = useState<number | null>(null);
    const [currentDate, setCurrentDate] = useState<string>('');
    const [auditType, setAuditType] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [formData, setFormData] = useState({
        hubId: '',
        hubEmail:'',
        nanny: { id: '', phone: '', email: '' },
        auditData: [],
        questionsForSpaceAuditData: [],
        kinder: { street: '', homeNum: '', floor: '', city: { name: '' }, code: '' },
        approvalStatus: 0,
        type: 0,
    });

    useEffect(() => {
        get("/hub/GetHubByOrganization/" + props.organizationId)
            .then((data) => setHubs(data));
        
        // עדכון התאריך הנוכחי
        const today = new Date();
        const formattedDate = today.toLocaleDateString('he-IL', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
        setCurrentDate(formattedDate);
    }, [props.organizationId]);

    const handleAnswerChange = (e: any) => {
        setFormData({ ...formData, auditData: e })
    }

    const handleAnswerForSpaceChange = (e: any) => {
        setFormData({ ...formData, questionsForSpaceAuditData: e })
    }

    const onSelectedHub = (e: any) => {
        const selectedId = e.target.value;
        const selectedHub = hubs.find((s: HubModel) => s.id == selectedId);
        const nanniesForHub = hubs?.find((s: HubModel) => s.id == selectedId)?.kindergartens.map((s: any) => s.nanny)
        setNannies(nanniesForHub ? nanniesForHub : []);
        setFormData({ ...formData, hubId: selectedId, hubEmail: selectedHub.email })
    }

    const onSelectedNanny = (e: any) => {
        const selectedId = e.target.value;

        const kindersForHub = hubs.find((s: any) => s.id == formData.hubId)?.kindergartens;
        const kinder = kindersForHub?.find((s: any) => s.nanny.id == selectedId);
        setFormData({
            ...formData,
            nanny: kinder.nanny,
            kinder: kinder,
        });
    }

    const handleApprovalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setApprovalValue(value);
        setFormData(prev => ({
            ...prev,
            approvalStatus: value
        }));
    };

    const handleAuditTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setAuditType(value);
        
        // המרה של הערך הטקסטואלי למספר
        let typeNumber = 0;
        if (value === 'מבדק שנתי') typeNumber = 1;
        else if (value === 'פתיחת שנה') typeNumber = 2;
        else if (value === 'מילוי מקום') typeNumber = 3;
        
        setFormData(prev => ({
            ...prev,
            type: typeNumber
        }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        
        // בדיקה שנבחר סוג מבדק
        if (!auditType) {
            alert('נא לבחור סוג מבדק');
            return;
        }

        // בדיקה שנבחר סטטוס אישור
        if (approvalValue === null) {
            alert('נא לבחור סטטוס אישור');
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            console.log("Payload being sent to server:", JSON.stringify(formData, null, 2));

            await post("/Save/Save", formData);
            alert('המבדק נשמר בהצלחה!');
            navigate(-1);

        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Axios error:', error.message);
                console.error('Status:', error.response?.status);
                console.error('Response:', error.response?.data);
            } else { 
                console.error('Unknown error:', error); 
            }

            alert('שגיאה בשמירת המבדק. נסה שוב.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container 
            maxWidth="md"
            sx={{
                px: { xs: 1, sm: 2, md: 3 },
                py: { xs: 2, sm: 3 }
            }}
        >
            <Typography 
                variant="h4" 
                gutterBottom
                sx={{
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
                    textAlign: 'center',
                    mb: { xs: 2, sm: 3 }
                }}
            >
                מבדק
            </Typography>
            
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    width: '100%',
                    '& .MuiTextField-root': {
                        width: '100%'
                    },
                    '& .MuiSelect-root': {
                        width: '100%'
                    }
                }}
            >
                <Stack spacing={{ xs: 2, sm: 2.5 }}>
                    <TextField
                        label="תאריך"
                        name="auditDate"
                        value={currentDate}
                        fullWidth
                        disabled
                        margin="normal"
                        sx={{ m: 0 }}
                    />

                    <FormControl 
                        component="fieldset"
                        sx={{ 
                            mt: 2,
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
                            name="auditType"
                            value={auditType}
                            onChange={handleAuditTypeChange}
                        >
                            <FormControlLabel 
                                value="מבדק שנתי" 
                                control={<Radio />} 
                                label="מבדק שנתי"
                                disabled={isSubmitting}
                                sx={{
                                    '& .MuiFormControlLabel-label': {
                                        fontSize: { xs: '0.875rem', sm: '1rem' }
                                    }
                                }}
                            />
                            <FormControlLabel 
                                value="פתיחת שנה" 
                                control={<Radio />} 
                                label="פתיחת שנה"
                                disabled={isSubmitting}
                                sx={{
                                    '& .MuiFormControlLabel-label': {
                                        fontSize: { xs: '0.875rem', sm: '1rem' }
                                    }
                                }}
                            />
                            <FormControlLabel 
                                value="מילוי מקום" 
                                control={<Radio />} 
                                label="מילוי מקום"
                                disabled={isSubmitting}
                                sx={{
                                    '& .MuiFormControlLabel-label': {
                                        fontSize: { xs: '0.875rem', sm: '1rem' }
                                    }
                                }}
                            />
                        </RadioGroup>
                    </FormControl>

                    <FormControl fullWidth>
                        <Select
                            name="hubId"
                            value={formData.hubId}
                            displayEmpty
                            onChange={onSelectedHub}
                            disabled={isSubmitting}
                            sx={{ textAlign: 'right' }}
                        >
                            <MenuItem value="" disabled>
                                בחר רכזת
                            </MenuItem>
                            {hubs?.map((option: any) => (
                                <MenuItem key={option.id} value={option.id}>
                                    {option.firstName + " " + option.lastName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <Select
                            name="nannyId"
                            value={formData.nanny.id}
                            displayEmpty
                            onChange={onSelectedNanny}
                            disabled={isSubmitting}
                            sx={{ textAlign: 'right' }}
                        >
                            <MenuItem value="" disabled>
                                בחר מטפלת
                            </MenuItem>
                            {nannies?.map((option: any) => (
                                <MenuItem key={option.id} value={option.id}>
                                    {option.firstName + " " + option.lastName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="תז מטפלת"
                        name="nannyId"
                        value={formData.nanny.id}
                        fullWidth
                        disabled
                        sx={{ m: 0 }}
                    />
                    
                    <TextField
                        label="טלפון"
                        name="phone"
                        value={formData.nanny.phone}
                        fullWidth
                        disabled
                        sx={{ m: 0 }}
                    />
                    
                    <TextField
                        label="מייל"
                        name="email"
                        type="email"
                        value={formData.nanny.email}
                        fullWidth
                        disabled
                        sx={{ m: 0 }}
                    />

                    <TextField
                        label="סמל משפחתון"
                        name="kinderCode"
                        value={formData.kinder.code}
                        fullWidth
                        disabled
                        sx={{ m: 0 }}
                    />

                    <Adress 
                        street={formData.kinder.street}
                        homeNum={formData.kinder.homeNum}
                        floor={formData.kinder.floor}
                        city={formData.kinder.city}
                        kinderCode={formData.kinder.code} 
                    />

                   
                    <QuestionList 
                        handleAnswerChange={handleAnswerChange} 
                        handleAnswerForSpaceChange={handleAnswerForSpaceChange}
                        isSubmitting={isSubmitting}
                    />

                    <FormControl 
                        component="fieldset"
                        sx={{ 
                            mt: 2,
                            width: '100%',
                            border: '1px solid rgba(0, 0, 0, 0.23)',
                            borderRadius: 1,
                            padding: 2
                        }}
                    >
                        <FormLabel component="legend" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                            אישור *
                        </FormLabel>
                        <RadioGroup
                            name="approvalStatus"
                            value={approvalValue !== null ? approvalValue.toString() : ''}
                            onChange={handleApprovalChange}
                        >
                            <FormControlLabel 
                                value="1" 
                                control={<Radio />} 
                                label="ניתן להוציא אישור"
                                disabled={isSubmitting}
                                sx={{
                                    '& .MuiFormControlLabel-label': {
                                        fontSize: { xs: '0.875rem', sm: '1rem' }
                                    }
                                }}
                            />
                            <FormControlLabel 
                                value="0" 
                                control={<Radio />} 
                                label="לא ניתן להוציא אישור"
                                disabled={isSubmitting}
                                sx={{
                                    '& .MuiFormControlLabel-label': {
                                        fontSize: { xs: '0.875rem', sm: '1rem' }
                                    }
                                }}
                            />
                            <FormControlLabel
                                value="2"
                                control={<Radio />}
                                label="סגירת משפחתון במיידי"
                                disabled={isSubmitting}
                                sx={{
                                    '& .MuiFormControlLabel-label': {
                                        fontSize: { xs: '0.875rem', sm: '1rem' }
                                    }
                                }}
                            />
                        </RadioGroup>
                    </FormControl>

                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary" 
                        fullWidth
                        disabled={isSubmitting}
                        sx={{ 
                            mt: 2,
                            py: { xs: 1.5, sm: 1.75 },
                            fontSize: { xs: '0.875rem', sm: '1rem' }
                        }}
                    >
                        {isSubmitting ? 'שומר...' : 'שמירה'}
                    </Button>
                </Stack>
            </Box>
        </Container>
    );
};

export default AuditForm;
