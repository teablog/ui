import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles'
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import toc from "markdown-it-toc-done-right";
import anchor from 'markdown-it-anchor';
import lists from 'markdown-it-task-lists';
import table from 'markdown-it-multimd-table';
import Typography from '@material-ui/core/Typography';
import Layout from '../../src/layout/Index';
import { parseCookies } from 'nookies';
import { GET } from "../../src/request";
import { useRouter } from 'next/router';
import '../../src/css/github-markdown.css';
import '../../node_modules/highlight.js/styles/github.css';


const useStyles = makeStyles(theme => ({
    root: {
        margin: 'auto',
        maxWidth: 980,
        minWidth: 200,
        padding: '16px 32px 32px 32px',
        marginTop: 32,
        position: 'relative',
    },
    bottom: {
        height: '3rem',
        textAlign: 'center',
        padding: '1rem 0'
    },
    title: {
        fontSize: 22,
        lineHeight: 1.4,
        marginBottom: 14
    },
    meta_content: {
        marginBottom: 22,
        wordWrap: "breakWord",
        wordBreak: "breakAll",
    },
    media_meta: {
        display: 'inline-block',
        verticalAlign: 'middle',
        margin: '0 10px 10px 0',
        fontSize: 15,
        '-webkit-tap-highlight-color': 'rgba(0,0,0,0)',
        color: 'rgba(0,0,0,0.3)'
    },
}))

function Helper({ }) {
    const classes = useStyles();
    const [content, setContent] = useState("");
    const router = useRouter();
    const md = new MarkdownIt({
        highlight: function (str, lang) {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return hljs.highlight(lang, str).value;
                } catch (__) { }
            }
            return ''; // use external default escaping
        },
    });
    useEffect(() => {
        const all = parseCookies();
        if (all.douyacun) {
            GET({
                "url": "/api/helper/token",
            }).then(({ data }) => {
                setContent(data)
            })
        } else {
            window.location = `/login?redirect_uri=` + escape(router.asPath)
        }
    })

    md.use(anchor)
    md.use(toc)
    md.use(lists)
    md.use(table)
    return (<Layout >
        <div className={classes.root}>
            <Typography variant="h2" className={classes.title}>Token</Typography>
            <article className="markdown-body" >
                <div dangerouslySetInnerHTML={{ __html: md.render(content) }}></div>
            </article>
        </div>
    </Layout >)
}

export default Helper