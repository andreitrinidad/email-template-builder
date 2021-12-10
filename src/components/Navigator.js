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

export const Navigator = () => {
    const [state, dispatch] = useContext(GlobalContext);
    const { projectFiles, previewFiles } = state;

    const RecursiveList = ({ data }) => {
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
            })
        }

        return data.map((item, i) => {
            if (item.kind === 'file') {
                return (
                    <li key={i}
                        className="text-xs group px-3 p-1 hover:bg-gray-100 relative cursor-pointer"
                        onClick={() => addToNavigator(item)} >
                        {item.name.split('.')[0]}
                        <div className="absolute top-1/2 right-2 transform -translate-y-1/2 hidden group-hover:inline-flex items-center">
                            <span className="flex text-2xs items-center font-bold leading-sm px-1 rounded-sm bg-purple-100 text-purple-600 mr-2">{item.name.split('.')[1]}</span>
                            <FontAwesomeIcon icon={faFileImport} className="text-gray-600" />
                        </div>
                    </li>)
            }

            if (item.kind == 'directory') {
                return <li className="text-xs" key={i}>
                    <span className="block bg-gray-100 p-1 px-2 font-bold text-purple-600" >/{item.name}</span>

                    <ul className="cursor-default">
                        <RecursiveList data={item.files} />
                    </ul>
                </li>
            }
        })
    };

    // Card Functions
    const moveCard = useCallback((dragIndex, hoverIndex) => {
        const dragCard = previewFiles[dragIndex];
        const _previewFiles = update(previewFiles, {
            $splice: [
                [dragIndex, 1],
                [hoverIndex, 0, dragCard],
            ],
        });

        dispatch({
            type: 'SET_PREVIEW_FILES',
            payload: _previewFiles
        });
    }, [previewFiles]);



    // const renderCard = (card, index) => {
    //     return (<Card key={card.id} index={index} id={card.id} text={card.name} moveCard={moveCard}/>);
    // };

    const whiteListDirectories = ['src', 'components', 'global'];
    const whiteListFiles = ['mjml', 'html'];

    const listAllFilesAndDirs = async (dirHandle) => {
        const files = [];
        for await (let [name, handle] of dirHandle) {
            const { kind } = handle;
            if (handle.kind === 'directory') {
                if (whiteListDirectories.includes(name)) {
                    files.push({ name, handle, kind, files: [...await listAllFilesAndDirs(handle)] });
                }
            } else {
                const fileType = name.split('.')[1];
                if (whiteListFiles.includes(fileType)) {
                    files.push({ name, handle, kind });
                }
            }
        }
        return files;
    }

    // Directory open 
    const openDir = async () => {
        // Get Directory Handles
        const dirHandle = await window.showDirectoryPicker();
        console.log('dir', dirHandle);
        dispatch({
            type: 'SET_PROJECT_NAME',
            payload: dirHandle.name,
        })
        const srcHandle = await dirHandle.getDirectoryHandle('src')

        // Get Global Index HTML
        const globalHandle = await srcHandle.getDirectoryHandle('global');
        const indexFileHandle = await globalHandle.getFileHandle('index.html');
        const indexFile = await indexFileHandle.getFile();
        const indexFileText = await indexFile.text();
        // setIndexHTML(indexFileText);
        dispatch({
            type: 'SET_GLOBAL_INDEX_HTML',
            payload: indexFileText,
        })

        // Get Project Folder Files
        const files = [
            ...await listAllFilesAndDirs(srcHandle)
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
                <div className="absolute top-0 bottom-0 right-0 w-6 hidden group-hover:inline-flex items-center justify-center cursor-pointer hover:bg-red-100"  onClick={() => onClick(id)} >
                    <FontAwesomeIcon icon={faTrash} className="text-red-600" />
                </div>
            </li>
        )
    });

    const SortableContainer = sortableContainer(({ children }) => {
        return <ul>{children}</ul>;
    });

    const onSortEnd = ({ oldIndex, newIndex, collection, isKeySorting }) => {
        console.log(`oldIndex`, oldIndex)
        console.log(`newIndex`, newIndex)
        // arrayMoveImmutable(previewFiles, oldIndex, newIndex);

        // console.log(`items`, arrayMoveImmutable(previewFiles, oldIndex, newIndex));

        dispatch({
            type: 'SET_PREVIEW_FILES',
            payload: arrayMoveImmutable(previewFiles, oldIndex, newIndex)
        });
    };

    const removeCard = (index) => {
        dispatch({
            type: 'REMOVE_COMPONENT',
            payload: index
        });

        // alert(index);
    };


    return (
        <>
            <section className="w-2/8 p-6 px-2 flex-1 select-none">
                <div className="panel mb-6">
                    <Header>Navigator</Header>
                    {previewFiles.length <= 0 && <p className="text-gray-500 text-sm mb-3">Click a component below to add in here</p>}
                    {/* <ul>{previewFiles.map((card, i) => renderCard(card, i))}</ul> */}

                    <SortableContainer onSortEnd={onSortEnd} distance={1} helperClass="dragging">
                        {previewFiles.map((file, index) => (
                            <SortableItem key={file.id} index={index} id={file.id} value={file.name} onClick={removeCard}/>
                        ))}
                    </SortableContainer>
                    {/* <Button onClick={() => removeCard(0)} title="Remove 0"/> */}
                </div>


                <div className="">
                    <Header>Project Files</Header>
                    {
                        isProjectOpened ? (<ul>
                            <RecursiveList data={projectFiles} />
                        </ul>) : (<>
                        <Button onClick={openDir} title="Open Project" icon="folder-open" />
                        <p className="text-gray-500 text-sm mb-3 pt-3">Open an email template project that uses the
                        &nbsp;<a target="_blank" className="underline" href="https://github.com/andreitrinidad/marketo-boilerplate">Marketo Boilerplate&nbsp;<FontAwesomeIcon icon={faExternalLinkAlt}/></a>
                         </p>
                        </>)
                    }
                </div>



            </section>
        </>
    );

};
