import React, { useEffect, useRef, useState } from 'react'
import Button from './Button';
import Header from './Header'
import { useGlobalContext } from './Store';
import toast from 'react-simple-toasts';
import HTMLWrapper from '../helpers/HTMLwrapper';
import IconButton from './IconButton';
import listAllFilesAndDirs from '../helpers/listAllFilesAndDirs';
import RecursiveList from './RecursiveList';
import { faEdit, faEye } from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidv4 } from 'uuid';
const zip = require("@zip.js/zip.js");

// zip.configure({
//   useWebWorkers: false
// });

const ActionMenu = (props) => {

    return (
        <div className={`absolute inset-0 p-3 py-4 bg-white transform ${props.visible ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-200`}>
            {props.children}
        </div>
    )
}

export default function Action() {
    const [variantName, setVariantName] = useState('');
    const downloadAsHTMLRef = useRef();
    const downloadAsMJMLRef = useRef();
    const exportAsZipRef = useRef();
    const [state, dispatch] = useGlobalContext();
    const { projectName, previewHTML, previewFiles, projectFiles, globalIndexHTML, projectDir, variants, activeVariant, isUnsavedChanges } = state;
    const [isSaveAsMenuVisible, setSaveAsMenuVisible] = useState(false);

    const downloadHTML = (ref, data, fileType) => {
        const file = new Blob([data], { type: 'text/plain' });
        const link = document.createElement("a");
        link.download = `index.${fileType}`;
        link.href = URL.createObjectURL(file);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast('HTML download started');
    }


    const exportAsZip = async () => {
        const zipWriter = new zip.ZipWriter(new zip.Data64URIWriter("application/zip"));
        const components = (projectFiles.filter(file => file.name == 'components'))[0].files;

        for (const el of components) {
            const { handle, kind, name } = el;
            const file = await handle.getFile();
            const fileText = await file.text();
            const wrappedHTML = HTMLWrapper(fileText, globalIndexHTML);


            const inputBlob = new Blob(
                [wrappedHTML],
                { type: "text/plain" });
            await zipWriter.add(name, new zip.BlobReader(inputBlob));
            console.log('this happened')
        }

        // - close the ZipWriter object and get compressed data
        const dataURI = await zipWriter.close();
        // - log compressed data

        const link = document.createElement("a");
        link.download = 'components.zip';
        link.href = dataURI;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast('Export All components complete! ');
    }

    const writeVariantFiles = async (variantName, saveData) => {
        const variantsDirectoryHandle = await projectDir.getDirectoryHandle('variants', { create: true });
        const newDirectoryHandle = await variantsDirectoryHandle.getDirectoryHandle([variantName], { create: true });

        // Write JSON
        const JSONFileHandle = await newDirectoryHandle.getFileHandle(`${variantName}.json`, { create: true });
        const writableJSON = await JSONFileHandle.createWritable();
        await writableJSON.write(JSON.stringify(saveData));
        await writableJSON.close();

        // Write HTML
        const HTMLFileHandle = await newDirectoryHandle.getFileHandle(`${variantName}.html`, { create: true });
        const writableHTML = await HTMLFileHandle.createWritable();
        await writableHTML.write(previewHTML);
        await writableHTML.close();
    }

    const saveVariant = async () => {
        const today = new Date();
        const filteredFiles = previewFiles.map(file => {
            return file.name
        });

        const variantName = activeVariant.split('.')[0]

        console.log(`filteredFiles`, filteredFiles)
        const saveData = {
            name: variantName,
            content: filteredFiles,
            dateModified: today,
        }

        writeVariantFiles(variantName, saveData);

 
        // clear name
        // setVariantName('');
        toast(`Variant "${variantName}" updated!`);

        dispatch({
            type: 'SET_UNSAVED',
            payload: false
        });
    }

    const saveAsVariant = async () => {
        // get project handle
        const today = new Date();
        const filteredFiles = previewFiles.map(file => {
            return file.name
        });

        console.log(`filteredFiles`, filteredFiles)
        const saveData = {
            name: variantName,
            content: filteredFiles,
            dateModified: today,
        }
        // create file

        writeVariantFiles(variantName, saveData);
        // clear name
        setVariantName('');
        toast(`Variant "${variantName}" created!`);

        loadVariants();
        setSaveAsMenuVisible(false);

        dispatch({
            type: 'SET_UNSAVED',
            payload: false
        });
        dispatch({
            type: 'SET_ACTIVE_VARIANT',
            payload: `${variantName}.json`
        });

        // @TODO SET active variant
    }

    const loadVariants = async () => {
        if (!projectName) return;
        const variantsDirectoryHandle = await projectDir.getDirectoryHandle('variants', { create: true });

        const files = [
            ...await listAllFilesAndDirs(variantsDirectoryHandle, ['json'], [], true)
        ];

        dispatch({
            type: 'SET_VARIANTS',
            payload: files,
        })
    }

   

    const pickVariant = async ({ handle, kind, name }) => {

        // console.log(variant);
        const file = await handle.getFile();
        const text = await file.text();
        const { content } = JSON.parse(text);

        const components = projectFiles.find(x => x.name == 'components').files;
        console.log(components);


        let previewData = [];
        for (const i of content) {
            // get handles
            const component = components.find(x => x.name == i);

            if (component) {
                const file = await component.handle.getFile();
                const text = await file.text();
                const id = await uuidv4();

                previewData.push({
                    id,
                    name: component.name,
                    content: text
                });
            }
        }

        const load = () => {
            dispatch({
                type: 'SET_PREVIEW_FILES',
                payload: previewData
            });
    
            dispatch({
                type: 'SET_ACTIVE_VARIANT',
                payload: name
            });
            dispatch({
                type: 'SET_UNSAVED',
                payload: false
            });
        }

        if (isNavigatorEmpty || !isUnsavedChanges) {
            return load();
        }

        if (window.confirm('You have unsaved changes, are you sure you want to open another variant?')) {
            return load();
        } else {
        // Do nothing!
        }
    }

    useEffect(() => {
        loadVariants();
    }, [projectFiles])

    const isNavigatorEmpty = previewFiles.length <= 0;
    const isNotAVariant = !activeVariant;
    const isProjectOpened = projectName !== '';
    return (
        <section className="w-2/12 p-3 py-4 relative">
            <Header>Actions</Header>
            <Button disabled={isNavigatorEmpty || isNotAVariant || !isUnsavedChanges} icon="save" onClick={saveVariant} title="Save variant" className="mb-2 w-full" />
            <Button disabled={isNavigatorEmpty} icon="clone" onClick={() => setSaveAsMenuVisible(true)} title="Save as variant" className="mb-2 w-full" />
            <hr className="mb-2 w-full" />

            <Button icon="file-code" ref={downloadAsHTMLRef} onClick={() => downloadHTML(downloadAsHTMLRef, previewHTML, 'html')} title="Download HTML" className="mb-2 w-full" />
            <Header className="pt-5">Project Actions</Header>
            <Button disabled={!isProjectOpened} icon="archive" ref={exportAsZipRef} onClick={() => exportAsZip()} title="Export All Components" />
            {/* <Button ref={downloadAsMJMLRef} onClick={() => {}} title="Save as MJML" disabled/> */}
            <p className="text-gray-500 text-xs mb-3 pt-1">Generates an HTML file of each available component and exports it as a zip</p>

            {/* <hr /> */}

            <Header className="pt-5">Variants  <IconButton icon="sync" title="Sync files" onClick={loadVariants} /></Header>

            <ul>

                <RecursiveList
                    data={variants}
                    options={{
                        actions: [
                            {
                                actionTitle: 'Edit this variant',
                                action: pickVariant,
                                actionIcon: faEdit
                            }
                        ],
                        showFilesOnly: true,
                        activeVariant
                    }}
                />


            </ul>
            <ActionMenu visible={isSaveAsMenuVisible}>
                <Header>
                    <span>
                        <IconButton icon="arrow-left" className="mr-2" title="back" onClick={() => setSaveAsMenuVisible(false)} />
                        Save as variant
                    </span>
                </Header>
                <p className="text-gray-500 text-xs mb-3 p-2 bg-blue-100">
                    Creates a variant inside /variant folder on the root of selected project directory
                </p>
                <label
                    className="block uppercase tracking-wide text-gray-700 text-2xs font-bold mb-2"
                    for="file-name"
                >
                    Give your variant a name
                </label>
                <input
                    className="text-sm bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    id="file-name"
                    type="text"
                    value={variantName}
                    onChange={e => setVariantName(e.target.value)}
                    placeholder="the-variant-name"
                />
                <p className="text-gray-500 text-xs mb-3 pt-1">
                    Avoid spaces and dots, use only dashes and underscores
                </p>
                <Button icon="save" onClick={saveAsVariant} title="Save" className="mb-2" />

            </ActionMenu>


        </section>
    )
}
