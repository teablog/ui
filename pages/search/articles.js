import React from 'react';
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography';
import Topic from '../../src/layout/Topic';
import Layout from '../../src/layout/Index';
import { GET } from '../../src/request';

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
        padding: '20px 0',
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        position: 'relative',

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
    dycFab: {
        marginLeft: 8,
        boxShadow: '0 1px 5px 0 rgba(0,0,0,0.16), 0 1px 2px 0 rgba(0,0,0,0.26)',
        '&:hover': {
            boxShadow: '0 1px 8px 0 rgba(0,0,0,0.2), 0 1px 3px 0 rgba(0,0,0,0.36)',
            background: 'inherit'
        }
    },
    dycGridColmn: {
        gridColumn: 'span 12',
    },
    // 分页
    dycPagenation: {
        textAlign: "center",
        justifyContent: "center"
    }
}));

const PAGE_SIZE = 10;

function Topics({ articles, q, page, total }) {
    const classes = useStyles();
    const TopicTitle = () => (
        <div className={classes.dycMain}>
            {/* 标题 */}
            <div className={classes.dycTopicTitle}>
                <Typography style={{ fontSize: '28px', fontWeight: 500, color: '#202124' }}>
                    {q}
                </Typography>
            </div>
        </div>
    );

    const nextPage = parseInt(page) + 1;
    const previousPage = parseInt(page) - 1;
    return (
        <Layout>
            <div className={classes.root}>
            <div className={classes.dycGrid}>
                    <div className={classes.dycGridColmn}>
                        {
                            Array.isArray(articles) && articles.length > 0 ?
                                (
                                    <React.Fragment>
                                        <TopicTitle />
                                        {/* 文章 */}
                                        <main className={classes.dycGrid}>
                                            {
                                                articles.map((item, key) => (
                                                    <Topic
                                                        key={key}
                                                        article={item}
                                                        variant="highlight"
                                                    />
                                                ))
                                            }
                                        </main>
                                    </React.Fragment>
                                ) :
                                <div>未找到任何结果。</div>
                        }
                    </div>
                    <div className={classes.dycGridColmn}>
                        <div className={classes.dycPagenation}>
                            {
                                parseInt(page) > 1 ?
                                    (
                                        <Button variant="outlined" href={`?q=${q}&page=${previousPage}`} style={{ marginRight: 30 }}>
                                            上一页
                                                </Button>
                                    ) : ''
                            }
                            {
                                parseInt(page) < Math.ceil(total / PAGE_SIZE) ?
                                    (<Button variant="outlined" href={`?q=${q}&page=${nextPage}`}>
                                        下一页
                                        </Button>) : ''
                            }
                        </div>
                    </div>
                    <div style={{ marginBottom: 10 }}></div>
                </div>
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

Topics.getInitialProps = async ({ query }) => {
    let { q, page } = query
    page = page ? page : 1
    const { data, total } = await GET({
        "url": `/api/articles/search`,
        "params": {
            'page': page,
            'q': q,
        }
    }).then(resp => {
        if (resp.code === 0) {
            return resp.data
        } else {
            return { "data": [], "total": 0 }
        }
    });
    return { articles: data, total, q: query['q'] }
}


export default Topics;