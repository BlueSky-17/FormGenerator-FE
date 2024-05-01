import { Box, Card, CardMedia, Typography } from '@mui/material'
import React from 'react'
import logo from '../../assets/logo.png';
import COLORS from '../../constants/colors';
import AcceptButton from '../custom-button/acceptButton';
import { useNavigate } from 'react-router-dom';

function Error404() {
    const navigate: any = useNavigate();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', height: '100dvh' }}>
            <Box sx={{ display: 'flex', background: '#000000', width: '50%', height: 'full', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <CardMedia
                    component="img"
                    image={logo}
                    alt="green iguana"
                    sx={{
                        transform: 'scale(0.5, 0.5)'
                    }}
                />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', background: 'white', width: '50%', justifyContent: 'center', alignItems: 'center' }}>
                <Typography sx={{ color: COLORS.darkBlue, fontWeight: 'bold', fontSize: '40px' }}>404. That's an error</Typography>
                <Typography sx={{ color: COLORS.darkBlue, fontWeight: 'normal', fontSize: '20px' }}>The requested URL /sad was not found on this server.</Typography>
                <AcceptButton title='go to Login' onClick={() => navigate('/signin')} />
            </Box>
        </Box>
    )
}

export default Error404
