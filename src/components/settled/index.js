import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField';
import { POST, GET } from '../../request';

const userStyle = makeStyles(theme => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
        color: "#666"
    },
}))
function Settled({ open, close }) {
    const [account, setAccount] = React.useState({
        name: "",
        url: "",
        email: ""
    })
    const [accountHit, setAccountHit] = React.useState({
        name: "",
        url: "",
        email: ""
    })
    const classes = userStyle()
    /**
     * 注册：关闭
     */
    const closeDiaLog = () => {
        close(false)
    }

    const changeAccount = (event) => {
        console.log(event.target.name, event.target.value);
        setAccount({ ...account, [event.target.name]: event.target.value });
    }

    const checkAccount = (event) => {
        if (event.target.name === "name") {
            if (event.target.value != "") {
                GET({
                    url: `/api/account/name/exists?name=${event.target.value}`
                }).then(({ data }) => {
                    if (data) {
                        setAccountHit({ ...accountHit, name: `${event.target.value} 村里人不允许重名～` })
                    } else {
                        setAccountHit({ ...accountHit, name: "" })
                    }
                })
            } else {
                setAccountHit({ ...accountHit, name: "起个名字可真的难～" })
            }
        }
        if (event.target.name === "email") {
            if (event.target.value != "") {
                GET({
                    url: `/api/account/name/exists?name=${event.target.value}`
                }).then(({ data }) => {
                    if (data) {
                        setAccountHit({ ...accountHit, name: `${event.target.value} 村里人不允许重名～` })
                    } else {
                        setAccountHit({ ...accountHit, name: "" })
                    }
                })
            } else {
                setAccountHit({ ...accountHit, name: "起个名字可真的难～" })
            }
        }
        if (event.target.name === "url" && event.target.value == "") {
            setAccountHit({ ...accountHit, url: "确定不填写一下站点？村里人允许follow" })
        }
    }
    return (
        <Dialog
            fullScreen
            open={open}
            aria-labelledby="responsive-dialog-title"
        >
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <IconButton edge="start" onClick={closeDiaLog} aria-label="close">
                        <CloseIcon stlye={{ color: "#666" }} />
                    </IconButton>
                    <Typography variant="h4" className={classes.title}>
                        要入驻该村吗？
                </Typography>
                    <Button color="inherit" onClick={closeDiaLog}>
                        <Typography variant="h4" color="secondary">
                            入驻
                    </Typography>
                    </Button>
                </Toolbar>
            </AppBar>
            <TextField
                label="恁叫啥？"
                style={{ margin: 8 }}
                helperText={accountHit.name == "" ? "村里人都会看到的" : accountHit.name}
                fullWidth={true}
                onBlur={checkAccount}
                onChange={changeAccount}
                variant="standard"
                color="secondary"
                name="name"
                error={accountHit.name != ""}
            />
            <TextField
                label="Email"
                style={{ margin: 8 }}
                helperText={accountHit.email === "" ? "只有村长可见" : accountHit.email}
                fullWidth={true}
                onBlur={checkAccount}
                onChange={changeAccount}
                variant="standard"
                color="secondary"
                name="email"
            />
            <TextField
                label="站点"
                style={{ margin: 8 }}
                helperText={accountHit.url === "" ? "村里人都会串门拜访的" : accountHit.url}
                fullWidth={true}
                onBlur={checkAccount}
                onChange={changeAccount}
                variant="standard"
                color="secondary"
                name="url"
            />
        </Dialog>
    )
}

export default Settled