import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import useRole from '../hooks/useRole';
import config from '../config.json';

const {
  roles: {
    user: USER,
    userManager: USER_MANAGER,
    admin: ADMIN,
  }
} = config;

const MenuContainer = () => {
    const [ anchorEl, setAnchorEl ] = useState(null);
    const isOpen = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
    setAnchorEl(null);
    };

    const currentUsersRole = useRole();
    const navigate = useNavigate();


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
                Menu
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
                {currentUsersRole === null && (
                    <MenuItem
                        onClick={() => navigate('/login')}
                    >
                        Login
                    </MenuItem>
                )}
                {currentUsersRole === null && (
                    <MenuItem
                        onClick={() => navigate('/register')}
                    >
                        Register
                    </MenuItem>
                )}
                {[USER, ADMIN].includes(currentUsersRole) && (
                    <MenuItem
                        onClick={() => navigate('/timezones')}
                    >
                        Timezones panel
                    </MenuItem>
                )}
                {[USER_MANAGER, ADMIN].includes(currentUsersRole) && (
                    <MenuItem
                        onClick={() => navigate('/users')}
                    >
                        Users panel
                    </MenuItem>
                )}
                {currentUsersRole !== null && (
                    <MenuItem
                        onClick={logout}
                    >
                        Logout
                    </MenuItem>
                )}
            </Menu>
            </div>
    );
};

export default MenuContainer;