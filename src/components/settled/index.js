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
    input: {
        margin: "8px"
    }
}))
function Settled({ open, close, setUser }) {
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
    /**
     * 注册：保存值
     */
    const changeAccount = (event) => {
        if (!/\s/i.test(event.target.value)) {
            let h = accountHith
            h[event.target.name] = "不支持有空格～"
            setAccountHit(h)
        } else {
            setAccount({ ...account, [event.target.name]: event.target.value });
        }
    }
    const register = () => {
        console.log(account);
        let name = account.name.replace(/^\s+|\s+$/g, "")
        let email = account.email.replace(/^\s+|\s+$/g, "")
        if (name === "" || email === "") {
            return
        }
        POST({
            url: "/api/account/register",
            data: {
                name: account.name,
                email: account.email,
                url: account.url,
            }
        }).then(({ code, data, message }) => {
            if (code === 403) {
                let hit = accountHit
                hit[data] = message
                setAccountHit(hit)
                return
            }
            if (code === 0) {
                setUser(data)
                closeDiaLog()
                return
            }
        })
    }

    const checkAccount = (event) => {
        if (event.target.name === "name") {
            if (event.target.value === "") {
                setAccountHit({ ...accountHit, name: "起个名字可真的难～" })
            }
        }
        if (event.target.name === "email") {
            if (event.target.value == "") {
                setAccountHit({ ...accountHit, email: "邮箱还是要写一下的" })
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
                    <Button color="inherit" onClick={register}>
                        <Typography variant="h4" color="secondary">
                            入驻
                    </Typography>
                    </Button>
                </Toolbar>
            </AppBar>
            <TextField
                label="恁叫啥？"
                helperText={accountHit.name == "" ? "村里人都会看到的" : accountHit.name}
                fullWidth={false}
                onBlur={checkAccount}
                onChange={changeAccount}
                variant="standard"
                color="secondary"
                name="name"
                error={accountHit.name != ""}
                className={classes.input}
            />
            <TextField
                label="Email"
                helperText={accountHit.email === "" ? "只有村长可见" : accountHit.email}
                fullWidth={false}
                onBlur={checkAccount}
                onChange={changeAccount}
                variant="standard"
                color="secondary"
                name="email"
                error={accountHit.email !== ""}
                className={classes.input}
            />
            <TextField
                label="站点"
                helperText={accountHit.url === "" ? "村里人都会串门拜访的" : accountHit.url}
                fullWidth={false}
                onBlur={checkAccount}
                onChange={changeAccount}
                variant="standard"
                color="secondary"
                name="url"
                className={classes.input}
            />
        </Dialog>
    )
}

export default Settled