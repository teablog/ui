import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import { parseCookies } from 'nookies'
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Settle from '../components/settled';

function Account() {
    const [cook, setCook] = React.useState(undefined);
    const [openSettled,setOpenSettled] = React.useState(false);
    React.useEffect(() => {
        const all = parseCookies();
        if (all.douyacun) {
            const douyacun = JSON.parse(all.douyacun);
            setCook(douyacun);
        }
    }, []);

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleLogout = () => {
        logout()
        handleClose()
    }
    const handleLogin = () => {
        setOpenSettled(true)
    }

    const handleListKeyDown = () => {
        handleClose()
    }

    const handleToken = () => {
        window.location = "/helper/token"
    }

    const logout = () => {
        document.cookie = `douyacun=; path=/;domain=.www.douyacun.com;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        setCook(undefined);
    }

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    return (
        <React.Fragment>
            {
                Boolean(cook) ?
                    (
                        <Button onClick={handleClick}>
                            <Typography>
                                {douyacun.name.replace("+", " ")}
                            </Typography>
                        </Button>
                    )
                    :
                    (
                        <Button onClick={handleLogin}>
                            <Typography style={{ color: "#666", fontWeight: 500 }}>
                                游客
                            </Typography>
                        </Button>
                    )
            }
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Paper>
                    <MenuList onKeyDown={handleListKeyDown}>
                        <MenuItem onClick={handleToken}>token</MenuItem>
                        <MenuItem onClick={handleLogout}>out</MenuItem>
                    </MenuList>
                </Paper>
            </Popover>
            <Settle open={openSettled} close={setOpenSettled}/>
        </React.Fragment>
    );
}

export default Account;