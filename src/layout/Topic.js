import React from 'react';
import Article from './Article';
import { SvgIcon } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
import { relative } from 'path';

const useStyles = makeStyles(theme => {
    return {
        dycGridColmn: {
            gridColumn: 'span 12',
        },
        dycMinHeight: {
            minHeight: 132,
        },
        dycPaddingRight: {
            paddingRight: 132,
        },
        dycFlexRow: {
            display: 'flex',
            flexDirection: 'row',
            position: 'relative',
        },
        dycViewImage: {
            position: 'absolute',
            top: 16,
            right: 16,
            bottom: 'auto',
            left: 'auto',
            zIndex: 1,
            width: 100,
            height: 100,
            borderRadius: 8,
            overflow: 'hidden',
            '&>img': {
                width: '100%',
                height: '100%'
            },
            '@media screen and (max-width: 540px)': {
                '&': {
                    width: 72,
                    height: 72
                }
            }
        },
        dycPlay: {
            position: 'absolute',
            top: '50%',
            right: 16,
            bottom: 'auto',
            left: '50%',
            zIndex: 1,
            width: 48,
            height: 48,
            fontSize: 48,
            opacity: 0.75,
            transition: 'opacity .25s ease-in-out',
            marginTop: -24,
            marginLeft: -24,
            color: '#fff',
        },
        // 话题
        dycTopic: {
            position: relative,
            boxShadow: "0 0 0 1px #EBEDEF !important",
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: "#fff",
            [theme.breakpoints.up('sm')]: {
                borderRadius: '8px',
                // border: theme.dycBorder,
                boxShadow: "none",
            },
        }
    }
});

function Topic({ article, isVideo = false, variant = "first", type = "article" }) {
    const classes = useStyles();
    // topic
    let root = [classes.dycGridColmn, classes.dycTopic, classes.dycMinHeight];
    const hasImage = Boolean(variant == 'highlight' ? false : article.cover)
    const hasVideo = hasImage && isVideo;

    // 视频播放按钮
    const PlayArrow = (props) => {
        return (<SvgIcon {...props}>
            <path d="M8 5v14l11-7z" /><path d="M0 0h24v24H0z" fill="none" />
        </SvgIcon>)
    }
    const ViewImage = (props) => (
        <a href="/">
            <figure className={classes.dycViewImage + ' ' + classes.dycFlexRow}>
                {
                    hasVideo ?
                        <PlayArrow className={classes.dycPlay} /> :
                        ''
                }
                <img src={props.image} />
            </figure>
        </a>
    )
    return (
        // 如果有图片 dycMinHeight
        <div className={root.join(' ')}>
            {
                hasImage ?
                    <ViewImage image={article.cover} /> :
                    ''
            }
            <Article
                article={article}
                variant={variant}
                type={type}
                style={hasImage ? { paddingRight: 132, minHeight: 132 } : {}}
                className={classes.root}
            />
        </div>
    );
}

export default Topic