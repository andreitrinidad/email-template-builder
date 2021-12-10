import React, { useRef } from 'react'
import Button from './Button';
import Header from './Header'
import { useGlobalContext } from './Store';
import toast from 'react-simple-toasts';

export default function Action() {
  const downloadAsHTMLRef = useRef();
  const downloadAsMJMLRef = useRef();
  const [state] = useGlobalContext();
  const {previewHTML} = state;

  const saveAs = (ref, data, fileType) => {
    const element = ref.current;
    const file = new Blob([data], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `index.${fileType}`;
    // document.body.appendChild(element); // Required for this to work in FireFox
    // element.click();
    toast('HTML download started')
  }

  return (
    <section className="w-2/12 p-6 px-3">
    <Header>Actions</Header>
    <Button icon="file-code" ref={downloadAsHTMLRef} onClick={() => saveAs(downloadAsHTMLRef, previewHTML, 'html')} title="Save as HTML" className="mb-2"/>
    {/* <Button ref={downloadAsMJMLRef} onClick={() => {}} title="Save as MJML" disabled/> */}
    <hr/>
  </section>
  )
}
