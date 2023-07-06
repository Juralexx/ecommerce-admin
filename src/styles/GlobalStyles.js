import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
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