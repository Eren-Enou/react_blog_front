import React from 'react';

export default function Button({ color, step, handleClick }) {
    return (
        <button className={`btn btn-${color}`} onClick={(e) => handleClick(step)}>+{step}</button>
    );
};