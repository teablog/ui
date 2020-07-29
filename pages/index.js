import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Topic from '../src/layout/Topic';
import Layout from '../src/layout/Index';
import { GET } from '../src/request';
import { PAGE_SIZE } from '../src/config';
import Weather from '../src/components/weather';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(theme => ({
    root: {
        maxWidth: '1176px',
        margin: 'auto',
        padding: '16px 32px 32px 32px',
        '@media screen and (max-width: 1736px)': {
            'dyc-app[open-and-visible="true"] &': {
                marginLeft: '280px'
            }
        }
    },
    // grid
    dycGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(12,1fr)',
        gridGap: '16px 32px',
        gridColumn: '1/span 12',
    },
    dycGridGap: {
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridGap: '16px 32px'
    },
    dycGridColmn: {
        gridColumn: 'span 12',
    },
    main: {
        gridColumn: 'span 8',
        '@media screen and (max-width: 800px)': {
            '&': {
                gridColumn: '1/span 12'
            }
        }
    },
    aside: {
        gridColumn: 'span 4',
        gridColumnGap: 0,
        '@media screen and (max-width: 800px)': {
            '&': {
                display: 'none'
            }
        },
        gridTemplateRows: "repeat(2, 49%)"
    },
    dycAsideColumn: {
        borderRadius: '8px',
        background: '#f8f9fa',
    },
    dycAsideColumnTopic: {
        color: '#5f6368',
        padding: '12.8px 0',
        margin: '0 16px',
        borderBottom: '1px solid #dadce0',
        display: 'flex',
        flexDirection: 'row'
    },
    dycAsideTag: {
        margin: '16px 16px 18px 16px'
    },
    dycAsideTagButton: {
        margin: '0 8px 8px 0',
        color: '#5f6368',
        borderRadius: '8px',
        background: '#fff',
        padding: '8px 6px',
        '&:hover': {
            background: '#fff',
            color: '#3c4043',
            borderColor: '#b2b3b5',
        },
        '& a': {
            color: "inherit"
        }
    },
    // 栏目
    dycColumn: {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "stretch",
        marginTop: '2.4rem',
        border: 0,
        position: 'relative',
        '@media screen and (max-width: 800px)': {
            marginTop: '0.6rem'
        }
    },
    dycColumnMore: {
        display: 'flex',
        flex: '1 1 auto',
        textAlign: 'end',
        flexDirection: 'column'
    },
    dycSubtitle: {
        fontSize: '1rem',
        '@media screen and (max-width: 1023px)': {
            fontSize: '0.8rem'
        }
    },
    // 分页
    dycPagenation: {
        textAlign: "center",
        justifyContent: "center"
    },
    // 备案号
    dycIPC: {
        display: "flex",
        alignItems: "center",
    },
    dycFooter: {
        padding: '16px 16px',
        lineHeight: 3,
        fontSize: 13,
        color: '#8590a6'
    }
}));

function Index({ total, articles, labels, page }) {
    const classes = useStyles();
    const [location, setLocation] = useState(undefined)
    const [snackbarState, setSnackbarState] = useState(false)
    const [errMessage, setErrMessage] = useState("")
    useEffect(() => {
        if (!/(iPhone|Android|iPad|iPod|iOS)/i.test(navigator.userAgent)) {  
            getLocation()
        }  
    }, [])
    useEffect(() => {
        if (errMessage != "") {
            setSnackbarState(true)
        }
    }, [errMessage])
    /**
     * 
     * @param {string} latitude 
     * @param {string} longitude 
     */
    const getLocation = (latitude = "", longitude = "") => {
        GET({
            "url": `http://www.douyacun.com/api/tools/location?latitude=${latitude}&longitude=${longitude}`,
            "headers": {
                "token": "UgDS8nRousuEQ9LHXHQ2JaBCSbIn0iqE"
            }
        }).then(({ data }) => {
            setLocation(data)
        })
    }
    const closeSnackbar = () => {
        setSnackbarState(false)
    }
    return (
        <Layout leftDrawerDefaultDisplay={true}>
            <div className={classes.root}>
                <div className={classes.dycGrid}>
                    <main className={classes.main}>
                        <div className={classes.dycGridGap}>
                            {/* <Column title="Headlines" subtitle="Recommended based on your interests" more="More For you" /> */}
                            {
                                articles.map((item, key) => (
                                    <Topic
                                        key={key}
                                        article={item}
                                    />
                                ))
                            }
                            <div className={classes.dycGridColmn}>
                                <div className={classes.dycPagenation}>
                                    {
                                        parseInt(page) > 1 ?
                                            (
                                                <Button variant="outlined" href={`/?page=` + (parseInt(page) - 1)} style={{ marginRight: 30 }}>
                                                    上一页
                                                </Button>
                                            ) : ''
                                    }
                                    {
                                        parseInt(page) < Math.ceil(total / PAGE_SIZE) ?
                                            (<Button variant="outlined" href={`/?page=` + (parseInt(page) + 1)}>
                                                下一页
                                            </Button>) : ''
                                    }
                                </div>
                            </div>
                        </div>
                        <Snackbar
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            open={snackbarState}
                            autoHideDuration={6000}
                            onClose={closeSnackbar}
                            message={errMessage}
                            action={
                                <React.Fragment>
                                    <Button color="secondary" size="small" onClick={closeSnackbar}>
                                        知道了
                                    </Button>
                                    <IconButton size="small" aria-label="close" color="inherit" onClick={closeSnackbar}>
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </React.Fragment>
                            }
                        />
                    </main>
                    <aside className={classes.aside + ' ' + classes.dycGrid}>
                        {
                            location && location.hasOwnProperty("city") && location.hasOwnProperty("province") ?
                            (<div className={classes.dycGridColmn}> <Weather location={location} /> </div>) :
                            ""
                        }
                        <div className={classes.dycGridColmn}>
                            <div className={classes.dycAsideColumn}>
                                <div className={classes.dycAsideColumnTopic}>
                                    <Typography variant="h4">关键字</Typography>
                                </div>
                                <div className={classes.dycAsideTag}>
                                    {
                                        labels.map((item, key) => (
                                            <Button variant="outlined" className={classes.dycAsideTagButton} key={key}>
                                                <a href={`/search/articles?q=${item}`}><Typography variant="h6">{item}</Typography></a>
                                            </Button>
                                        ))
                                    }
                                </div>
                            </div>
                            <div className={classes.dycAsideColumn}>
                                <div className={classes.dycFooter}>
                                    <div className={classes.dycIPC}>
                                        <img src="/images/icp.png" style={{ width: 20, height: 20, marginRight: 8 }} />
                                        鲁ICP备20003688号
                                    </div>
                                    <div>
                                        联系我: douyacun@gmail.com
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </Layout>
    );
}

Index.getInitialProps = async ({ req, query }) => {
    let { page } = query;
    page = page > 0 ? page : 1;
    // console.log(req.connection.remoteAddress);
    const { data, total } = await GET({
        url: `/api/articles?page=${page}`,
        headers: {
            "User-Agent": req.headers["user-agent"]
        }
    }).then(resp => resp.data)
    const labels = await GET({ url: "/api/articles/labels" }).then(resp => resp.data);
    return { total, articles: data, labels, page: page }
}

export default Index;

