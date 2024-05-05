import { Button, IconButton, Tooltip, Typography } from '@mui/material';
import React, { memo, FC } from 'react';
import COLORS from '../../constants/colors';

export type CustomButtonProps = {
    title: string;
    style?: React.CSSProperties;
    disabled?: boolean;
    onClick: () => void;
    type?: 'manual' | 'describe' | 'image' | 'data'
    selectType?: 'manual' | 'describe' | 'image' | 'data'
};

const SelectButton: FC<CustomButtonProps> = memo(
    ({ selectType, type, title, style, onClick, disabled }) => {
        return (
            <Button
                onClick={onClick}
                disabled={disabled}
                sx={{
                    backgroundColor: 'white',
                    color: 'black',
                    borderRadius: '10px',
                    marginY: '10px',
                    marginX: '5px',
                    border: '1px solid',
                    borderColor: COLORS.darkBlue,
                    '&:hover': {
                        backgroundColor: COLORS.hoverDarkBlue,
                        color: 'white'
                    },
                    ...(selectType === type ? {
                        backgroundColor: COLORS.darkBlue,
                        color: 'white'
                    } : {}),
                    ...style,
                }}
            >
                <Typography sx={{
                    fontWeight: 500,
                    paddingX: '10px',
                    paddingY: '4px',
                    textTransform: 'initial',
                    overflow: 'visible'
                }}
                    variant="body2"
                    noWrap
                    component="div">
                    {title}
                </Typography>
            </Button>
        );
    });

export default SelectButton;
