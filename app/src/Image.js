import { useState } from 'react';
import './Image.css';

function Image(props) {

    const [hoverState, setHoverState] = useState(false); //is image being hovered on

    let hoverStyle = hoverState //determine hover style based on state
        ? 'image-div-hover'
        : 'image-div-default'

    return ( 
        <div 
            className={hoverStyle}
            onMouseEnter={() => setHoverState(true)}
            onMouseLeave={() => setHoverState(false)}
            onClick = {props.expand}
            id={props.source.large2x}
        >
            <img src={props.source.large2x} alt='' id={props.source.large2x} name={props.author} />
        </div>
    );

}

export default Image;
