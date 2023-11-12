import React, { useState, useEffect, useLayoutEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom';

import { Box, Typography, Drawer, Avatar, IconButton, Toolbar, List, Divider, Icon, Modal, Grid, Switch } from '@mui/material'
import { styled, useTheme, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

function Responses() {
    //Set Tab
    const [tab, setTab] = React.useState(0);
    const handleChangeTabs = (event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };

    const [responses, setFormResponse] = useState<any[]>([])

    const ResponsesAPI_URL = `http://localhost:8080/get-response/${useParams()?.formID}`;

    // API GET: Get responses
    useEffect(() => {
        console.log(ResponsesAPI_URL);

        fetch(ResponsesAPI_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('token') as string)?.accessToken
            }
        })
            .then(data => data.json())
            .then(responses => {
                setFormResponse(responses);
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    console.log(responses);

    return (
        <div>
            <Box sx={{ backgroundColor: 'white', borderRadius: '15px', marginTop: '15px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ color: '#364F6B', padding: '20px', fontWeight: 500 }} variant="h5" noWrap component="div">{responses === null? 0 : responses.length} câu trả lời</Typography>
                    <Button sx={{ margin: '20px', fontWeight: 500, textTransform: 'initial', fontSize: '15px' }}>Liên kết với trang tính</Button>
                </Box>
                <Tabs value={tab} onChange={handleChangeTabs} centered>
                    <Tab sx={{ textTransform: 'initial', fontSize: '17px' }} label="Bản tóm tắt" />
                    <Tab sx={{ textTransform: 'initial', fontSize: '17px' }} label="Câu hỏi" />
                    <Tab sx={{ textTransform: 'initial', fontSize: '17px' }} label="Cá nhân" />
                </Tabs>
            </Box >

            {tab === 0 &&
                <Box sx={{ backgroundColor: 'white', borderRadius: '15px', marginTop: '15px' }}>
                    <Typography sx={{ color: '#364F6B', padding: '20px', fontWeight: 500 }} variant="h5" noWrap component="div">Bản tóm tắt</Typography>
                </Box >
            }

            {tab === 1 &&
                <Box sx={{ backgroundColor: 'white', borderRadius: '15px', marginTop: '15px' }}>
                    <Typography sx={{ color: '#364F6B', padding: '20px', fontWeight: 500 }} variant="h5" noWrap component="div">Câu hỏi</Typography>
                </Box >
            }

            {tab === 2 && <Box>
                {responses.map((res, index) => (
                    <Box sx={{ backgroundColor: 'white', borderRadius: '15px', marginTop: '15px' }}>
                        <Typography sx={{ color: '#364F6B', padding: '20px', fontWeight: 500 }} variant="h5" noWrap component="div">Cá nhân</Typography>
                    </Box >
                ))
                }
            </Box>
            }

        </div>
    )
}

export default Responses
