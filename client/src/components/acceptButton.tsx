import { Button, IconButton, Tooltip, Typography } from '@mui/material';
import React, { memo, FC } from 'react';
import COLORS from '../constants/colors';

export type CustomButtonProps = {
    title: string;
    style?: React.CSSProperties;
    onClick: () => void;
};

const AcceptButton: FC<CustomButtonProps> = memo(
    ({ title, style, onClick }) => {
        return (
            <Button
                onClick={onClick}
                sx={{
                    backgroundColor: COLORS.darkBlue,
                    borderRadius: '10px',
                    marginY: '10px',
                    marginX: '5px',
                    '&:hover': {
                        backgroundColor: COLORS.hoverDarkBlue,
                    },
                    ...style,
                }}
            >
                <Typography sx={{
                    fontWeight: 500,
                    color: 'white',
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
    });

export default AcceptButton;
