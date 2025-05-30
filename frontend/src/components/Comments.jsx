export default function Comments({ comments }) {
    return (
        <div>
            {comments.map(comment => (
                <div className="comment-container" key={comment._id}>
                    <div className="comment-author">{comment.postedBy?.username || "Unknown"}</div>
                    <div className="comment-content">{comment.content}</div>
                    <div className="comment-date">
                        {new Date(comment.dateTime).toLocaleString()}
                    </div>
                </div>
            ))}
        </div>
    );
}