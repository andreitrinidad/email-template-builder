import './App.css';
import { useState, useEffect, useRef } from 'react';
import './index.css';
import Api from './helpers/api';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Navigator } from './components/navigator/Navigator';
import Button from './components/Button';
import IframeResizer from 'iframe-resizer-react';

function App() {
  const [files, setFiles] = useState([]);
  const [indexHTML, setIndexHTML] = useState('<html><!-- split --></html>');

  const [displayData, setDisplayData] = useState('loading...');
  const rawMJML = files && files.length > 0 && files.map(x => x.content)
    .reduce((prev, cur) => {
      return prev + cur;
    });



  const MJMLWrapper = (content) => {
    const header = indexHTML.split('<!-- split -->')[0];
    const footer = indexHTML.split('<!-- split -->')[1];
    return (
      // `<mjml>
      //   <mj-body>
      //     ${content}
      //   </mj-body>
      // </mjml>`
      `
      ${header}
      ${content}
      ${footer}
      `
    )
  };

  const mjmlData = MJMLWrapper(rawMJML);


  const convertToHTML = (data) => {
    const api = new Api();
    api.getHTML({
      mjml: data
    }).then(res => setDisplayData(res.data.html))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    // effect
    // convertToHTML(mjmlData);
    setDisplayData(mjmlData);

    // return () => {
    //   cleanup
    // }
  }, [files]);

  const downloadAsHTMLRef = useRef();
  const downloadAsMJMLRef = useRef();

  const saveAs = (ref, data, fileType) => {
    const element = ref.current;
    const file = new Blob([data], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `myFile.${fileType}`;
    // document.body.appendChild(element); // Required for this to work in FireFox
    // element.click();
  }

  const previewRef = useRef();


  const [previewWidth, setPreviewWidth] = useState('100%');
  

  useEffect(() => {
    previewRef.current.style.width = previewWidth;
  }, [previewWidth]);


  const [directoryFiles, setDirectoryFiles] = useState([]);





  return (
    <div className="App h-screen">
      <DndProvider backend={HTML5Backend}>
        <nav className="text-center p-2 bg-gray-200 text-xs font-semibold">MJML Email Template Builder 1.0</nav>
        <main className="flex h-full">
          <Navigator files={files} setFiles={setFiles} setIndexHTML={setIndexHTML}/>
          <section className="w-8/12 p-6 max-h-screen">
            <div className="flex justify-between">
            <h2 className="text-lg font-bold mb-3">Preview</h2>
            <div className="flex">
            <Button onClick={() => setPreviewWidth('375px')} className="text-xs rounded-l">375px</Button>
            <Button onClick={() => setPreviewWidth('700px')} className="text-xs rounded-none">700px</Button>
            <Button onClick={() => setPreviewWidth('100%')} className="text-xs rounded-r">Full</Button>
            {/* <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-20 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" type="text" value={"Todo"}/> */}
            </div>
          
            </div>
    

            <div className="relative bg-gray-200 overflow-scroll h-full w-full">
              <iframe
                className="w-full resize-x border-dotted border-purple-600 border-2 mx-auto active:border-solid"
                sandbox="allow-same-origin"
                srcDoc={displayData}
                style={{height: '90%'}}
                ref={previewRef}
              />

            </div>
          </section>

          <section className="w-2/12 p-6">
            <h2 className="text-lg font-bold mb-3">Actions</h2>
            {/* <ul>
              {files.map(file => <li className="p-3 border-2 border-dotted border-black">{file.name}</li>)}
            </ul> */}
            <Button ref={downloadAsHTMLRef} onClick={() => saveAs(downloadAsHTMLRef, displayData, 'html')}>Save as HTML</Button>
            <Button ref={downloadAsMJMLRef} onClick={() => saveAs(downloadAsMJMLRef, rawMJML, 'mjml')}>Save as MJML</Button>
            <hr/>
          </section>
        </main>
      </DndProvider>
    </div>
  );
}

export default App;
