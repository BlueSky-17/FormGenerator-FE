import { Button, IconButton, Tooltip, Typography } from '@mui/material';
import React from 'react';
import COLORS from '../../constants/colors';

const CancelButton = ({ title, onClick }) => {
    return (
        <Button
            onClick={onClick}
            sx={{
                backgroundColor: COLORS.darkGray,
                borderRadius: '10px',
                marginY: '10px',
                marginX: '5px',
                '&:hover': {
                    backgroundColor: COLORS.lightGray, 
                },
            }}
        >
            <Typography sx={{
                fontWeight: 500,
                color: 'black',
                paddingX: '10px',
                paddingY: '4px'
            }}
                variant="body2"
                noWrap
                component="div">
                {title}
            </Typography>
        </Button>
    );
};

export default CancelButton;
