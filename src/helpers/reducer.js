/**
 * reducer.js
 * 
 * manages the global state of the app
 * Patterned from:
 * https://codeburst.io/global-state-with-react-hooks-and-context-api-87019cc4f2cf
 * 
 * @TODO:
 * - Add support for local saving of directories
 */

import { initialState } from "../components/Store";


const Reducer = (state, action) => {
    switch (action.type) {
        case 'ADD_COMPONENT_TO_PREVIEW':
            return {
                ...state,
                previewFiles: action.payload
            };

        case 'SET_PROJECT_FILES':
            return {
                ...state,
                projectFiles: action.payload
            };
        case 'SET_PROJECT_NAME':
            return {
                ...state,
                projectName: action.payload
            };

        case 'SET_PREVIEW_FILES':
            return {
                ...state,
                previewFiles: action.payload
            };

        case 'REMOVE_COMPONENT':
            return {
                ...state,
                previewFiles: state.previewFiles.filter(file => file.id !== action.payload)
            };


        case 'SET_PREVIEW_HTML':
            return {
                ...state,
                previewHTML: action.payload
            };

        case 'SET_GLOBAL_INDEX_HTML':
            // The main wrapper of the preview files
            return {
                ...state,
                globalIndexHTML: action.payload
            };
        // case 'ADD_POST':
        //     return {
        //         ...state,
        //         posts: state.posts.concat(action.payload)
        //     };
        
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload
            };
        case 'INIT':
            return initialState;
        default:
            return state;
    }
};

export default Reducer;