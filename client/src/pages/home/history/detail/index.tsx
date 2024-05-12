import React, { useState, useEffect } from 'react'
import { Box, Divider, Typography, styled } from '@mui/material'
import FormResponse from '../../Responses/viewFormResponse'
import { useLocation, useParams } from 'react-router-dom';

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

function HistoryDetail() {
    const location = useLocation();
    const formID = location.state;

    const [formDetail, setFormDetail] = useState<any>({});
    const [formResponses, setFormResponse] = useState<any>({});

    const FormDetailAPI_URL = process.env.REACT_APP_ROOT_URL + `/form/${formID}`;

    const ResponseAPI_URL = process.env.REACT_APP_ROOT_URL + `/get-response/${formID}/${JSON.parse(localStorage.getItem('token') as string)?.user.ID}`

    useEffect(() => {
        fetch(FormDetailAPI_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token') as string)?.accessToken
            }
        })
            .then(data => data.json())
            .then(formDetail => {
                setFormDetail(formDetail);
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        fetch(ResponseAPI_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token') as string)?.accessToken
            }
        })
            .then(data => data.json())
            .then(formResponses => {
                setFormResponse(formResponses);
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    console.log(formDetail);
    console.log(formResponses);

    return (
        <Box>
            <DrawerHeader />
            <Box sx={{ backgroundColor: 'white', border: "2px solid #DEDEDE", paddingTop: '5px' }}>
                <Typography sx={{ color: '#364F6B', padding: '15px', fontWeight: 600 }} variant="h6" noWrap component="div">
                    XEM PHẢN HỒI ĐÃ ĐIỀN
                </Typography>
                <Box sx={{ backgroundColor: 'white', borderRadius: '15px', marginTop: '15px' }}>
                    {/* Xài hàm map với mảng response để display tất cả câu hỏi */}
                    {Object.keys(formResponses).length !== 0 ? <FormResponse
                        Answer={formResponses}
                        Form={formDetail}
                    /> : null}
                </Box >
            </Box>
        </Box>
    )
}

export default HistoryDetail
