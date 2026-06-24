import React, { useState } from 'react';
import { TextField, Button, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { post } from '../libs/rest-service';

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await post('/login', {
                UserId: username,
                Password: password
            });

            if (response) {
                // שמירת נתונים ב-localStorage
                localStorage.setItem('token', response.token);
                localStorage.setItem('userType', response.userType);
                localStorage.setItem('userId', response.userId);
                
                // שמירת kindAuth אם זה משתמש רגיל
                if (response.kindAuth !== undefined && response.kindAuth !== null) {
                    localStorage.setItem('kindAuth', response.kindAuth.toString());
                }
                
                // ניתוב לפי סוג המשתמש
                if (response.userType === 'Counselor') {
                    // יועצים - מסך ניהול יועצים
                    navigate('/consultantMenuForm');
                } else {
                    // משתמשים - בדיקת KIND_AUTH
                    if (response.kindAuth === 1) {
                        // מנהל - מסך ניהול מנהל
                        navigate('/admin-management');
                    } else if (response.kindAuth === 2) {
                        // מזכירות - מסך ניהול מזכירות
                        navigate('/secretary-management');
                    } else {
                        // ברירת מחדל - מסך ניהול משתמשים
                        navigate('/user-reports');
                    }
                }
            }
        } catch (error: any) {
            console.error('Login error:', error);
            console.error('Error response:', error.response);
            console.error('Error message:', error.message);
            
            // טיפול בשגיאות שונות
            if (error.response) {
                if (error.response.status === 401) {
                    setError('סיסמה שגויה');
                } else if (error.response.status === 404) {
                    setError('המשתמש לא נמצא במערכת');
                } else if (error.response.status === 500) {
                    const errorMsg = error.response.data?.message || error.response.data?.error || 'שגיאה כללית בשרת';
                    setError(`שגיאה בשרת: ${errorMsg}`);
                } else {
                    setError('שגיאה בהתחברות, נסה שוב');
                }
            } else {
                setError('שגיאה בחיבור אל השרת');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <Alert severity="error" style={{ marginBottom: '1rem' }}>{error}</Alert>}
            
            <TextField
                label="שם משתמש"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                required
                margin="normal"
            />
            <TextField
                label="סיסמה"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
                margin="normal"
            />
            <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                disabled={loading}
                fullWidth
                style={{ marginTop: '1rem' }}
            >
                {loading ? 'מתחבר...' : 'התחבר'}
            </Button>
        </form>
    );
};

export default Login;
