import React from 'react';




const Loading = props => {
return(
    <div className={'loader'}>
        <h1>{props.heading}</h1>
        <div className="spinner-border spinner-admin-panel" role="status">
            <span className="sr-only">Loading...</span>
        </div> </div>
)
}


export default Loading;