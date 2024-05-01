import { IconButton, Tooltip } from '@mui/material';
import React, { memo, FC, ReactElement, MouseEventHandler } from 'react';
import COLORS from '../../constants/colors';

export type CustomButtonProps = {
    children: ReactElement;
    tooltip?: string;
    onClick: MouseEventHandler<HTMLButtonElement>;
};

const CircleButton: FC<CustomButtonProps> = memo(({ children, onClick, tooltip }) => {
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
                {children}
            </IconButton>
        </Tooltip>
    );
});

export default CircleButton;

