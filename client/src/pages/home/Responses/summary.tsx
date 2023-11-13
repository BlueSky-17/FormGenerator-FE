import React, { useState, useEffect, useLayoutEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom';

import { Box, Typography, Drawer, Avatar, IconButton, Toolbar, List, Divider, Icon, Modal, Grid, Switch } from '@mui/material'
import { styled, useTheme, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

function Summary(props) {
    return (
        <Box>
            {props.responses.length > 0 ? props.responses[0].Responses.map((res, index) => (
                <Box key={index} sx={{ backgroundColor: 'white', borderRadius: '15px', marginTop: '15px', paddingBottom: '5px' }}>
                    <Typography sx={{ color: '#364F6B', padding: '20px', fontWeight: 500 }} variant="h5" noWrap component="div">{res.QuestionName}</Typography>
                    {res.Type === 'shortText' ?
                        <Box sx={{ marginBottom: '15px' }}>
                            {props.responses.map((ans, idx) => (
                                <Box key={idx} sx={{ backgroundColor: '#EBEBEB', borderRadius: '15px', padding: '10px', marginX: '15px', marginBottom: '15px' }}>
                                    {ans.Responses[index].Content.ShortText}
                                </Box>
                            ))
                            }
                        </Box>
                        : null
                    }
                    {res.Type === 'multi-choice' ?
                        <Box sx={{ padding: '15px' }}>
                            <Typography>ADD CONTENT HERE</Typography>
                        </Box>
                        : null
                    }
                </Box >
            )) : null
            }
        </Box>
    )
}

export default Summary
