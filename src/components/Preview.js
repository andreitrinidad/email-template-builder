/* eslint-disable jsx-a11y/iframe-has-title */
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import Button from './Button'
import Header from './Header'
import { GlobalContext, useGlobalContext } from './Store';
import Editor from 'react-simple-code-editor';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Highlight, { defaultProps } from "prism-react-renderer";
import github from 'prism-react-renderer/themes/github';
import prettify from 'html-prettify';
import beautify from 'json-beautify';
import toast from 'react-simple-toasts';
import HTMLWrapper from '../helpers/HTMLwrapper';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const Toggle = ({state, setState}) => {
    return (
        <div className="flex items-center justify-center ml-6 mb-3">

            <label
                for="toogleA"
                className="flex items-center cursor-pointer"
                onClick={setState}
            >
                <div className="relative transform scale-75">
                    <div className="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
                    <div className={`dot absolute w-6 h-6  rounded-full shadow  -top-1  transition ${state ? 'bg-purple-600 -right-1': 'bg-gray-100 -left-1'}`}></div>
                </div>
                <div className="ml-3 text-gray-700 text-sm">
                    Convert Marketo Variables
                </div>
            </label>

        </div>
    )
}

const convertMarketoVariables = (html) => {
    let marketoVariables = [];

    const regexp = /(\<meta.*?class=\"(.*?)\".*?\>)/gim;

    const allMetaVariableTags = [...html.matchAll(regexp)].map((tag) => tag[0]);
    console.log(allMetaVariableTags);

    let _data = html;

    allMetaVariableTags.forEach((line) => {
        marketoVariables.push({
            "id": (line.match(/\id=\"(.*?)\"/))[1],
            "value": (line.match(/default=\"(.*?)\"/) && (line.match(/default=\"(.*?)\"/))[1]) || (line.match(/true_value=\"(.*?)\"/) && (line.match(/false_value=\"(.*?)\"/))[1])
        });
    })

    marketoVariables.forEach(({ id, value }) => {
        const _id = '${' + id + '}';
        // @TODO LIST ALL UNUSED VARIABLES
        //   if (_data.indexOf(_id) < 1) {
        //     console.log(`Unused Variable: ${id}`);
        //   }
        _data = _data.split(_id).join(value);
    });

    console.log('data :>> ', _data);
    return _data;


}

function Preview() {
    const [state, dispatch] = useContext(GlobalContext);
    const [isMarketo, setMarketo] = useState(false)
    const previewRef = useRef();

    const { previewFiles, previewHTML, globalIndexHTML, activeVariant, isUnsavedChanges } = state;

    // const [files, setFiles] = useState([]);
    // const [indexHTML, setIndexHTML] = useState('<html><!-- split --></html>');

    // const [displayData, setDisplayData] = useState('loading...');


    const combinedHTML = previewFiles && previewFiles.length > 0 ? previewFiles.map(x => x.content)
        .reduce((prev, cur) => {
            return prev + cur;
        }) : `<p style="font-family: sans-serif; color: #888; margin-top: 70px; text-align: center">It's empty here. Select a project and add components to Navigator</p>`;



    // const HTMLWrapper = (content) => useHTMLWrapper(content);

    const htmlData = useMemo(() => {
        const wrappedHTML = HTMLWrapper(combinedHTML, globalIndexHTML);

        if (isMarketo) return convertMarketoVariables(wrappedHTML)
        return wrappedHTML;
    }, [previewFiles, isMarketo]);




    useEffect(() => {
        dispatch({
            type: 'SET_PREVIEW_HTML',
            payload: htmlData
        });
    }, [previewFiles, isMarketo]);

    const [previewWidth, setPreviewWidth] = useState('100%');

    useEffect(() => {
        previewRef.current.style.width = previewWidth;
    }, [previewWidth]);


    const prettifyHTML = () => {
        dispatch({
            type: 'SET_PREVIEW_HTML',
            payload: prettify(htmlData)
        });
        toast('HTML code is now prettier than ever')
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(previewHTML);
        toast('Copied to Clipboard')
    }

    const closeVariant = () => {

        const close = () => {
            dispatch({
                type: 'CLOSE_VARIANT',
            });
        }

        if (isNavigatorEmpty || !isUnsavedChanges) {
            return close();
        }



        if (window.confirm('You have unsaved changes, are you sure you want to close this variant')) {
            return close();
        } else {
            // Do nothing!

        }
    }

    const isNavigatorEmpty = previewFiles.length <= 0;

    return (
        <section className="w-8/12 p-2 h-full ">
            <Tabs className="h-full w-full flex flex-col" forceRenderTabPanel>
                <TabList className="flex justify-between items-center">

                    <div className="flex items-center ">
                        {
                            activeVariant && <span className="flex text-xs items-center font-bold leading-sm p-1 px-2 rounded-sm bg-purple-100 text-purple-600 mr-2 mb-3">
                                {activeVariant.split('.')[0]}

                                <a onClick={closeVariant} className='pl-2 cursor-pointer'>
                                    <FontAwesomeIcon icon={faTimes} />
                                </a>
                            </span>
                        }
                        <Header className="mb-0">Preview </Header>
                        <Toggle state={isMarketo} setState={() => setMarketo(!isMarketo)}/>
                    </div>


                    <div className="flex items-center">
                  
                        {
                            isUnsavedChanges && !isNavigatorEmpty && <p className='mb-3 text-xs italic opacity-50 mr-3'>Unsaved changes</p>
                        }
                        <Tab className=" select-none cursor-pointer block mb-3 last:mb-0 bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold py-2 px-4 text-xs rounded-sm" selectedClassName="bg-purple-200">Visual</Tab>
                        <Tab className=" select-none cursor-pointer block mb-3 last:mb-0 bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold py-2 px-4 text-xs rounded-sm" selectedClassName="bg-purple-200">HTML</Tab>
                    </div>
                </TabList>
                <div className="flex-1 relative">
                    <TabPanel className="absolute inset-0 ">
                        <div className="relative bg-gray-200 overflow-scroll h-full w-full">
                            <div className="flex absolute top-2 left-2 rounded-sm filter drop-shadow">
                                <Button icon="mobile" onClick={() => setPreviewWidth('375px')} className="text-xs rounded-l-sm mb-0" title="375px"></Button>
                                <Button icon="desktop" onClick={() => setPreviewWidth('700px')} className="text-xs rounded-none mb-0" title="700px"></Button>
                                <Button onClick={() => setPreviewWidth('100%')} className="text-xs rounded-r-sm mb-0" title="Full"></Button>
                            </div>
                            <iframe
                                className="resize-x border-dotted border-purple-600 border-2 mx-auto active:border-solid"
                                sandbox="allow-same-origin"
                                srcDoc={previewHTML}
                                style={{ height: '100%' }}
                                ref={previewRef}
                            />
                        </div>
                    </TabPanel>
                    <TabPanel style={{ display: 'none' }} className="absolute inset-0" selectedClassName='block'>
                        <div className="flex absolute top-2 right-2 rounded-sm filter drop-shadow">
                            <Button icon="copy" onClick={copyToClipboard} className="text-xs rounded-l-sm mr-2" title="Copy To Clipboard"></Button>
                            <Button icon="palette" onClick={prettifyHTML} className="text-xs rounded-none mb-0" title="Prettify"></Button>
                        </div>
                        <Highlight {...defaultProps} theme={github} code={previewHTML} language="markup">
                            {({ className, style, tokens, getLineProps, getTokenProps }) => (
                                <pre className={`${className} overflow-scroll h-full px-2 pt-16`} style={style}>
                                    {tokens.map((line, i) => (
                                        <div {...getLineProps({ line, key: i })} style={{ fontSize: '12px' }}>
                                            {line.map((token, key) => (
                                                <span {...getTokenProps({ token, key })} />
                                            ))}
                                        </div>
                                    ))}
                                </pre>
                            )}
                        </Highlight>
                    </TabPanel>
                </div>
            </Tabs>

        </section>
    )
}

export default Preview
