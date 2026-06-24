import { useEffect, useState } from 'react';
import { Box, TextField, Button, Stack, Grid } from '@mui/material';
import { post } from '../libs/rest-service';

const Adress = (props: any) => {
    const { street, homeNum, floor, city, kinderCode } = props;
    const [updateMode, setUpdateMode] = useState(false);
    const [adress, setAddress] = useState({ street, homeNum, floor, city });

    useEffect(() => {
        setAddress({
            street: props.street,
            homeNum: props.homeNum,
            floor: props.floor,
            city: props.city
        })
    }, [street, homeNum, floor, city]);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setAddress({ ...adress, [name]: value });
    };

    const onClickButton = async () => {
        if (updateMode) {
            const newAdress = {
                street: adress.street,
                homeNum: adress.homeNum,
                floor: adress.floor,
                cityCode: adress.city.id,
                kinderCode
            } as any;
            post("/Save/SaveAdress", newAdress);
        }
        try {
            await setUpdateMode(!updateMode);
        } catch (error) {
            console.error("Error saving data:", error);
            alert('Failed to save data');
        }
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Stack spacing={2}>
                {!updateMode ? (
                    <TextField
                        label="כתובת"
                        name="street"
                        value={adress.street + " " + adress.homeNum}
                        fullWidth
                        disabled
                        sx={{ m: 0 }}
                    />
                ) : (
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={8}>
                            <TextField
                                label="רחוב"
                                name="street"
                                value={adress.street}
                                onChange={handleChange}
                                fullWidth
                                sx={{ m: 0 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="מספר בית"
                                name="homeNum"
                                value={adress.homeNum}
                                onChange={handleChange}
                                fullWidth
                                sx={{ m: 0 }}
                            />
                        </Grid>
                    </Grid>
                )}
                
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={8}>
                        <TextField
                            label="עיר"
                            name="city"
                            onChange={handleChange}
                            value={adress.city.name}
                            fullWidth
                            disabled
                            sx={{ m: 0 }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="קומה"
                            name="floor"
                            onChange={handleChange}
                            value={adress.floor}
                            fullWidth
                            disabled={!updateMode}
                            sx={{ m: 0 }}
                        />
                    </Grid>
                </Grid>

                <Button 
                    variant="outlined" 
                    onClick={onClickButton}
                    fullWidth
                    sx={{ 
                        mt: 1,
                        py: { xs: 1.5, sm: 1 }
                    }}
                >
                    {!updateMode ? "עדכון כתובת" : "אישור"}
                </Button>
            </Stack>
        </Box>
    );
};

export default Adress;
