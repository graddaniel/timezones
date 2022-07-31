import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import useRole from '../hooks/useRole';

const MenuContainer = () => {
    const [ anchorEl, setAnchorEl ] = useState(null);
    // TODO add roles to config file
    const currentUsersRole = useRole();
    const navigate = useNavigate();
    const isOpen = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        // TODO make sure it's necessary
        window.location.reload();
    }

    return (
        <div>
            <Button
                id="basic-button"
                aria-controls={isOpen ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={isOpen ? 'true' : undefined}
                onClick={handleClick}
            >
                Navigation Menu
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={isOpen}
                onClose={handleClose}
                MenuListProps={{
                'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem
                    onClick={() => navigate('/')}
                >
                    Main page
                </MenuItem>
                {['user', 'admin'].includes(currentUsersRole) && (
                    <MenuItem
                        onClick={() => navigate('/timezones')}
                    >
                        Timezones panel
                    </MenuItem>
                )}
                {['userManager', 'admin'].includes(currentUsersRole) && (
                    <MenuItem
                        onClick={() => navigate('/users')}
                    >
                        Users panel
                    </MenuItem>
                )}
                <MenuItem
                    onClick={logout}
                >
                    Logout
                </MenuItem>
            </Menu>
            </div>
    );
};

export default MenuContainer;