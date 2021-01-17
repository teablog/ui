import React from 'react';
// import { MoreVert, Share, BookmarkBorder } from './icon';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import moment from 'moment';
import { POST } from '../request';

const useStyles = makeStyles(theme => ({
    // 作者 & 时间 & 分享 & 收藏 & 更多
    dycAttribute: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        marginTop: 5,
    },
    dycAttributeTime: {
        content: '',
        margin: 10,
        display: 'table',
        width: 3,
        height: 3,
        background: 'rgba(0, 0, 0, 0.5)',
        borderRadius: '50%'
    },
    dycAttributeIcon: {
        fontSize: 14,
        margin: 5,
        color: '#80868b'
    },
    dycAttributeSpace: {
        marginRight: 5
    },
    dycModal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dycModalPaper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        // boxShadow: theme.shadows[5],
        width: "30%",
        padding: theme.spacing(2, 4, 3),
        "&:focus": {
            outline: "none"
        }
    },
    dycButton: {
        marginBottom: theme.spacing(1),
    },
    dycAttributeMenu: {
        position: 'relative',
        zIndex: 6,
        whiteSpace: 'nowrap',
        textAlign: 'right',
        margin: 0,
        padding: 0,
        opacity: 0,
        display: 'none',
        [theme.breakpoints.up("sm")]: {
            display: 'block',
        }
    }
}));

moment.locale('zh-cn');

function ArticleBookmark({ author, last_edit_time, rate, type }) {

    const [open, setOpen] = React.useState(false);
    const [subscribeEmail, setSubscribeEmail] = React.useState("");
    const classes = useStyles();

    const Author = () => {
        return (
            <React.Fragment>
                <Typography color="textPrimary" variant="caption">
                    {author}
                </Typography>
                <div className={classes.dycAttributeTime}></div>
            </React.Fragment>
        );
    }

    const subscribeHandler = () => {
        if (subscribeEmail.length > 0) {
            const reg = /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/;
            if (reg.test) {
                POST({
                    url: "/api/subscribe",
                    data: {
                        email: subscribeEmail
                    }
                })
            }
        }
    }

    return (
        <div className={classes.dycAttribute}>
            {author && <Author />}
            <time>
                <Typography color="textPrimary" variant="caption" className={classes.dycAttributeSpace}>
                    {moment(last_edit_time).calendar()} {type == "video" ? "上映" : "更新"}
                </Typography>
            </time>

            <menu className={classes.dycAttributeMenu}>
                {/* <Tooltip title="收藏" onClick={() => setOpen(true)}>
                    <div className={'dycAttributeIconCircle ' + classes.dycAttributeSpace} >
                        <div>
                            <BookmarkBorder className={classes.dycAttributeIcon} />
                        </div>
                    </div>
                </Tooltip>
                <Tooltip title="分享">
                    <div className={'dycAttributeIconCircle ' + classes.dycAttributeSpace} >
                        <div>
                            <Share className={classes.dycAttributeIcon} />
                        </div>
                    </div>
                </Tooltip> */}
                {/* <Tooltip title="更多">
                    <div className={'dycAttributeIconCircle ' + classes.dycAttributeSpace} >
                        <div>
                            <MoreVert className={classes.dycAttributeIcon} />
                        </div>
                    </div>
                </Tooltip> */}
            </menu>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.dycModal}
                open={open}
                closeAfterTransition
                disableEnforceFocus
                onClose={() => setOpen(!open)}
                BackdropProps={{
                    timeout: 500
                }}
            >
                <Fade in={open}>
                    <div className={classes.dycModalPaper}>
                        <Typography style={{ textAlign: "center" }}>
                            订阅最新消息
                        </Typography>
                        <TextField
                            label="Email"
                            className={classes.dycTextField}
                            type="email"
                            name="email"
                            autoComplete="email"
                            margin="normal"
                            fullWidth={true}
                            variant="outlined"
                            onChange={(event) => setSubscribeEmail(event.target.value)}
                        />
                        <Button variant="outlined" color="inherit" fullWidth={true} onClick={subscribeHandler}>订阅</Button>
                    </div>
                </Fade>
            </Modal>
            <style jsx>{`
                .dycAttributeMenu {
                    display: block;
                    position: relative;
                    z-index: 6;
                    white-space: nowrap;
                    text-align: right;
                    margin: 0;
                    padding: 0;
                    opacity: 0;
                }
                .dycAttributeIconCircle {
                    display: inline-block;
                }
                .dycAttributeIconCircle>div{
                    display: inline-flex;
                    position: relative;
                    justify-content: center;
                    align-items: center;
                    vertical-align: middle;
                    min-height: 28.8px;
                    min-width: 28.8px;
                    cursor: pointer;
                    border-radius: 1.6rem;
                    padding: 0;
                }
                .dycAttributeIconCircle>div::before{
                    position: absolute;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    z-index: 2;
                    content: '';
                    display: block;
                    border: 1px solid transparent;
                    -webkit-transition: border-color .25s ease-in-out;
                    transition: border-color .25s ease-in-out;
                }
                .dycAttributeIconCircle:hover>div{
                    box-shadow: 0 1px 1px 1px rgba(189,193,198,0.502);
                }
            `}</style>
        </div>
    );
}

export default ArticleBookmark;