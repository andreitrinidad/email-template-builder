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

function Preview() {
  const [state, dispatch] = useContext(GlobalContext);
  const previewRef = useRef();

  const { previewFiles, previewHTML, globalIndexHTML } = state;

  // const [files, setFiles] = useState([]);
  // const [indexHTML, setIndexHTML] = useState('<html><!-- split --></html>');

  // const [displayData, setDisplayData] = useState('loading...');


  const combinedHTML = previewFiles && previewFiles.length > 0 ? previewFiles.map(x => x.content)
    .reduce((prev, cur) => {
      return prev + cur;
    }) : `<p style="font-family: sans-serif; color: #888; margin-top: 70px; text-align: center">It's empty here. Select a project and add components to Navigator</p>`;



  const HTMLWrapper = (content) => {
    const header = globalIndexHTML.split('<!-- split -->')[0];
    const footer = globalIndexHTML.split('<!-- split -->')[1];
    return (
      `
      ${header}
      ${content}
      ${footer}
      `
    )
  };

  const htmlData = useMemo(() => HTMLWrapper(combinedHTML), [previewFiles]);


  // const convertToHTML = (data) => {
  //   const api = new Api();
  //   api.getHTML({
  //     mjml: data
  //   }).then(res => setDisplayData(res.data.html))
  //     .catch(err => console.log(err));
  // };

  useEffect(() => {
    console.log(`previewFiles`, previewFiles)
    dispatch({
      type: 'SET_PREVIEW_HTML',
      payload: htmlData
    });
  }, [previewFiles]);

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

  return (
    <section className="w-8/12 p-2 h-full ">
      <Tabs className="h-full w-full flex flex-col" forceRenderTabPanel>
          <TabList className="flex justify-between items-center">
            <Header>Preview</Header>
            <div className="flex">
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
            <TabPanel style={{display: 'none'}} className="absolute inset-0" selectedClassName='block'>
            <div className="flex absolute top-2 right-2 rounded-sm filter drop-shadow">
                  <Button icon="copy" onClick={copyToClipboard} className="text-xs rounded-l-sm mr-2" title="Copy To Clipboard"></Button>
                  <Button icon="palette" onClick={prettifyHTML} className="text-xs rounded-none mb-0" title="Prettify"></Button>
                </div>
              <Highlight {...defaultProps} theme={github} code={previewHTML} language="markup">
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                  <pre className={`${className} overflow-scroll h-full px-2 pt-16`} style={style}>
                    {tokens.map((line, i) => (
                      <div {...getLineProps({ line, key: i })} style={{fontSize: '12px'}}>
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
