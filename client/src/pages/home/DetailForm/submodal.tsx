import React, { useState } from 'react'

import { Box, Typography, IconButton, Modal, TextField } from '@mui/material'
import { CopyToClipboard } from 'react-copy-to-clipboard';

import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneIcon from '@mui/icons-material/Done';

import { DataGrid } from '@mui/x-data-grid';
import { modalStyle } from '../home.page';
import AcceptButton from '../../../components/custom-button/acceptButton';
import CancelButton from '../../../components/custom-button/cancelButton';
import COLORS from '../../../constants/colors';

export function SubModal(props) {

    const [copied, setCopied] = useState<boolean>(false)

    const solveMultiOptions = () => {
        props.convertTextToOptionList(props.inputText);
        props.setInputText('');
    }

    const handleCloseSharing = () => {
        props.handleSubClose()
        setCopied(false)
    }

    console.log(props.formDetail)

    return (
        <div>
            <Modal
                open={props.subopen !== ''}
                onClose={props.handleSubClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{ ...modalStyle }}>
                    {/* multi-choice | checkbox | dropdown  */}
                    {props.subopen === 'multi-choice' ?
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
                            {props.type === 'multi-choice' ?
                                <AcceptButton title='Xử lý dữ liệu' onClick={solveMultiOptions} />
                                : null}
                            {props.type === 'table' ?
                                <AcceptButton title='Xử lý dữ liệu' onClick={props.solveOptionTable} />
                                : null}
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
                                    <AcceptButton title='Lưu' onClick={props.handleSaveLinkedData} />
                                </Box>
                            ) : (
                                <Typography>No File is uploaded yet!</Typography>
                            )
                            }
                        </Box>
                        : null}
                    {props.subopen === 'save' ?
                        <Box>
                            <Typography variant='h5'><b>Xác nhận lưu lại những thay đổi?</b></Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'right' }} >
                                <AcceptButton title='Xác nhận' onClick={props.saveChange} />
                                <CancelButton title='Hủy' onClick={props.handleSubClose} />
                            </Box>
                        </Box>
                        : null
                    }
                    {props.subopen === 'closeForm' ?
                        <Box>
                            <Typography variant='h5'><b>Xác nhận đóng form?</b></Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'right' }} >
                                <AcceptButton title='Xác nhận' onClick={props.handleCloseForm} />
                                <CancelButton title='Hủy' onClick={props.handleSubClose} />
                            </Box>
                        </Box>
                        : null
                    }
                    {props.subopen === 'openForm' ?
                        <Box>
                            <Typography variant='h5'><b>Xác nhận mở lại form?</b></Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'right' }} >
                                <AcceptButton title='Xác nhận' onClick={props.handleOpenForm} />
                                <CancelButton title='Hủy' onClick={props.handleSubClose} />
                            </Box>
                        </Box>
                        : null
                    }
                    {props.subopen === 'sharing' ?
                        <Box>
                            <Typography variant='h5'><b>Chia sẻ "{props.formDetail.name}"</b></Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center', margin: '5px' }}>
                                <Typography variant='body1' sx={{ whiteSpace: 'nowrap', width: '70%', overflow: 'hidden', textOverflow: 'ellipsis', color: COLORS.darkBlue }}>{process.env.REACT_APP_DOMAIN}form/{props.formDetail.id}/view</Typography>


                                <CopyToClipboard text={process.env.REACT_APP_DOMAIN + `form/${props.formDetail.id}/view`}
                                    onCopy={() => setCopied(true)}>
                                    {!copied ?
                                        <IconButton>
                                            <ContentCopyIcon />
                                        </IconButton> :
                                        <IconButton>
                                            <DoneIcon />
                                        </IconButton>}
                                </CopyToClipboard>
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'right' }} >
                                <CancelButton title='Hủy' onClick={handleCloseSharing} />
                            </Box>
                        </Box>
                        : null
                    }
                </Box>
            </Modal>
        </div>
    )
}