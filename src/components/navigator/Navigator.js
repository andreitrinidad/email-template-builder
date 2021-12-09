import { useCallback, useState } from 'react';
import update from 'immutability-helper';
import { Card } from './Card';
import Button from '../Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderOpen, faCode, faAngleRight, faAngleDown } from '@fortawesome/free-solid-svg-icons'









// return null;

// }
export const Navigator = ({ files, setFiles, setIndexHTML }) => {
    const [srcFiles, setSrcFiles] = useState([]);

    const RecursiveList = ({ data }) => {

        console.log(`srcFiles`, data);
        const addToNavigator = async (item) => {
            // alert(item.name);
            const fileData = await item.handle.getFile();
            const text = await fileData.text()
    
    
            const _newData = [...files];
            _newData.push({
                name: item.name,
                content: text
            });
            setFiles(_newData);
    
        }
    
        return data.map(item => {
            if (item.kind === 'file') {
                return <li className="ml-3" onClick={() => addToNavigator(item)} >{item.name}</li>
            }
    
            if (item.kind == 'directory') {
                return <li className="ml-3">{item.name}
                    <ul>
                        <RecursiveList data={item.files} />
                    </ul>
                </li>
            }
        })
    };

    // Card Functions
    const moveCard = useCallback((dragIndex, hoverIndex) => {
        const dragCard = files[dragIndex];
        setFiles(update(files, {
            $splice: [
                [dragIndex, 1],
                [hoverIndex, 0, dragCard],
            ],
        }));
    }, [files]);

    const renderCard = (card, index) => {
        return (<Card key={card.name} index={index} id={card.name} text={card.name} moveCard={moveCard} />);
    };

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
        const dirHandle = await window.showDirectoryPicker();

        const srcHandle = await dirHandle.getDirectoryHandle('src')

        console.log(`dirHandle`, dirHandle);

        const globalHandle = await srcHandle.getDirectoryHandle('global');

        console.log(`globalHandle`, globalHandle)

        const indexFileHandle = await globalHandle.getFileHandle('index.html');


        const indexFile = await indexFileHandle.getFile();

        console.log(`indexFile`, indexFile)
        const indexFileText = await indexFile.text();

        const files = [
            ...await listAllFilesAndDirs(srcHandle)
        ];


        // console.log(`files`, files);

        setSrcFiles(files);
        setIndexHTML(indexFileText);


    }

    return (<>

        <section className="w-2/8 p-6 flex-1">
            <h2 className="text-lg font-bold mb-3">Navigator</h2>
            <ul>{files.map((card, i) => renderCard(card, i))}</ul>
            {/* <ul>
              {files.map(file => <li className="p-3 border-2 border-dotted border-black">{file.name}</li>)}
            </ul> */}

            <ul>

                {/* {directoryFiles.map((file, i) => {
              return (
                <li key={i}>{file}</li>
              )
            })}
         */}
            </ul>
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">Components</h2>

                <div
                    className="ml-4 text-xs inline-flex items-center font-bold leading-sm px-3 py-1 rounded-full bg-purple-100 text-purple-600"
                >
                    /src
                </div>
            </div>

            <Button onClick={openDir}><FontAwesomeIcon icon={faFolderOpen} className="mr-2" />Open Project</Button>
            <span>Open Project Directory</span>
            <RecursiveList data={srcFiles} />
        </section>


    </>);

};
