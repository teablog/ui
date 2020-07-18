import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Link from 'next/link';
import ArticleBookmark from '../../src/layout/ArticleBookmark'
import Router from 'next/router';
import Layout from '../../src/layout/Index';

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 1176,
        margin: 'auto',
        padding: '16px 32px',
        position: 'relative',
        height: '100%',
        '@media screen and (max-width: 1736px)': {
            'dyc-app[open-and-visible="true"] &': {
                marginLeft: '280px'
            }
        }
    },
    main: {
        marginTop: 38.4,
    },
    paddingBottom: {
        paddingBottom: 15.360,
    },
    borderBottom: {
        borderBottom: '1px solid #dadce0'
    },
    dycTabs: {
        justifyContent: 'start',
        borderBottom: '1px solid #e8e8e8',
    },
    dycGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(12,1fr)',
        gridGap: '16px 32px',
        gridColumn: '1/span 12',
        '&>div': {
            gridRowGap: 32,
        }
    },
    dycGridRowGap: {
        gridRowGap: 32,
    },
    dycGridColumn12: {
        gridColumn: 'span 12',
    },
    dycGridColumn: {
        gridColumn: 'span 4',
        '@media screen and (max-width: 800px)': {
            '&': {
                gridColumn: 'span 6',
            }
        },
        '@media screen and (max-width: 560px)': {
            '&': {
                gridColumn: 'span 12',
            }
        }
    },
    dycGridColumn1: {
        gridColumn: '1/span 1',
    },
    dycGridTemplateColumns: {
        gridTemplateColumns: '1fr 16px auto'
    },
    dycCoverage: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 5,
        cursor: 'pointer'
    },
    dycArticle: {
        position: 'relative',
        display: 'grid',
        gridColumnGap: 0,
        gridRowGap: 0,
        '&:hover a': {
            textDecoration: "underline"
        },
        '&:hover .dycAttributeMenu': {
            opacity: 1
        },
    },
    dycArticleGap: {
        paddingTop: 8,
    },
    dycFlexCenter: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        verticalAlign: 'middle'
    },
    dycImage: {
        width: 100,
        height: 100,
        overflow: 'hidden',
        gridColumn: '3/3',
        gridRow: '1/span 5',
        borderRadius: 8,
        '&>img': {
            width: '100%',
            heigth: '100%'
        }
    },
    dycTab: {
        // position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        color: 'inherit'
    }
}));

function Bookmarks() {
    const classes = useStyles();
    const [tabStat] = React.useState(1);

    function handleChange(event, newValue) {
        Router.push('/my/library');
    }

    const AntTab = withStyles(theme => ({
        root: {
            textTransform: 'none',
            minWidth: 12,
            fontWeight: 500,
            fontSize: 18,
            color: '#5f6368',
            opacity: 0.8,
            margin: 0,
            padding: '6px 19.2px',
            '&:hover': {
                opacity: 1,
            },
            '&$selected': {
                color: theme.palette.secondary.main,
                fontWeight: theme.typography.fontWeightMedium,
            },
            '&:focus': {
                color: '#5f6368',
            },
        },
        selected: {},
    }))(props => <Tab disableRipple {...props} />);

    const Article = () => {
        const root = [classes.dycGridTemplateColumns, classes.dycGridColumn, classes.dycArticle].join(' ')
        return (<article className={root}>
            <Link href="/" >
                <a className={classes.dycCoverage}></a>
            </Link>
            <figure className={classes.dycFlexCenter + ' ' + classes.dycImage}>
                <img src="https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2548374060.webp" />
            </figure>
            <div className={classes.dycFlexCenter}>
                <img style={{ marginRight: 5 }} src="https://encrypted-tbn0.gstatic.com/faviconV2?url=http://news.dwnews.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL" />
                <Typography variant="caption">
                    多维网
                </Typography>
            </div>
            <Typography variant="h4" className={classes.dycGridColumn1 + ' ' + classes.dycArticleGap}>
                <Link href="/">
                    <a style={{ color: 'inherit' }}>
                        英外交大臣：英国欢迎中国发展要避免不必要的冷战
                    </a>
                </Link>
            </Typography>
            <div className={classes.dycGridColumn1 + ' ' + classes.dycArticleGap}>
                <ArticleBookmark />
            </div>
        </article>);
    }

    const ArticleContainer = () => {
        const root = [classes.dycGrid, classes.main, classes.dycGridRowGap].join(' ');
        return (<main className={root}>
            {
                [1, 2, 3, 4, 5, 6, 7, 8, 9].map((item, key) => (
                    <Article key={key} />
                ))
            }
        </main>)
    }

    return (
        <Layout>
            <div className={classes.root}>
                <Tabs
                    value={tabStat}
                    onChange={handleChange}
                    indicatorColor="secondary"
                    className={classes.dycTabs}
                    TabIndicatorProps={{
                        style: {
                            borderRadius: '5px 5px 0 0',
                            height: 3
                        }
                    }}
                >
                    <AntTab label={(<Link href="/my/library"><a className={classes.dycTab}>收藏夹</a></Link>)} />
                    <AntTab label={(<Link href="/my/bookmarks"><a className={classes.dycTab}>已保存的文章</a></Link>)} />
                </Tabs>
                <ArticleContainer />
            </div>
        </Layout>
    );
}

export default Bookmarks;