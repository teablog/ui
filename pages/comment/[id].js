import React from 'react';
import Gitment from '../../src/components/gitment';
import { POST, GET } from '../../src/request';

function Comment({messages, articleId}) {
    return (
        <Gitment articleId={articleId} messages={messages}/>
    )
}

Comment.getInitialProps = async ({ req, query }) => {
    const { id } = query
    const data = await GET({
        url: "/api/ws/article/messages",
        params: {
            article_id: id,
            sort: "asc"
        },
        headers: {
            Cookie: req.headers.cookie
        }
    }).then(({ data: { list, total } }) => {
        return list
    })
    return { messages: data, articleId: id}
}


export default Comment;