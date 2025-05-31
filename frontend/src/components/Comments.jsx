export default function Comments({ comments }) {
    if (!comments || comments.length === 0) {
        return <div>No comments yet.</div>;
    }
    return (
        <div>
            {comments.map(comment => (
                <div className="comment-container" key={comment._id}>
                    <div className="comment-author">{comment.postedBy?.username || "Unknown"}</div>
                    <div className="comment-content">{comment.content}</div>
                    {comment.image && (
                        <img
                            src={comment.image}
                            alt="Comment"
                            style={{
                                maxWidth: '100%',
                                maxHeight: 250,
                                marginTop: 10,
                                borderRadius: 8,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                            }}
                        />
                    )}
                    <div className="comment-date">
                        {new Date(comment.dateTime).toLocaleString()}
                    </div>
                </div>
            ))}
        </div>
    );
}