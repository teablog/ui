import React from 'react';
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import Button from '@material-ui/core/Button';
import Topic from '../../src/layout/Topic';
import Layout from '../../src/layout/Index';
import Icon from '../../src/layout/icon';
import { GET } from '../../src/request';
import { PAGE_SIZE } from '../../src/config';

const useStyles = makeStyles(theme => ({
    dycMargin: {
        margin: '0 3px',
    },
    // grid
    dycGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(12,1fr)',
        gridGap: '16px 32px',
        gridColumn: '1/span 12',
    },
    dycGridColmn: {
        gridColumn: 'span 12',
    },
    dycGridGap: {
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridGap: '16px 32px'
    },
    root: {
        maxWidth: 784,
        // width: 784,
        margin: 'auto',

        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        padding: '16px 32px 32px',
        transition: 'margin-left .25s cubic-bezier(0.4,0.0,0.2,1),visibility 0s linear 0s'
    },
    dycMain: {
        display: 'flex',
        padding: '38.4px 0',
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        position: 'relative'
    },
    dycTopicTitle: {
        display: 'flex',
        flexGrow: 1,
        flexShrink: 1,
        alignItems: 'flex-start',
        flexDirection: 'column',
        '&>div': {
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
        },
    },
    dycTopicCircle: {
        background: 'rgba(0,0,0,0)',
        color: 'rgba(0, 0, 0, 0.87)',
        width: 67.19,
        height: 67.19,
        borderRadius: '50%',
        marginRight: '19.2px',
        overflow: 'hidden',
        '&>svg': {
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }
    },
    dycFllowAndShare: {
        display: 'flex',
        alignItems: 'center',
        flexGrow: 0,
        flexShrink: 0,
        height: 67.188,
        marginLeft: 9.6
    },
    dycFllowAndShareIcon: {
        fontSize: 16,
        color: '#4285f4',
    },
    dycFab: {
        marginLeft: 8,
        boxShadow: '0 1px 5px 0 rgba(0,0,0,0.16), 0 1px 2px 0 rgba(0,0,0,0.26)',
        '&:hover': {
            boxShadow: '0 1px 8px 0 rgba(0,0,0,0.2), 0 1px 3px 0 rgba(0,0,0,0.36)',
            background: 'inherit'
        }
    },
    // 分页
    dycPagenation: {
        textAlign: "center",
        justifyContent: "center"
    }
}));

function Media({ articles, subtype, page, total }) {
    const classes = useStyles();
    const TopicIcon = Icon[subtype];
    const TopicTitle = () => (
        <div className={classes.dycMain}>
            {/* 标题 */}
            <div className={classes.dycTopicTitle}>
                <div>
                    <div className={classes.dycTopicCircle}>
                        <TopicIcon />
                    </div>
                    <div>
                        <Typography style={{ fontSize: '28px', fontWeight: 500, color: '#202124' }}>
                            {subtype}
                        </Typography>
                    </div>
                </div>
            </div>
            {/* 关注 & 分享 */}
            <div className={classes.dycFllowAndShare}>
                <Fab
                    variant='extended'
                    size='medium'
                    color='primary'
                    aria-label='add'
                    className={classes.dycFab}
                >
                    <Icon.start_border className={classes.dycFllowAndShareIcon + ' ' + classes.dycMargin} />
                    <Typography variant="body2" className={classes.dycMargin}>
                        关注
                    </Typography>
                </Fab>
                <Fab
                    variant='extended'
                    size='medium'
                    color='primary'
                    aria-label='add'
                    className={classes.dycFab}
                >
                    <Icon.share className={classes.dycFllowAndShareIcon + ' ' + classes.dycMargin} />
                    <Typography variant="body2" className={classes.dycMargin}>
                        分享
                    </Typography>
                </Fab>
            </div>
        </div>
    );

    return (
        <Layout>
            <div className={classes.root}>
                <TopicTitle />
                {/* 文章 */}
                <main className={classes.dycGrid}>
                    {
                        articles.map((item, key) => (
                            <Topic
                                key={key}
                                type={"video"}
                                article={item}
                            />
                        ))
                    }
                    <div className={classes.dycGridColmn}>
                        <div className={classes.dycPagenation}>
                            {
                                parseInt(page) > 1 ?
                                    (
                                        <Button variant="outlined" href={`?page=` + (parseInt(page) - 1)} style={{ marginRight: 30 }}>
                                            上一页
                                        </Button>
                                    ) : ''
                            }
                            {
                                parseInt(page) < Math.ceil(total / PAGE_SIZE) ?
                                    (<Button variant="outlined" href={`?page=` + (parseInt(page) + 1)}>
                                        下一页
                                        </Button>) : ''
                            }
                        </div>
                    </div>
                    <div style={{ marginBottom: 10 }}></div>
                </main>
                <style jsx global>
                    {`
                    a {
                        text-decoration: none;
                        color: #4285f4;
                        cursor: pointer;
                    }
                    figure, menu, p, time, h1, h2, h3, h4, h5, h6 {
                        margin: 0;
                        padding: 0;
                    }
                `}
                </style>
            </div>
        </Layout>
    )
}

Media.getServerSideProps = async ({ query }) => {
    let { subtype, page } = query
    page = page ? page : 1;
    const { data, total } = await GET({
        "url": `/api/media/subtype/${subtype}?page=${page}`
    }).then(resp => {
        if (resp.code === 0) {
            return resp.data
        } else {
            return { "data": {} }
        }
    })
    return { articles: data, subtype: subtype, page: page, total: total }
}


export default Media;