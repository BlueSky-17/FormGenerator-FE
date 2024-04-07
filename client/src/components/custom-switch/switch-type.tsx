import React from 'react'
import { Box, Divider, FormGroup, FormControlLabel, Switch } from '@mui/material'

type SwitchAttribute = {
    checked: any,
    handleChangeRequired: any,
    type: any,
    convertType: any,
}

function SwitchType({
    checked,
    handleChangeRequired,
    type,
    convertType
}: SwitchAttribute) {
    return (
        <Box>
            <Divider />
            <FormGroup sx={{ display: 'flex', flexDirection: 'row-reverse', marginTop: '5px' }}>
                <FormControlLabel control={<Switch checked={checked}
                    onChange={handleChangeRequired} />} label="Bắt buộc"
                />
                {type === 'shortText' &&
                    <FormControlLabel control={<Switch defaultChecked={false}
                        onChange={convertType}
                    />} label="Trả lời dài"
                    />
                }
                {type === 'longText' &&
                    <FormControlLabel control={<Switch defaultChecked={true}
                        onChange={convertType}
                    />} label="Trả lời dài"
                    />
                }
                {type === 'multi-choice' &&
                    <FormControlLabel control={<Switch defaultChecked={false}
                        onChange={convertType}
                    />} label="Nhiều lựa chọn"
                    />
                }
                {type === 'checkbox' &&
                    <FormControlLabel control={<Switch defaultChecked={true}
                        onChange={convertType}
                    />} label="Nhiều lựa chọn"
                    />
                }
                {type === 'date-range' &&
                    <FormControlLabel control={<Switch defaultChecked={true}
                        onChange={convertType}
                    />} label="Khoảng thời gian"
                    />
                }
                {type === 'date-single' &&
                    <FormControlLabel control={<Switch defaultChecked={false}
                        onChange={convertType}
                    />} label="Khoảng thời gian"
                    />
                }
            </FormGroup>
        </Box>
    )
}

export default SwitchType
