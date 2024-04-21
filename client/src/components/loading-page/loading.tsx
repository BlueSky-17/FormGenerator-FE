import React from 'react'
import CircularProgress from '@mui/material/CircularProgress';
import { Box, CardMedia, Typography } from '@mui/material';
import logo from '../../assets/logo.png';
import COLORS from '../../constants/colors';

function LoadingPage() {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100dvh', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ paddingBottom: '20px' }}>
                <CircularProgress sx={{ color: COLORS.darkBlue }} />
            </Box>
            {/* <Typography sx={{ color: COLORS.darkBlue, fontWeight: 'normal', fontSize: '20px' }}>Đang tải trang, vui lòng chờ...</Typography> */}
        </Box>
    )
}

export default LoadingPage
