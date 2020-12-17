import React from 'react';
import Gitment from '../../src/components/gitment';
import { POST, GET } from '../../src/request';

function Comment({messages, articleId, messagesTotal}) {
    console.log(messagesTotal);
    return (
        <Gitment articleId={articleId} messages={messages} messagesTotal={100}/>
    )
}

Comment.getInitialProps = async ({ req, query }) => {
    const { id } = query
    const {list, total} = await GET({
        url: "/api/ws/article/messages",
        params: {
            article_id: id,
            sort: "asc"
        },
        headers: {
            Cookie: req.headers.cookie
        }
    }).then(({ data }) => {
        return data
    })
    return { messages: list, articleId: id, messagesTotal: total}
}


export default Comment;