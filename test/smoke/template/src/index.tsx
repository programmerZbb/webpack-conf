import React from 'react';
import ReactDOM from 'react-dom';

const A = () => {
    const test = 1;

    return (
        <div>
            page1 {test}
        </div>
    );
};

ReactDOM.render(<A />, document.querySelector('#root'));
