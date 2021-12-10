import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { forwardRef } from "react";
import { faFolderOpen, faCode, faAngleRight, faFileImport, faFileCode, faCopy, faPallet, faPalette, faMobile, faDesktop, faMobileAlt, } from '@fortawesome/free-solid-svg-icons'


const Button = forwardRef((props, ref) => {
  const icons = {
    'folder-open': faFolderOpen,
    'file-code': faFileCode,
    'copy': faCopy,
    'palette': faPalette,
    'mobile': faMobileAlt,
    'desktop': faDesktop
  }
  
  return (
  <a ref={ref} {...props} className={`select-none cursor-pointer block bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold py-2 px-4 text-xs rounded-sm disabled:opacity-50 ${props.className} `}>
    <FontAwesomeIcon icon={icons[props.icon]} className="mr-2 "/>
    {props.title}
  </a>
)});



export default Button
