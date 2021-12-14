import { useCallback, useContext, useState } from 'react';
import update from 'immutability-helper';
import Button from './Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Header from './Header';
import { GlobalContext, useGlobalContext } from './Store';
import { faExternalLinkAlt, faFileImport, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidv4 } from 'uuid';
import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import { arrayMoveImmutable } from 'array-move';
import Iconbutton from './IconButton';
import IconButton from './IconButton';
import listAllFilesAndDirs from '../helpers/listAllFilesAndDirs';
import RecursiveList from './RecursiveList';

export const Navigator = () => {
    const [state, dispatch] = useContext(GlobalContext);
    const { projectFiles, previewFiles } = state;

    const addToNavigator = async (item) => {
        const fileData = await item.handle.getFile();
        const text = await fileData.text();
        const id = await uuidv4();

        const _newData = [...previewFiles];
        _newData.push({
            id,
            name: item.name,
            content: text
        });

        dispatch({
            type: 'ADD_COMPONENT_TO_PREVIEW',
            payload: _newData
        });

        dispatch({
            type: 'SET_UNSAVED',
            payload: true
        });

        
    }

    const whiteListDirectories = ['src', 'components', 'global'];
    const whiteListFiles = ['mjml', 'html'];


    // Directory open 
    const openDir = async () => {
        // Get Directory Handles
        const dirHandle = await window.showDirectoryPicker();
        console.log('dir', dirHandle);
        dispatch({
            type: 'SET_PROJECT_NAME',
            payload: dirHandle.name,
        })
        dispatch({
            type: 'SET_PROJECT_DIR',
            payload: dirHandle,
        })


        const srcHandle = await dirHandle.getDirectoryHandle('src')

        // Get Global Index HTML
        const globalHandle = await srcHandle.getDirectoryHandle('global');
        const indexFileHandle = await globalHandle.getFileHandle('index.html');
        const indexFile = await indexFileHandle.getFile();
        const indexFileText = await indexFile.text();
        dispatch({
            type: 'SET_GLOBAL_INDEX_HTML',
            payload: indexFileText,
        })

        // Get Project Folder Files
        const files = [
            ...await listAllFilesAndDirs(srcHandle, whiteListFiles, whiteListDirectories)
        ];
        dispatch({
            type: 'SET_PROJECT_FILES',
            payload: files,
        })
    }

    // Conditionals
    const isProjectOpened = projectFiles.length > 0;

    const SortableItem = sortableElement(({ value, onClick, id }) => {
        return (
            <li
                className="text-xs group px-3 p-1 hover:bg-gray-100 relative active:bg-purple-400 cursor-move"
            >
                {value.split('.')[0]}
                <div className="absolute top-0 bottom-0 right-0 w-6 hidden group-hover:inline-flex items-center justify-center cursor-pointer hover:bg-red-100" onClick={() => onClick(id)} >
                    <FontAwesomeIcon icon={faTrash} className="text-red-600" />
                </div>
            </li>
        )
    });

    const SortableContainer = sortableContainer(({ children }) => {
        return <ul>{children}</ul>;
    });

    const onSortEnd = ({ oldIndex, newIndex }) => {
        dispatch({
            type: 'SET_PREVIEW_FILES',
            payload: arrayMoveImmutable(previewFiles, oldIndex, newIndex)
        });

        dispatch({
            type: 'SET_UNSAVED',
            payload: true
        });
    };

    const removeCard = (index) => {
        dispatch({
            type: 'REMOVE_COMPONENT',
            payload: index
        });

        dispatch({
            type: 'SET_UNSAVED',
            payload: true
        });
    };

    return (
        <>
            <section className="w-2/8 p-3 py-4 flex-1 select-none">
                <div className="panel mb-6">
                    <Header>Navigator</Header>
                    {previewFiles.length <= 0 && <p className="text-gray-500 text-sm mb-3">Click a component below to add in here</p>}
                    <SortableContainer onSortEnd={onSortEnd} distance={1} helperClass="dragging">
                        {previewFiles.map((file, index) => (
                            <SortableItem key={file.id} index={index} id={file.id} value={file.name} onClick={removeCard} />
                        ))}
                    </SortableContainer>
                </div>
                <div className="">
                    <Header>
                        Project Files
                        <IconButton icon="sync" title="Sync files" />

                    </Header>
                    {
                        isProjectOpened ? (<ul>
                            <RecursiveList data={projectFiles} options={{
                                actions: [
                                    {
                                        actionTitle: 'Add to Navigator',
                                        action: addToNavigator,
                                        actionIcon: faFileImport
                                    }
                                ]
                            }} />
                        </ul>) : (<>
                            <Button onClick={openDir} title="Open Project" icon="folder-open" />
                            <p className="text-gray-500 text-sm mb-3 pt-3">Open an email template project that uses the
                                &nbsp;<a target="_blank" className="underline" href="https://github.com/andreitrinidad/marketo-boilerplate">Marketo Boilerplate&nbsp;<FontAwesomeIcon icon={faExternalLinkAlt} /></a>
                            </p>
                        </>)
                    }
                </div>
            </section>
        </>
    );
};
