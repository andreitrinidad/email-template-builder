/**
 * Store.js
 * 
 * a HOC (higher order component) that has the context provider
 * Patterned from:
 * https://codeburst.io/global-state-with-react-hooks-and-context-api-87019cc4f2cf
 * 
 * @TODO:
 * - Add support for local saving of directories
 */

import React, { createContext, useContext, useReducer } from "react";
import Reducer from "../helpers/reducer";

export const initialState = {
    projectFiles: [],
    previewFiles: [],
    previewHTML: `It's so empty here.`,
    projectName: '',
    projectDir: {},
    variants: [],
    activeVariant: '',
    isUnsavedChanges: false,
    previewSettings: [
        {
            text: '375px',
            icon: 'mobile',
            value: '375px'
        },
        {
            text: '700px',
            icon: 'mobile',
            value: '700px'
        },
        {
            text: 'Full',
            icon: 'mobile',
            value: '100%'
        },
    ],
    globalIndexHTML: '<html><!-- split --></html>',
    error: null
};

const Store = ({ children }) => {
    const [state, dispatch] = useReducer(Reducer, initialState);
    return (
        <GlobalContext.Provider value={[state, dispatch]}>
            {children}
        </GlobalContext.Provider>
    )
};

export const GlobalContext = createContext(initialState);

export const useGlobalContext = () => {
    const [state, dispatch] = useContext(GlobalContext);
    return [state, dispatch];
}
export default Store;
