import { css } from "styled-components";


const variablesConfig = css`
    :root {
        --rounded-xs   : 0.125rem;
        --rounded-sm   : 0.375rem;
        --rounded-md   : 0.375rem;
        --rounded-lg   : 0.5rem;
        --rounded-xl   : 0.75rem;
        --rounded-2xl  : 1rem;
        --rounded-3xl  : 1.5rem;
        --rounded-full : 9999px;

        --shadow-2xl : 0 25px 50px -12px rgb(0 0 0 / 0.25);
        --shadow-xl  : 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
        --shadow-lg  : 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
        --shadow-md  : 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        --shadow-sm  : 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
        --shadow-xs  : 0 1px 2px 0 rgb(0 0 0 / 0.05);

        --shadow-top    : 0 -12px 20px -2px rgba(0, 0, 0, 0.10);
        --shadow-bottom : 0 12px 8px -5px rgba(0, 0, 0, 0.05);
        --shadow-left   : 8px 0 15px -5px rgb(0 0 0 / 15%);
        --shadow-right  : -8px 0 8px -3px rgba(0, 0, 0, 0.25);

        --shadow-inner      : inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
        --shadow-relief     : inset 0 1px 0 0 hsl(0deg 0% 100% / 5%);
        --shadow-lg-colored : 0 10px 15px -3px rgba(22, 107, 255, 0.1);
        --shadow-xl-colored : 0 20px 25px -5px rgba(22, 107, 255, 0.1);

        --xs : 576px;
        --sm : 768px;
        --md : 992px;
        --lg : 1200px;
        --xl : 1400px;

        --font-fam-list : -apple-system, system-ui, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
        --font-fam1     : 'Mona Sans', var(--font-fam-list);
        --font-fam2     : 'Philosopher', var(--font-fam-list);

        --easing     : cubic-bezier(0.645, 0.045, 0.355, 1);
        --transition : all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
    }
`

export default variablesConfig