import React, { useState, useEffect, useLayoutEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useMemo } from 'react';
import * as ExcelJS from 'exceljs';
import { Box, Typography, TextField, Drawer, Avatar, IconButton, Toolbar, List, Divider, Icon, Modal, Grid, Switch } from '@mui/material'
import { styled, useTheme, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import Summary from './summary';
import Detail from './detail';
import { Answer } from './interface';
import { Question } from '../DetailForm/interface';

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

function Responses(props) {
    //Set Tab
    const [tab, setTab] = React.useState(0);
    const handleChangeTabs = (event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);

        if (newValue === 1) setDetail(true);
        else setDetail(false);
    };

    const [responses, setFormResponse] = useState<Answer[]>([]);
    const [formDetail, setFormDetail] = useState<any>({});

    useEffect(() => {
        setFormResponse(props.responses);
        setFormDetail(props.form);
    }, [props.responses, props.form]);


    const [detail, setDetail] = useState(false);

    const [indexDetail, setIndexDetail] = useState(1);
    const handleIndexDetail = (e) => setIndexDetail(e.target.value);
    const decreaseIndex = () => {
        if (indexDetail === 1) return;
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

    //handle create excel File
    const ExcelGenerator = () => {
        const generateExcelFile = async () => {
          // Create a new workbook and add a worksheet
          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet('Sheet 1');
    
            
            let containTable: boolean = false
            for(let ques of formDetail.Questions){
                if(ques.Type === 'table') containTable = true;
            }

            // Add data to the worksheet
            let columns: {
                header: string;
                key: string;
                width: number;
            }[] = []

            columns.push({
                header: "Thời gian",
                key: "time",
                width: 20
            })
            columns.push({
                header: "Người dùng",
                key: "username",
                width: 20 
            }) 
            worksheet.getCell('A1').value = 'Thời gian'
            worksheet.getCell('B1').value = 'Người dùng'
            if(containTable){
                worksheet.mergeCells('A1:A2')
                worksheet.mergeCells('B1:B2')
            }
            
            let count = 2
            for(let i in formDetail.QuestionOrder){
                let question: any = formDetail.Questions[i];
                if(question.Type === 'table'){
                    let tables = question.Content.Table.ListOfColumn
                    worksheet.mergeCells(1, count + 1, 1, count + tables.length)
                    worksheet.getCell(1, count + 1).value = "Danh sách công tác";
                    for (let i = 0; i < tables.length; i++) {
                        worksheet.getCell(2, count + i + 1).value = tables[i];
                    }
                    count += tables.length;
                }
                else {
                    count += 1;
                    worksheet.getCell(1, count).value = question.Question;
                    if (containTable) {
                        worksheet.mergeCells(1, count, 2, count)
                    }
                }
            }

            // Add rows based on responses
            for (let response of responses) {
                let rowData: any = []
                let countR: number = 2
                rowData.push(response.SubmitTime, response.Username)
                for(let curr of response.Responses){
                    if(curr.Type == 'shortText'){
                        rowData[countR + curr.Index] =  `${curr.Content.ShortText}`
                    } else if(curr.Type === 'multi-choice' || curr.Type === 'checkbox' || curr.Type === 'dropdown'){
                        let s : string = ''
                        let flag: boolean = true
                        for (let j = 0; j < curr.Content.MultiChoice.Result.length; j++) {
                            if (curr.Content.MultiChoice.Result[j] === true) {
                                if (flag) {
                                    s += `${curr.Content.MultiChoice.Options[j]}`
                                    flag = false
                                } else s += `;${curr.Content.MultiChoice.Options[j]}`
                            }
                        }
                        rowData[countR + curr.Index] =  s
                    }
                    else if(curr.Type === "file"){
                        let s : string = ''
                        let flag: boolean = true
                        for(let j = 0; j < curr.Content.Files.length; j++) {
                            if(flag){
                                s += `${curr.Content.Files[j].FileURL}`
                                flag = false
                            } else s += `;${curr.Content.Files[j].FileURL}`
                        }
                        rowData[countR + curr.Index] = s
                    }
                }
                worksheet.addRow(rowData);
            };



            const buffer = await workbook.xlsx.writeBuffer();

            // Create a Blob from the buffer
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

            // Create a download link and trigger a click event
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'responses.xlsx';
            link.click();
        };
        generateExcelFile();
    };



    return (
        <div>
            <Box sx={{ backgroundColor: 'white', borderRadius: '15px', marginTop: '15px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ color: '#364F6B', padding: '20px', fontWeight: 500 }} variant="h5" noWrap component="div">{responses === null ? 0 : responses.length} câu trả lời</Typography>
                    <Button sx={{ margin: '20px', fontWeight: 500, textTransform: 'initial', fontSize: '15px' }}
                        onClick={ExcelGenerator}
                    >Liên kết với trang tính</Button>
                </Box>
                <Tabs value={tab} onChange={handleChangeTabs} centered>
                    <Tab sx={{ textTransform: 'initial', fontSize: '17px' }} label="Thống kê" />
                    <Tab sx={{ textTransform: 'initial', fontSize: '17px' }} label="Cá nhân" />
                </Tabs>
                {detail &&
                    <Box>
                        <Divider />
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center', padding: '5px' }}>
                            <IconButton onClick={decreaseIndex}>
                                <NavigateBeforeIcon />
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
                <Summary responses={responses} form={formDetail}/>
            }

            {tab === 1 &&
                <Detail responses={responses} indexDetail={indexDetail} form={formDetail}/>
            }

        </div>
    )
}

export default Responses