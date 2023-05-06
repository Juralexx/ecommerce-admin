import { createGlobalStyle } from 'styled-components';
import variablesColors from './variablesColors';
import variablesConfig from './variablesConfig';

const GlobalStyles = createGlobalStyle`
    ${variablesColors}
    ${variablesConfig}

    html {
        position        : relative;
        margin          : 0;
        padding         : 0;
        overflow-x      : hidden;
        scroll-behavior : smooth;
        font-size       : 14px;
        line-height     : 1.5;
    }

    body {
        width            : 100%;
        min-height       : 100vh;
        margin           : 0;
        padding          : 0;
        color            : var(--text);
        background-color : var(--body);
        font-family      : var(--font-fam1), var(--font-fam-list);
        scroll-behavior  : smooth;
        overflow         : hidden;
    }

    * {
        margin     : 0;
        padding    : 0;
        box-sizing : border-box;
    }

    ::selection {
        background-color : rgba(var(--primary-light-rgb), 0.15);
        color            : var(--primary-light);
    }

    ::-webkit-scrollbar {
        width  : 5px;
        height : 10px;
    }
    ::-webkit-scrollbar-button {
        width  : 0px;
        height : 0px;
    }
    ::-webkit-scrollbar-thumb {
        background    : var(--zinc-500);
        border        : 31px none #c1c1c1;
        border-radius : 1px;
    }
    ::-webkit-scrollbar-thumb:hover {
        background : var(--primary-light);
    }
    ::-webkit-scrollbar-thumb:active {
        background : var(--primary-light);
    }
    ::-webkit-scrollbar-track {
        background    : var(--bg-zero);
        border        : 0px solid var(--body);
        border-radius : 5px;
        width         : 5px;
    }
    ::-webkit-scrollbar-track:hover {
        background : transparent;
    }
    ::-webkit-scrollbar-track:active {
        background : transparent;
    }
    ::-webkit-scrollbar-corner {
        background : transparent;
    }

    ol,
    ul,
    li {
        list-style  : none;
        color       : var(--text);
    }

    p {
        color       : var(--text);
        font-size   : 1rem;
        line-height : 1.5;
    }

    strong {
        font-weight : 600;
    }

    a {
        color           : inherit;
        text-decoration : none;

        &.custom-link {
            position : relative;
            color    : var(--primary-light);
            &:hover {
                &:before {
                    content    : '';
                    position   : absolute;
                    bottom     : -2px;
                    width      : 100%;
                    height     : 1px;
                    background : var(--primary-light);
                }
            }
        }
    }

    input {
        &:-webkit-autofill,
        &:-webkit-autofill:focus {
            transition: background-color 600000s 0s, color 600000s 0s;
        }
    }

    small {
        color       : var(--text);
        font-size   : 13px;
        line-height : 1.2;
    }

    svg {
        color : var(--text);
    }

    h1,
    h2,
    h3,
    h4 {
        color          : var(--title);
        letter-spacing : -1px;

        * {
            font-size      : inherit;
            line-height    : inherit;
            color          : inherit;
            font-stretch   : inherit;
            letter-spacing : inherit;
        }
    }

    h1 {
        font-weight   : 600;
        line-height   : 1.125;
        font-size     : 2em;
        margin-bottom : 30px;
    }

    h2 {
        font-weight   : 600;
        line-height   : 1.125;
        font-size     : 1.75em;
        margin-bottom : 10px;
    }

    h3 {
        font-weight   : 500;
        font-size     : 1.5em;
        line-height   : 1.25;
        margin-bottom : 10px;
    }

    h4 {
        font-weight   : 500;
        font-size     : 1.25em;
        line-height   : 1.5;
        margin-bottom : 10px;
    }

    @media(max-width: 768px) {
        h1 {
            font-size     : 1.75rem;
            margin-bottom : 20px;
        }
        h2 {
            font-size     : 1.5rem;
            margin-bottom : 7px;
        }
        h3 {
            font-size : 1.3rem;
        }
        h4 {
            font-size : 1.15rem;
        }
    }

    .label {
        margin-bottom : 8px;
    }

    .bold {
        font-weight : 500;
    }

    .txt-sec {
        color : var(--text-secondary);
    }

    .border-primary {
        border : 1px solid var(--primary);
    }

    .form-label {
        display        : block;
        font-weight    : 500;
        font-size      : 1rem;
        line-height    : 1.5;
        letter-spacing : 0.00938em;
        color          : var(--text);
    }

    .has-discount {
        font-size       : 1rem;
        line-height     : 20px;
        text-decoration : line-through;
        color           : var(--text-secondary);
    }

    .price {
        font-size   : 20px;
        line-height : 20px;
        font-weight : 500;
    }
`;

export default GlobalStyles;