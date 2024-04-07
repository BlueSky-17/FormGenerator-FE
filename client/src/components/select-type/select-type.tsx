import React from 'react'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import NotesIcon from '@mui/icons-material/Notes';
import EventIcon from '@mui/icons-material/Event';
import DatasetLinkedIcon from '@mui/icons-material/DatasetLinked';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DateRangeIcon from '@mui/icons-material/DateRange';
import TableViewIcon from '@mui/icons-material/TableView';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import InputIcon from '@mui/icons-material/Input';

type SelectAttribute = {
    value: any,
    handleFunction: any,
}

function SelectType({
    value,
    handleFunction
}: SelectAttribute) {
    return (
        <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Dạng</InputLabel>
            <Select
                MenuProps={{
                    PaperProps: {
                        sx: {
                            maxHeight: 230,
                        }
                    }
                }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={value}
                label="Dạng"
                onChange={handleFunction}
            >
                <MenuItem value={'shortText'}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <NotesIcon sx={{ marginRight: '10px', color: '#6D7073' }} />
                        <ListItemText>
                            Điền ngắn
                        </ListItemText>
                    </div>
                </MenuItem>
                <MenuItem value={'longText'}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <FormatColorTextIcon sx={{ marginRight: '10px', color: '#6D7073' }} />
                        <ListItemText>
                            Điền dài
                        </ListItemText>
                    </div>
                </MenuItem>
                <MenuItem value={'multi-choice'}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <RadioButtonCheckedIcon sx={{ marginRight: '10px', color: '#6D7073' }} />
                        <ListItemText>
                            Trắc nghiệm
                        </ListItemText>
                    </div>
                </MenuItem>
                <MenuItem value={'checkbox'}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <CheckBoxIcon sx={{ marginRight: '10px', color: '#6D7073' }} />
                        <ListItemText>
                            Ô đánh dấu
                        </ListItemText>
                    </div>
                </MenuItem>
                <MenuItem value={'dropdown'}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <ArrowDropDownCircleIcon sx={{ marginRight: '10px', color: '#6D7073' }} />
                        <ListItemText>
                            Menu thả xuống
                        </ListItemText>
                    </div>
                </MenuItem>
                <MenuItem value={'date-single'}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <EventIcon sx={{ marginRight: '10px', color: '#6D7073' }} />
                        <ListItemText>
                            Mốc thời gian
                        </ListItemText>
                    </div>
                </MenuItem>
                <MenuItem value={'date-range'}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <DateRangeIcon sx={{ marginRight: '10px', color: '#6D7073' }} />
                        <ListItemText>
                            Khoảng thời gian
                        </ListItemText>
                    </div>
                </MenuItem>
                <MenuItem value={'file'}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <AttachFileIcon sx={{ marginRight: '10px', color: '#6D7073' }} />
                        <ListItemText>
                            File
                        </ListItemText>
                    </div>
                </MenuItem>
                <MenuItem value={'linkedData'}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <DatasetLinkedIcon sx={{ marginRight: '10px', color: '#6D7073' }} />
                        <ListItemText>
                            Dữ liệu liên kết
                        </ListItemText>
                    </div>
                </MenuItem>
                <MenuItem value={'table'}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <TableViewIcon sx={{ marginRight: '10px', color: '#6D7073' }} />
                        <ListItemText>
                            Bảng
                        </ListItemText>
                    </div>
                </MenuItem>
                <MenuItem value={'email'}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <AlternateEmailIcon sx={{ marginRight: '10px', color: '#6D7073' }} />
                        <ListItemText>
                            Email
                        </ListItemText>
                    </div>
                </MenuItem>
                <MenuItem value={'phone'}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <ContactPhoneIcon sx={{ marginRight: '10px', color: '#6D7073' }} />
                        <ListItemText>
                            Số điện thoại
                        </ListItemText>
                    </div>
                </MenuItem>
                <MenuItem value={'OTPinput'}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <InputIcon sx={{ marginRight: '10px', color: '#6D7073' }} />
                        <ListItemText>
                            OTP Input 
                        </ListItemText>
                    </div>
                </MenuItem>
            </Select>
        </FormControl>
    )
}

export default SelectType
