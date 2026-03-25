
import React from 'react';
import styled from 'styled-components';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &{
    text: string,
    size?: 'small' | 'medium' | 'large',
}

const BlackButton = ({text, size = 'medium', ...props} : ButtonProps) => {
    return (
        <StyledWrapper $size={size}>
            <button {...props}>{text}</button>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div<{ $size?: 'small' | 'medium' | 'large' }>`
    button {
        font-family: inherit;
        width: ${props => 
            props.$size === 'small' ? '10em' : 
            props.$size === 'large' ? '13em' : '11.5em'};
        background: transparent;
        height: ${props => 
            props.$size === 'small' ? '2.3em' : 
            props.$size === 'large' ? '3.1em' : '2.7em'};
        line-height: ${props => 
            props.$size === 'small' ? '2.1em' : 
            props.$size === 'large' ? '2.9em' : '2.5em'};
        position: relative;
        cursor: pointer;
        overflow: hidden;
        border: solid 1px #ffffff;
        transition: color 0.5s;
        z-index: 1;
        font-size: ${props => 
            props.$size === 'small' ? '14px' : 
            props.$size === 'large' ? '19px' : '17px'};
        border-radius: 30px;
        font-weight: 500;
        color: var(--color);
    }

    button:before {
        content: "";
        position: absolute;
        z-index: -1;
        background: var(--foreground);
        height: 150px;
        width: 300px;
        border-radius: 50%;
    }

    button:hover {
        color: var(--background);
    }

    button:before {
        top: 100%;
        left: 100%;
        transition: all 0.7s;
    }

    button:hover:before {
        top: -30px;
        left: -30px;
    }

    button:active:before {
        background: #c7c7c7ff;
        transition: background 0s;
    }`
;

export default BlackButton;