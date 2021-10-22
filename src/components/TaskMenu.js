import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Divider from '@mui/material/Divider';

export default function BasicMenu() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button
                id="basic-button"
                aria-controls="basic-menu"
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                sx={{ width: "50px", height: "30px" }}
            >
                <ArrowRightIcon />
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={handleClose}>Move task to next stage</MenuItem>
                <MenuItem onClick={handleClose}>Move task to prev stage</MenuItem>
                <MenuItem onClick={handleClose}>Assign yourself to task</MenuItem>
                <Divider />
                <MenuItem onClick={handleClose}>Delete task</MenuItem>
            </Menu>
        </div>
    );
}