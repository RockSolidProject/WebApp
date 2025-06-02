import { Box, Typography, Card, CardContent } from '@mui/material';

export default function Comments({ comments }) {
    if (!comments || comments.length === 0) {
        return (
            <Typography color="text.secondary" sx={{ mt: 2 }}>
                Ni še komentarja.
            </Typography>
        );
    }
    return (
        <Box>
            {comments.map(comment => (
                <Card key={comment._id} sx={{ mb: 2, boxShadow: 2 }}>
                    <CardContent>
                        <Typography variant="subtitle2" color="primary">
                            {comment.postedBy?.username || "Neznano"}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            {comment.content}
                        </Typography>
                        {comment.image && (
                            <Box
                                component="img"
                                src={comment.image}
                                alt="Komentar"
                                sx={{
                                    maxWidth: '100%',
                                    maxHeight: 250,
                                    mt: 2,
                                    borderRadius: 2,
                                    boxShadow: 1
                                }}
                            />
                        )}
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                            {new Date(comment.dateTime).toLocaleString()}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
}