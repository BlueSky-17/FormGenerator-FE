import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { FileAttribute } from '../../pages/home/MyForms/modalAdd';
import COLORS from '../../constants/colors';
import SelectType from '../select-type/select-type';

type InputFileProps = {
    setFileProps: (file: FileAttribute) => void
    setErrorFile: (error: string) => void
    requiredType: string[]
}

export default function InputFileUpload({ setErrorFile, setFileProps, requiredType }: InputFileProps) {

    const handleFileChange = (e) => {
        let selectedFile = e.target.files[0]

        if (!requiredType.includes(selectedFile.type)) {
            setErrorFile('Không đúng định dạng file!')
            setFileProps(undefined)
            return;
        }

        // 5000000 byte ~ 5 MB
        if (selectedFile.size > 5000000) {
            setErrorFile('Kích thước file vượt quá giới hạn!')
            setFileProps(undefined)
            return;
        }

        setErrorFile('')
        setFileProps(selectedFile)
    }

    return (
        <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            sx={{
                textTransform: 'initial', marginY: '10px', width: '200px', backgroundColor: 'white', color: COLORS.darkBlue,
                '&:hover': {
                    backgroundColor: 'white',
                    color: COLORS.darkBlue,
                    opacity: '0.8'
                }
            }}
        >
            Thêm file
            <VisuallyHiddenInput
                type="file"
                onChange={handleFileChange}
            />
        </Button>
    );
}

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});