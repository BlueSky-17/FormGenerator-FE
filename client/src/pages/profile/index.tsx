import React, { useState, useEffect, useReducer, useLayoutEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, TextField, Drawer, Avatar, IconButton, Toolbar, List, Divider, Icon, Modal } from '@mui/material'
import { styled, useTheme, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import COLORS from '../../constants/colors';

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

function Profile() {
    const [profile, setProfile] = useState<any>({})

    const ProfileAPI_URL = `http://localhost:8080/profile`;

    useEffect(() => {
        setProfile(JSON.parse(localStorage.getItem('token') as string)?.user)
    }, [])

    console.log(profile);

    return (
        <Box>
            <DrawerHeader />
            <Box sx={{ backgroundColor: 'white', border: "2px solid #DEDEDE", paddingTop: '5px' }}>
                <Typography sx={{ color: '#364F6B', padding: '15px', fontWeight: 600 }} variant="h6" noWrap component="div">
                    THÔNG TIN CÁ NHÂN
                </Typography>
                <Divider />
                <Box sx={{ minHeight: 550, display: 'flex', flexDirection: 'row' }}>
                    <Box sx={{ height: 'full', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingX: '100px', borderRight: '1px solid #DEDEDE' }}>
                        <Avatar alt="Avatar" src={profile.AvatarPath} sx={{ width: 200, height: 200 }} />
                    </Box>
                    <Box sx={{ padding: '30px', display: 'flex', flexDirection: 'column', width: '100%' }}>
                        <Box sx={{ marginBottom: '10px' }}>
                            <Typography variant="h6" gutterBottom sx={{ color: COLORS.darkBlue }}>Họ và tên</Typography>
                            <TextField
                                disabled
                                fullWidth
                                variant="filled"
                                id="outlined-disabled"
                                // label="Disabled"
                                value={profile.FirstName}
                            />
                        </Box>

                        <Box sx={{ marginBottom: '10px' }}>
                            <Typography variant="h6" gutterBottom sx={{ color: COLORS.darkBlue }}>Email</Typography>
                            <TextField
                                disabled
                                fullWidth
                                variant="filled"
                                id="outlined-disabled"
                                // label="Disabled"
                                value={profile.Email}
                            />
                        </Box>

                        <Box sx={{ marginBottom: '10px' }}>
                            <Typography variant="h6" gutterBottom sx={{ color: COLORS.darkBlue }}>Vai trò</Typography>
                            <TextField
                                disabled
                                fullWidth
                                variant="filled"
                                id="outlined-disabled"
                                // label="Disabled"
                                value={profile.Role === 'user' ? 'Người dùng' : 'Quản trị viên'}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default Profile
