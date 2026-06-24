/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { 
    Table, TableHead, TableRow, TableCell, TableBody, Paper, Typography, 
    Box, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent,
    TextField, Button, IconButton, Chip, TableContainer, useMediaQuery, useTheme,
    Card, CardContent, Grid, Stack
} from '@mui/material';
import { PictureAsPdf as PdfIcon } from '@mui/icons-material';
import { get } from '../libs/rest-service';
import { useNavigate } from 'react-router-dom';

interface FilterOptions {
    organizations: Array<{ id: string; name: string }> ;
    cities: Array<{ cityCode: number; name: string }> ;
    hubs: Array<{ id: string; firstName: string; lastName: string }> ;
    nannies: Array<{ id: string; firstName: string; lastName: string }> ;
}

const AuditTable: React.FC<any> = (props: any) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    
    const [audits, setAudits] = useState<any[]>([] );
    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        organizations: [] ,
        cities: [] ,
        hubs: [] ,
        nannies: [] 
    });
    
    const [filters, setFilters] = useState({
        organizationId: '' ,
        cityCode: '' ,
        hubId: '' ,
        nannyId: '' ,
        fromDate: '' ,
        toDate: '' ,
        searchText: '' ,
        approvalStatus: ''
    });
    
    const navigate = useNavigate();

    useEffect(() => {
        const loadFilterOptions = async () => {
            try {
                const [orgs, cities, hubs, nannies] = await Promise.all([
                    get('/Organization/GetOrganizations'),
                    get('/Cities/GetCities'),
                    get('/Hub/GetHubs'),
                    get('/Nanny/GetNannies')
                ]);

                setFilterOptions({
                    organizations: orgs || [],
                    cities: cities || [],
                    hubs: hubs || [],
                    nannies: nannies || []
                });
            } catch (error) {
                console.error('Error loading filter options:', error);
            }
        };

        loadFilterOptions();
    }, []);

    useEffect(() => {
        loadAudits();
    }, [props.counselorId, filters]);

    const loadAudits = async () => {
        try {
            const params = new URLSearchParams();
            if (props.counselorId) params.append('counselorId', props.counselorId);
            if (filters.organizationId) params.append('organizationId', filters.organizationId);
            if (filters.cityCode) params.append('cityCode', filters.cityCode);
            if (filters.hubId) params.append('hubId', filters.hubId);
            if (filters.nannyId) params.append('nannyId', filters.nannyId);
            if (filters.fromDate) params.append('fromDate', filters.fromDate);
            if (filters.toDate) params.append('toDate', filters.toDate);
            if (filters.searchText) params.append('searchText', filters.searchText);
            if (filters.approvalStatus !== '') params.append('approvalStatus', filters.approvalStatus);

            const data = await get(`/auditDetail/GetAuditDetailsWithFilters?${params.toString()}`);
            console.log('Audits data:', data);
            setAudits(data || []);
        } catch (error) {
            console.error('Error fetching audits:', error);
            setAudits([]);
        }
    };

    const handleFilterChange = (field: keyof typeof filters) => (
        event: any
    ) => {
        setFilters(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const handleClearFilters = () => {
        setFilters({
            organizationId: '' ,
            cityCode: '' ,
            hubId: '' ,
            nannyId: '' ,
            fromDate: '' ,
            toDate: '' ,
            searchText: '' ,
            approvalStatus: ''
        });
    };

    const handleDoubleClick = (audit: any) => {
        navigate(`/audit-edit/${audit.auditDetail.id}`, { state: { audit } });
    };

    const handlePrintCertificate = (audit: any) => {
        window.open(`/certificate/${audit.auditDetail.id}`, '_blank');
    };

    const safeCellContent = (value: any): string => {
        if (value === null || value === undefined) return '';
        if (typeof value === 'string' || typeof value === 'number') return String(value);
        return '';
    };

    const formatDate = (date: any): string => {
        if (!date) return '';
        try {
            return new Date(date).toLocaleDateString('he-IL');
        } catch {
            return '';
        }
    };

    const approvedCount = audits.filter(a => a?.auditDetail?.approvalStatus === 1).length;
    const notApprovedCount = audits.filter(a => a?.auditDetail?.approvalStatus === 0).length;
    const closedCount = audits.filter(a => a?.auditDetail?.approvalStatus === 2).length;

    // תצוגת כרטיסים למובייל
    const renderMobileCard = (audit: any, index: number) => (
        <Card 
            key={index}
            sx={{ 
                mb: 2,
                cursor: 'pointer',
                '&:hover': {
                    boxShadow: 3
                }
            }}
            onClick={() => handleDoubleClick(audit)}
        >
            <CardContent>
                <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            {formatDate(audit?.auditDetail?.auditDate)}
                        </Typography>
                        <Chip 
                            label={
                                audit?.auditDetail?.approvalStatus === 1 ? 'מאושר' :
                                audit?.auditDetail?.approvalStatus === 2 ? 'סגירת משפחתון' :
                                'לא מאושר'
                            }
                            color={
                                audit?.auditDetail?.approvalStatus === 1 ? 'success' :
                                audit?.auditDetail?.approvalStatus === 2 ? 'warning' :
                                'error'
                            }
                            size="small"
                        />
                    </Box>
                    
                    <Typography variant="body2">
                        <strong>סוג מבדק:</strong> {
                            audit?.auditDetail?.type === 1 ? 'מבדק שנתי' : 
                            audit?.auditDetail?.type === 2 ? 'פתיחת שנה' : 
                            audit?.auditDetail?.type === 3 ? 'מילוי מקום' : 
                            'לא צוין'
                        }
                    </Typography>
                    
                    {audit?.auditDetail?.approvalStatus === 1 && (
                        <Typography variant="body2" sx={{ color: 'success.main' }}>
                            <strong>תוקף עד:</strong> {formatDate(audit?.auditDetail?.validity)}
                        </Typography>
                    )}
                    
                    <Typography variant="body2">
                        <strong>מטפלת:</strong> {`${safeCellContent(audit?.nanny?.firstName)} ${safeCellContent(audit?.nanny?.lastName)}`.trim()}
                    </Typography>
                    
                    <Typography variant="body2">
                        <strong>ת"ז:</strong> {safeCellContent(audit?.nanny?.id)}
                    </Typography>
                    
                    <Typography variant="body2">
                        <strong>רכזת:</strong> {`${safeCellContent(audit?.hub?.firstName)} ${safeCellContent(audit?.hub?.lastName)}`.trim()}
                    </Typography>
                    
                    <Typography variant="body2">
                        <strong>עיר:</strong> {safeCellContent(audit?.kindergarten?.city?.name)}
                    </Typography>
                    
                    <Typography variant="body2">
                        <strong>ארגון:</strong> {safeCellContent(audit?.organization?.name)}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                        <IconButton
                            color="primary"
                            onClick={(e) => {
                                e.stopPropagation();
                                handlePrintCertificate(audit);
                            }}
                            disabled={audit?.auditDetail?.approvalStatus !== 1}
                            size="small"
                        >
                            <PdfIcon />
                        </IconButton>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );

    return (
        <Paper 
            sx={{ 
                p: { xs: 1, sm: 2 },
                width: '100%',
                overflow: 'hidden'
            }}
        >
            <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between', 
                alignItems: { xs: 'flex-start', sm: 'center' },
                mb: 2,
                gap: 2
            }}>
                <Typography 
                    variant="h5"
                    sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
                >
                    המבדקים שלי
                </Typography>
                <Box sx={{ 
                    display: 'flex', 
                    gap: { xs: 1, sm: 2 },
                    flexWrap: 'wrap'
                }}>
                    <Chip 
                        label={`מאושרים: ${approvedCount}`} 
                        color="success" 
                        variant={filters.approvalStatus === '1' ? 'filled' : 'outlined'}
                        size={isMobile ? 'small' : 'medium'}
                    />
                    <Chip 
                        label={`לא מאושרים: ${notApprovedCount}`} 
                        color="error" 
                        variant={filters.approvalStatus === '0' ? 'filled' : 'outlined'}
                        size={isMobile ? 'small' : 'medium'}
                    />
                    <Chip 
                        label={`סגירת משפחתון: ${closedCount}`} 
                        color="warning" 
                        variant={filters.approvalStatus === '2' ? 'filled' : 'outlined'}
                        size={isMobile ? 'small' : 'medium'}
                    />
                    <Chip 
                        label={`סה"כ: ${audits.length}`} 
                        color="primary" 
                        variant="outlined"
                        size={isMobile ? 'small' : 'medium'}
                    />
                </Box>
            </Box>
            
            {/* מסננים */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6} md={4} lg={2.4}>
                    <FormControl fullWidth size={isMobile ? 'small' : 'medium'}>
                        <InputLabel>בחר מפעיל</InputLabel>
                        <Select
                            value={filters.organizationId}
                            label="בחר מפעיל"
                            onChange={handleFilterChange('organizationId')}
                        >
                            <MenuItem value="">
                                <em>הכל</em>
                            </MenuItem>
                            {filterOptions.organizations.map((org) => (
                                <MenuItem key={org.id} value={org.id}>
                                    {org.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={2.4}>
                    <FormControl fullWidth size={isMobile ? 'small' : 'medium'}>
                        <InputLabel>בחר עיר</InputLabel>
                        <Select
                            value={filters.cityCode}
                            label="בחר עיר"
                            onChange={handleFilterChange('cityCode')}
                        >
                            <MenuItem value="">
                                <em>הכל</em>
                            </MenuItem>
                            {filterOptions.cities.map((city) => (
                                <MenuItem key={city.cityCode} value={city.cityCode.toString()}>
                                    {city.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={2.4}>
                    <FormControl fullWidth size={isMobile ? 'small' : 'medium'}>
                        <InputLabel>בחר רכזת</InputLabel>
                        <Select
                            value={filters.hubId}
                            label="בחר רכזת"
                            onChange={handleFilterChange('hubId')}
                        >
                            <MenuItem value="">
                                <em>הכל</em>
                            </MenuItem>
                            {filterOptions.hubs.map((hub) => (
                                <MenuItem key={hub.id} value={hub.id}>
                                    {`${hub.firstName} ${hub.lastName}`}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={2.4}>
                    <FormControl fullWidth size={isMobile ? 'small' : 'medium'}>
                        <InputLabel>בחר מטפלת</InputLabel>
                        <Select
                            value={filters.nannyId}
                            label="בחר מטפלת"
                            onChange={handleFilterChange('nannyId')}
                        >
                            <MenuItem value="">
                                <em>הכל</em>
                            </MenuItem>
                            {filterOptions.nannies.map((nanny) => (
                                <MenuItem key={nanny.id} value={nanny.id}>
                                    {`${nanny.firstName} ${nanny.lastName}`}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={2.4}>
                    <FormControl fullWidth size={isMobile ? 'small' : 'medium'}>
                        <InputLabel>סטטוס אישור</InputLabel>
                        <Select
                            value={filters.approvalStatus}
                            label="סטטוס אישור"
                            onChange={handleFilterChange('approvalStatus')}
                        >
                            <MenuItem value="">
                                <em>הכל</em>
                            </MenuItem>
                            <MenuItem value="1">מאושר</MenuItem>
                            <MenuItem value="0">לא מאושר</MenuItem>
                            <MenuItem value="2">סגירת משפחתון</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        label="מתאריך"
                        type="date"
                        value={filters.fromDate}
                        onChange={handleFilterChange('fromDate')}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        size={isMobile ? 'small' : 'medium'}
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        label="עד תאריך"
                        type="date"
                        value={filters.toDate}
                        onChange={handleFilterChange('toDate')}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        size={isMobile ? 'small' : 'medium'}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <TextField
                        label="חיפוש לפי שם או ת&quot;ז"
                        value={filters.searchText}
                        onChange={handleFilterChange('searchText')}
                        placeholder="הקלד שם או מספר תעודת זהות"
                        fullWidth
                        size={isMobile ? 'small' : 'medium'}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Button 
                        variant="outlined" 
                        onClick={handleClearFilters}
                        fullWidth={isMobile}
                        size={isMobile ? 'small' : 'medium'}
                    >
                        נקה מסננים
                    </Button>
                </Grid>
            </Grid>

            {/* תצוגת טבלה/כרטיסים */}
            {isMobile ? (
                // תצוגת כרטיסים למובייל
                <Box>
                    {(audits || []).map((audit, index) => renderMobileCard(audit, index))}
                </Box>
            ) : (
                // תצוגת טבלה למסכים גדולים
                <TableContainer sx={{ overflowX: 'auto' }}>
                    <Table size={isTablet ? 'small' : 'medium'}>
                        <TableHead>
                            <TableRow>
                                <TableCell>תאריך המבדק</TableCell>
                                <TableCell>סוג המבדק</TableCell>
                                <TableCell>תוקף עד</TableCell>
                                <TableCell>סמל משפחתון</TableCell>
                                <TableCell>ארגון</TableCell>
                                <TableCell>עיר</TableCell>
                                <TableCell>רכזת</TableCell>
                                <TableCell>מטפלת</TableCell>
                                <TableCell>ת&quot;ז מטפלת</TableCell>
                                <TableCell>סטטוס</TableCell>
                                <TableCell>פעולות</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(audits || []).map((audit, index) => (
                                <TableRow 
                                    key={index}
                                    onDoubleClick={() => handleDoubleClick(audit)}
                                    sx={{ 
                                        cursor: 'pointer',
                                        '&:hover': {
                                            backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                        }
                                    }}
                                >
                                    <TableCell>{formatDate(audit?.auditDetail?.auditDate)}</TableCell>
                                    <TableCell>
                                        {audit?.auditDetail?.type === 1 ? 'מבדק שנתי' : 
                                         audit?.auditDetail?.type === 2 ? 'פתיחת שנה' : 
                                         audit?.auditDetail?.type === 3 ? 'מילוי מקום' : 
                                         'לא צוין'}
                                    </TableCell>
                                    <TableCell>
                                        {audit?.auditDetail?.approvalStatus === 1 ? formatDate(audit?.auditDetail?.validity) : '-'}
                                    </TableCell>
                                    <TableCell>{safeCellContent(audit?.kindergarten?.code)}</TableCell>
                                    <TableCell>{safeCellContent(audit?.organization?.name)}</TableCell>
                                    <TableCell>{safeCellContent(audit?.kindergarten?.city?.name)}</TableCell>
                                    <TableCell>
                                        {`${safeCellContent(audit?.hub?.firstName)} ${safeCellContent(audit?.hub?.lastName)}`.trim()}
                                    </TableCell>
                                    <TableCell>
                                        {`${safeCellContent(audit?.nanny?.firstName)} ${safeCellContent(audit?.nanny?.lastName)}`.trim()}
                                    </TableCell>
                                    <TableCell>{safeCellContent(audit?.nanny?.id)}</TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={
                                                audit?.auditDetail?.approvalStatus === 1 ? 'מאושר' :
                                                audit?.auditDetail?.approvalStatus === 2 ? 'סגירת משפחתון' :
                                                'לא מאושר'
                                            }
                                            color={
                                                audit?.auditDetail?.approvalStatus === 1 ? 'success' :
                                                audit?.auditDetail?.approvalStatus === 2 ? 'warning' :
                                                'error'
                                            }
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            color="primary"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handlePrintCertificate(audit);
                                            }}
                                            title="הדפס אישור"
                                            disabled={audit?.auditDetail?.approvalStatus !== 1}
                                            size="small"
                                        >
                                            <PdfIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {audits.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="text.secondary">
                        לא נמצאו מבדקים לפי הקריטריונים שנבחרו
                    </Typography>
                </Box>
            )}
        </Paper>
    );
};

export default AuditTable;
