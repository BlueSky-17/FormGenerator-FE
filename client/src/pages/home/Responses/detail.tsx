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
    console.log(props.indexDetail - 1)
    console.log(props.responses[props.indexDetail - 1])

    console.log(props.form);

    return (
        <Box sx={{
            height: props.responses.length > 0 ? '' : '100%'
        }}>
            {
                props.responses.length > 0 ?
                    <Box sx={{ backgroundColor: 'red', borderRadius: '15px', marginTop: '15px' }}>
                        {/* Xài hàm map với mảng response để display tất cả câu hỏi */}
                        <FormResponse
                            key={props.indexDetail}
                            Answer={props.responses[props.indexDetail - 1]}
                            Form={props.form}
                        />
                    </Box > :
                    <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography sx={{ color: '#364F6B', fontWeight: 500 }}>Biểu mẫu chưa có phản hồi.</Typography>
                    </Box>
            }
        </Box>
    )
}

export default Detail
