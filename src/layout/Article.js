import React from 'react';
import {makeStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography';
import ArticleBookmark from './article_bookmark';

const useStyles = makeStyles(theme => ({
    dycArticle: {
        position: 'relative',
        '&:hover a': {
            textDecoration: "underline"
        },
        '&:hover .dycAttributeMenu': {
            opacity: 1
        },
    },
    dycCollapse: {
        '&:not(:first-of-type)': {
            display: 'none'
        },
        '@media screen and (max-width: 540px)': {
            '&': {
                display: 'none'
            }
        }
    },
    dycLink: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 5,
        cursor: 'pointer',
    },
    // 作者 & 时间 & 分享 & 收藏 & 更多
    dycAttribute: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'flex-start'
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
    dycTitle: {
        fontSize: '16px',
        [theme.breakpoints.up("sm")]: {
            fontSize: '18px',
        }
    },
    dycFirst: {
        padding: '16px 16px 0 16px',
        display: 'block',
        [theme.breakpoints.up("sm")]: {
            fontSize: '16px'
        }
    },
    dycAside: {
        margin: '14.4px 19.2px'
    },
    dycListItem: {
        padding: '0.875rem 2.4rem 0',
        '&:before': {
            position: 'absolute',
            top: 21,
            right: 'auto',
            bottom: 'auto',
            left: 20,
            zIndex: 1,
            content: '""',
            display: 'block',
            width: 4,
            height: 4,
            borderRadius: 2,
            background: '#4285f4',
        }
    },
    dycMinLine: {
        display: "-webkit-box",
        "-webkit-box-orient": "vertical",
        "-webkit-line-clamp": 2,
        "overflow": "hidden",
        "& em": {
            color: "red"
        }
    },
    dycAutoLine: {
        fontSize: '0.8rem',
        fontFamily: 'Google Sans Display,sans-serif',
        fontWeight: 400,
        lineHeight: 2.66,
        "& em": {
            color: "red"
        },
        [theme.breakpoints.up("sm")]: {
            fontSize: '0.9rem',
        }
    },
    description: {
        fontSize: '0.8rem',
        fontFamily: 'Google Sans Display,sans-serif',
        fontWeight: 400,
        lineHeight: 2.0,
        "-webkit-line-clamp": 3,
        '-webkit-box-orient': 'vertical',
        display: '-webkit-box',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        [theme.breakpoints.up("sm")]: {
            fontSize: '0.9rem',
        }
    }
}));

function Article({variant, className, style, stat, article, type}) {
    const classes = useStyles();
    article = article ? article : {}

    let root = [classes.dycArticle];

    if (variant == 'listItem') {
        root.push(classes.dycListItem);
    } else if (variant == 'aside') {
        root.push(classes.dycAside);
    } else if (variant == 'first' || variant == 'highlight') {
        root.push(classes.dycFirst);
    }
    // 收起
    if (!stat) {
        root.push(classes.dycCollapse)
    }
    root.push(className);
    return (<article className={root.join(' ')} style={style}>
        <a href={`/${type}/${article.id}`} target="_blank" className={classes.dycLink}></a>
        <Typography variant="h3" className={classes.dycTitle} color="textPrimary">
            <a href={`/${type}/${article.id}`} style={{color: "inherit"}}>
                {article ? article.title : ''}
                {article && article.rate ? '   ' + article.rate + '分' : ''}
            </a>
        </Typography>
        <div>
            <ArticleBookmark
                author={article ? article.topic : ''}
                last_edit_time={article.last_edit_time}
                rate={article.rate}
                type={type}
            />
            {
                variant == 'highlight' && article.highlight ?
                    (
                        <Typography className={classes.dycAutoLine}>
                            <span dangerouslySetInnerHTML={{__html: article.highlight.join("<li>")}}></span>
                        </Typography>
                    ) :
                    (
                        <Typography className={classes.description}>
                            {article.description}
                        </Typography>
                    )
            }
        </div>
    </article>);
}

export default Article;