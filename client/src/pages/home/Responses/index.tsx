import React, { useState, useEffect, useLayoutEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom';

import { Box, Typography, TextField, Drawer, Avatar, IconButton, Toolbar, List, Divider, Icon, Modal, Grid, Switch } from '@mui/material'
import { styled, useTheme, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import Summary from './summary';
import Question from './question';
import Detail from './detail';
import { Answer } from './interface';

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

        if (newValue === 2) setDetail(true);
        else setDetail(false);
    };

    const [responses, setFormResponse] = useState<Answer[]>([])

    const ResponsesAPI_URL = `http://localhost:8080/get-response/${useParams()?.formID}`;

    // API GET: Get responses
    useEffect(() => {
        fetch(ResponsesAPI_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('token') as string)?.accessToken
            }
        })
            .then(data => data.json())
            .then(responses => {
                if (responses === null) setFormResponse([]);
                else setFormResponse(responses);
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const [detail, setDetail] = useState(false);

    const [indexDetail, setIndexDetail] = useState(1);
    const handleIndexDetail = (e) => setIndexDetail(e.target.value);
    const decreaseIndex = () => {
        if (indexDetail === 0) return;
        else {
            let newIndex = indexDetail - 1;
            setIndexDetail(newIndex);
        }
    }

    const increaseIndex = (e) => {
        if (indexDetail === responses.length) return;
        else {
            let newIndex = indexDetail + 1;
            setIndexDetail(newIndex);
        }
    }

    return (
        <div>
            <Box sx={{ backgroundColor: 'white', borderRadius: '15px', marginTop: '15px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ color: '#364F6B', padding: '20px', fontWeight: 500 }} variant="h5" noWrap component="div">{responses === null ? 0 : responses.length} câu trả lời</Typography>
                    <Button sx={{ margin: '20px', fontWeight: 500, textTransform: 'initial', fontSize: '15px' }}>Liên kết với trang tính</Button>
                </Box>
                <Tabs value={tab} onChange={handleChangeTabs} centered>
                    <Tab sx={{ textTransform: 'initial', fontSize: '17px' }} label="Thống kê" />
                    <Tab sx={{ textTransform: 'initial', fontSize: '17px' }} label="Cá nhân" />
                </Tabs>
                {detail &&
                    <Box>
                        <Divider />
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center', padding: '5px' }}>
                            <IconButton>
                                <NavigateBeforeIcon onClick={decreaseIndex} />
                            </IconButton>
                            <TextField
                                disabled
                                sx={{ width: '20px' }}
                                value={indexDetail}
                                onChange={handleIndexDetail}
                                id="standard-basic"
                                variant="standard"
                            />
                            <Typography sx={{ padding: '5px' }}>/ {responses.length}</Typography>
                            <IconButton>
                                <NavigateNextIcon onClick={increaseIndex} />
                            </IconButton>
                        </Box>
                    </Box>
                }
            </Box >

            {tab === 0 &&
                <Summary responses={responses} />
            }

            {tab === 1 &&
                <Question responses={responses} />
            }

            {tab === 2 &&
                <Detail responses={responses} indexDetail={indexDetail} />
            }

        </div>
    )
}

export default Responses
