import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import DycIcon from '../../src/layout/icon';
import Link from 'next/link';
import Router from 'next/router';
import Layout from '../../src/layout/Index'

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
    dycGridTemplateColumns: {
        gridTemplateColumns: '1fr 16px auto'
    },
    dycTopic: {
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: 9.6,
        width: 'auto',
        maxWidth: '95%',
        border: '1px solid #dadce0',
        width: 'auto',
        position: 'relative',
        '&:hover': {
            borderColor: '#b2b3b5'
        }
    },
    dycLogo: {
        height: '4.7rem',
        width: '4.7rem',
        margin: 19.2,
        borderRadius: 4,
        overflow: 'hidden',
        '&>svg': {
            height: '100%',
            width: '100%',
        }
    },
    dycTopicFlex: {
        display: 'inline-flex',
        justifyContent: 'center',
        maxWidth: '100%',
        overflow: 'hidden',
        flexGrow: 1,
        minHeight: '4rem',
    },
    dycTopicMore: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '4rem',
        minWidth: '4rem',
        zIndex: 6,
        flexShrink: 0,
        '&>div': {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            borderRadius: '1rem',
            width: 29,
            height: 29,
            cursor: 'pointer',
            '&:before': {
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                zIndex: 2,
                content: '""',
                display: 'block',
                border: '1px solid transparent',
                transition: 'border-color .25s ease-in-out',
            },
            '&>svg': {
                color: '#80868b',
                fontSize: '14px'
            },
            '&:hover': {
                boxShadow: '0 1px 1px 1px rgba(189,193,198,0.502)',
                transition: 'box-shadow .15s ease-in-out'
            }
        }
    },
    dycTopicTitle: {
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        maxWidth: '100%',
        overflow: 'hidden',
        flexGrow: 1,
        minHeight: '4rem'
    },
    dycCoverage: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 5,
        cursor: 'pointer'
    }
}));

function Library() {
    const classes = useStyles();
    const [tabStat, setTabStat] = React.useState(0);
    function handleChange(event, newValue) {
        Router.push('/my/bookmarks');
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

    const Title = ({ title }) => {
        const root = [classes.dycGridColumn12, classes.paddingBottom, classes.borderBottom].join(' ');
        return (
            <div className={root}>
                <Typography variant='h2'>
                    {title}
                </Typography>
            </div>
        )
    };
    const Topic = ({ topic }) => {
        const root = [classes.dycGridColumn, classes.dycTopic].join(' ');
        const Logo = DycIcon[topic];
        return (
            <div className={root}>
                <Link href="/topics/redis" >
                    <a className={classes.dycCoverage}></a>
                </Link>
                <div className={classes.dycLogo}>
                    <Logo />
                </div>
                <div className={classes.dycTopicFlex}>
                    <div className={classes.dycTopicTitle}>
                        <Typography variant="h5">
                            {topic}
                        </Typography>
                    </div>
                    <span className={classes.dycTopicMore}>
                        <div>
                            <DycIcon.more_vert />
                        </div>
                    </span>
                </div>
            </div>
        )
    }
    const TopicContainer = () => {
        const root = [classes.dycGrid, classes.main, classes.dycGridRowGap].join(' ');
        const topics = ['redis', 'mysql', 'golang'];
        return (
            <main className={root}>
                <Title title="主题" />
                {
                    topics.map((topic, key) => (
                        <Topic topic={topic} key={key} />
                    ))
                }
            </main>
        )
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
                    <AntTab label="收藏夹" />
                    <AntTab label="已保存的文章" />
                </Tabs>
                <TopicContainer />
            </div>
        </Layout>
    );
}

export default Library;