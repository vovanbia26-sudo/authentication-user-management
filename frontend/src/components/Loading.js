import React from 'react';
import './Loading.css';

const Loading = ({ message = 'Loading...' }) => {
    return ( <
        div className = "loading-container" >
        <
        div className = "spinner" > < /div> <
        p > { message } < /p> <
        /div>
    );
};

export default Loading;