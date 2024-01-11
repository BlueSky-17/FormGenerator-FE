import React, { useState, useEffect, useReducer, useLayoutEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, TextField, Drawer, Avatar, IconButton, Toolbar, List, Divider, Icon, Modal } from '@mui/material'
import { styled, useTheme, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

function Profile() {
    return (
        <Box>
            <DrawerHeader />
            <Box sx={{ backgroundColor: 'white', border: "2px solid #DEDEDE", paddingTop:'5px' }}>
                <Typography sx={{ color: '#364F6B', padding: '15px', fontWeight: 600 }} variant="h6" noWrap component="div">
                    THÔNG TIN CÁ NHÂN
                </Typography>
                <Divider />
                <Box sx={{ minHeight: 550 }}></Box>
            </Box>
        </Box>
    )
}

export default Profile
