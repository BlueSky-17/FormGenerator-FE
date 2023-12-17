import React, { useState, useEffect, useLayoutEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom';
import { Box, Typography, Drawer, Avatar, IconButton, Toolbar, List, Divider, Icon, Modal, Grid, Switch } from '@mui/material'
import { styled, useTheme, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import FormResponse from './viewFormResponse'

function Detail(props) {

    //console.log(props.responses)
    return (
        <Box>{
            props.responses.length > 0 ?
                <Box sx={{ backgroundColor: 'white', borderRadius: '15px', marginTop: '15px' }}>
                    <Typography sx={{ color: '#364F6B', padding: '20px', fontWeight: 500 }} variant="h5" noWrap component="div">{props.responses[props.indexDetail - 1].id}</Typography>
                    {/* Xài hàm map với mảng response để display tất cả câu hỏi */}
                    <FormResponse></FormResponse>
                </Box > : null
        }
        </Box>
    )
}

export default Detail
