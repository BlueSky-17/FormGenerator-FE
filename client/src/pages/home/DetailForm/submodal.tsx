import React, { useState, useEffect, useLayoutEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Box, Typography, Drawer, Avatar, IconButton, Toolbar, List, Divider, Icon, Modal, Grid, Switch } from '@mui/material'
import { styled, useTheme, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Popover from '@mui/material/Popover';

import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import NotesIcon from '@mui/icons-material/Notes';
import ClearIcon from '@mui/icons-material/Clear';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import EventIcon from '@mui/icons-material/Event';
import DatasetLinkedIcon from '@mui/icons-material/DatasetLinked';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Checkbox from '@mui/material/Checkbox';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { ChangeEvent } from 'react';
import { DataGrid, GridColDef, GridValueGetterParams, GridRowModel, } from '@mui/x-data-grid';
import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertProps } from '@mui/material/Alert';
import jsonData from '../../../assets/i18n/vi.json'

import { Question, ShortText, MultiChoice, Date, LinkedData } from './interface';
import * as XLSX from 'xlsx'

// Style cho modal edit
const style = {
    position: 'fixed',
    top: '15%',
    left: '50%',
    marginLeft: '-350px',
    width: 700,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    borderRadius: '15px',
    boxShadow: 24,
    p: 4,
};

export function SubModal(props) {
    return (
        <div>
            <Modal
                open={props.subopen !== ''}
                onClose={props.handleSubClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{ ...style, width: 800 }}>
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
                </Box>
            </Modal>
        </div>
    )
}