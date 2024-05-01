import { IconButton, Tooltip } from '@mui/material';
import React, { memo, FC } from 'react';
import COLORS from '../../constants/colors';

export type CustomButtonProps = {
    title: any;
    tooltip?: string;
    onClick: () => void;
};

const CircleButton: FC<CustomButtonProps> = memo(({ title, onClick, tooltip }) => {
    return (
        <Tooltip
            title={tooltip}
            //adjust the distance between the tooltip and its anchor
            slotProps={{
                popper: {
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [0, -10],
                            },
                        },
                    ],
                },
            }}
            placement="bottom"
        >
            <IconButton
                onClick={onClick}
                sx={{
                    backgroundColor: COLORS.darkBlue,
                    color: 'white',
                    margin: '5px',
                    '&:hover': {
                        backgroundColor: COLORS.hoverDarkBlue
                    },
                }}
            >
                {title}
            </IconButton>
        </Tooltip>
    );
});

export default CircleButton;

