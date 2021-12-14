import { useGlobalContext } from "../components/Store";

const HTMLWrapper = (content, globalIndexHTML) => {
    const header = globalIndexHTML.split("<!-- split -->")[0];
    const footer = globalIndexHTML.split("<!-- split -->")[1];
    return `
    ${header}
    ${content}
    ${footer}
    `;
};

export default HTMLWrapper;
