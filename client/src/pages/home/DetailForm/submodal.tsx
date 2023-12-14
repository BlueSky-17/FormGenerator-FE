import React, { useState, useEffect, useLayoutEffect } from 'react'

import { Box, Typography, Drawer, Avatar, IconButton, Toolbar, List, Divider, Icon, Modal, Grid, Switch } from '@mui/material'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import CloseIcon from '@mui/icons-material/Close';

import { DataGrid, GridColDef, GridValueGetterParams, GridRowModel, } from '@mui/x-data-grid';

// Style cho modal edit
const style = {
    position: 'absolute' as 'absolute',
    top: '35%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    borderRadius: '15px',
    boxShadow: 24,
    p: 4,
};

export function SubModal(props) {

    const solveMultiOptions = () => {
        props.convertTextToOptionList(props.inputText);
        props.setInputText('');
    }

    return (
        <div>
            <Modal
                open={props.subopen !== ''}
                onClose={props.handleSubClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{ ...style }}>
                    {props.subopen === 'multi-choice' || props.subopen === 'checkbox' ?
                        <Box>
                            <Typography sx={{ color: '#6D7073', marginBottom: '15px' }}>Nhập <b>mỗi lựa chọn</b> là <b> một dòng</b></Typography>
                            <TextField
                                value={props.inputText}
                                onChange={props.handleInputText}
                                id="outlined-multiline-flexible"
                                multiline
                                rows={8}
                                sx={{ width: '100%' }}
                            />
                            <Button
                                onClick={solveMultiOptions}
                                sx={{
                                    color: 'white',
                                    backgroundColor: '#364F6B',
                                    borderRadius: '10px',
                                    paddingY: '10px',
                                    paddingX: '5px',
                                    marginTop: '10px',
                                    width: '100%',
                                    '&:hover': {
                                        backgroundColor: '#2E4155', // Màu nền thay đổi khi hover
                                    }
                                }}>
                                Xử lý dữ liệu
                            </Button>
                        </Box>
                        : null}
                    {props.subopen === 'linkedData' ?
                        <Box>
                            {props.excelData ? (
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <Typography variant='h6'>Trường dữ liệu đã tải lên</Typography>
                                        <IconButton onClick={props.handleSubClose}>
                                            <CloseIcon />
                                        </IconButton>
                                    </Box>
                                    <Box sx={{ height: 400, width: '100%' }}>
                                        <DataGrid
                                            rows={props.excelData}
                                            columns={props.columns}
                                            processRowUpdate={props.handleProcessRowUpdate}
                                            initialState={{
                                                pagination: {
                                                    paginationModel: {
                                                        pageSize: 5,
                                                    },
                                                },
                                            }}
                                            pageSizeOptions={[5]}
                                            checkboxSelection
                                            disableRowSelectionOnClick
                                        />
                                    </Box>
                                    <Button
                                        onClick={props.handleSaveLinkedData}
                                        sx={{
                                            color: 'white',
                                            backgroundColor: '#364F6B',
                                            borderRadius: '10px',
                                            marginTop: '10px',
                                            marginX: '5px',
                                            '&:hover': {
                                                backgroundColor: '#2E4155', // Màu nền thay đổi khi hover
                                            },
                                        }}>
                                        Lưu
                                    </Button>
                                </Box>
                            ) : (
                                <Typography>No File is uploaded yet!</Typography>
                            )
                            }
                        </Box>
                        : null}
                    {props.subopen === 'dropDown' ?
                        <Box>
                            <Typography>Xác nhận các trường dữ liệu trong <b>Menu thả xuống</b> là:</Typography>
                            {
                                props.optionInDropDown.map((char, index) => (
                                    <Typography sx={{ textAlign: 'center' }} key={index}> {char}</Typography>
                                ))
                            }
                            <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }} >
                                <Button
                                    onClick={props.handleSubClose}
                                    sx={{
                                        color: 'white',
                                        backgroundColor: '#364F6B',
                                        borderRadius: '10px',
                                        margin: '5px',
                                        '&:hover': {
                                            backgroundColor: '#2E4155', // Màu nền thay đổi khi hover
                                        },
                                    }}>
                                    Xác nhận
                                </Button>
                                <Button
                                    onClick={props.handleSubClose}
                                    sx={{
                                        color: '#000000',
                                        backgroundColor: '#E7E7E8',
                                        borderRadius: '10px',
                                        margin: '5px',
                                        '&:hover': {
                                            backgroundColor: '#E7E7E7', // Màu nền thay đổi khi hover
                                        },
                                    }}>
                                    Hủy
                                </Button>
                            </Box>
                        </Box>
                        : null}
                    {props.subopen === 'delete' ?
                        <Box>
                            <Typography variant='h5'><b>Xác nhận xóa câu hỏi?</b></Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'right' }} >
                                <Button
                                    onClick={props.handleDeleteQuestion(props.deleted)}
                                    sx={{
                                        color: 'white',
                                        backgroundColor: '#364F6B',
                                        borderRadius: '10px',
                                        marginY: '10px',
                                        marginX: '5px',
                                        '&:hover': {
                                            backgroundColor: '#2E4155', // Màu nền thay đổi khi hover
                                        },
                                    }}>
                                    Xác nhận
                                </Button>
                                <Button
                                    onClick={props.handleSubClose}
                                    sx={{
                                        color: '#000000',
                                        backgroundColor: '#E7E7E8',
                                        borderRadius: '10px',
                                        marginY: '10px',
                                        marginX: '5px',
                                        '&:hover': {
                                            backgroundColor: '#E7E7E7', // Màu nền thay đổi khi hover
                                        },
                                    }}>
                                    Hủy
                                </Button>
                            </Box>
                        </Box>
                        : null
                    }
                </Box>
            </Modal>
        </div>
    )
}