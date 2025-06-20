import React from 'react';
import Rating from 'react-rating';
import emptyStar from '../assets/empty-star.png';
import goldStar from '../assets/gold-star.png';
function CustomRating({ value, onChange, readonly = false }) {
    return (
        <Rating
            initialRating={value}
            onChange={onChange}
            readonly={readonly}
            emptySymbol={
                <img
                    src={emptyStar}
                    alt="empty"
                    style={{ width: 28, height: 28 }}
                />
            }
            fullSymbol={
                <img
                    src={goldStar}
                    alt="full"
                    style={{ width: 28, height: 28 }}
                />
            }
        />
    );
}
export default CustomRating;