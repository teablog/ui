import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import {GET} from '../../request';

const useStyles = makeStyles(theme => ({
    root: {
        margin: 'auto',
    },
    paper: {
        width: 200,
        height: 230,
        // overflow: 'auto',
        overflowY: "scroll"
    },
    button: {
        margin: theme.spacing(0.5, 0),
    },
    input: {
        flex: 1,
        paddingLeft: 8,
        transition: theme.transitions.create('width'),
        [theme.breakpoints.down('md')]: {
            width: 200,
        },
    },
    search: {
        display: "flex",
    }
}));

function not(a, b) {
    return a.filter(value => b.indexOf(value) === -1);
}

function intersection(a, b) {
    return a.filter(value => b.indexOf(value) !== -1);
}

export default function UserList({setOpen, createChannel, myUserId}) {
    const classes = useStyles();
    const [checked, setChecked] = React.useState([]);
    const [left, setLeft] = React.useState([]);
    const [right, setRight] = React.useState([]);
    const [all, setAll] = React.useState({});

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    React.useEffect(() => {
        getUserList("")
    }, []);

    const getUserList = async (q) => {
        let m = all, left = [];
        const data = await GET({
            "url": "/api/account/list",
            "params":  {
                q: q
            }
        }).then(({data}) => {
            data.map((item) => {
                m[item.id] = item
                if (right.indexOf(item.id) == -1 && item.id != myUserId) {
                    left.push(item.id)
                }
            })
            return m;
        })
        setAll(data);
        setLeft(left);
    }

    const handleToggle = value => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];
        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked);
    };

    const handleAllRight = () => {
        setRight(right.concat(left));
        setLeft([]);
    };

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    const handleAllLeft = () => {
        setLeft(left.concat(right));
        setRight([]);
    };

    const handlerSearch = (event) => {
        if (event.key == "Enter" && event.target.value.length > 0) {
            getUserList(event.target.value);
        }
    }

    const handlerPubChannel = () => {
        createChannel(right);
        setOpen(false);
    }

    const customList = items => (
        <Paper className={classes.paper}>
            <List dense component="div" role="list">
                {items.map(item => {
                    const labelId = `transfer-list-item-${item}-label`;
                    return (
                        <ListItem key={item} role="listitem" button onClick={handleToggle(item)}>
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(item) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': labelId }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={<Typography variant="caption">{all[item]['name']}</Typography>} />
                        </ListItem>
                    );
                })}
                <ListItem />
            </List>
        </Paper>
    );
    return (
        <div>
            <Grid container spacing={3} justify="center" alignItems="center" className={classes.root}>
                <Grid item xs={12} className={classes.search}>
                    <SearchIcon />
                    <InputBase
                        className={classes.input}
                        placeholder="搜索联系人"
                        onKeyPress={handlerSearch}
                        disabled
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2} justify="center" alignItems="center" className={classes.root}>
                <Grid item>{customList(left)}</Grid>
                <Grid item>
                    <Grid container direction="column" alignItems="center">
                        <Button
                            variant="outlined"
                            size="small"
                            className={classes.button}
                            onClick={handleAllRight}
                            disabled={left.length === 0}
                            aria-label="move all right"
                        >
                            ≫
                         </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            className={classes.button}
                            onClick={handleCheckedRight}
                            disabled={leftChecked.length === 0}
                            aria-label="move selected right"
                        >
                            &gt;
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            className={classes.button}
                            onClick={handleCheckedLeft}
                            disabled={rightChecked.length === 0}
                            aria-label="move selected left"
                        >
                            &lt;
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            className={classes.button}
                            onClick={handleAllLeft}
                            disabled={right.length === 0}
                            aria-label="move all left"
                        >
                            ≪
                        </Button>
                    </Grid>
                </Grid>
                <Grid item>{customList(right)}</Grid>
            </Grid>
            <Grid container spacing={2} justify="center" alignItems="center" className={classes.root}>
                <Grid item><Button onClick={() => setOpen(false)}>取消</Button></Grid>
                <Grid item><Button onClick={handlerPubChannel}>确认</Button></Grid>
            </Grid>
        </div>
    );
}