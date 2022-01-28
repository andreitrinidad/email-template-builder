import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { forwardRef } from 'react'
import { icons } from '../helpers/icons';
import { faFolderOpen, faCode, faAngleRight, faFileImport, faFileCode, faCopy, faPallet, faPalette, faMobile, faDesktop, faMobileAlt, faFileArchive, faClone, faSync, faSave, faArrowLeft, } from '@fortawesome/free-solid-svg-icons'

const IconButton = forwardRef((props, ref) => {
  const icons = {
    'folder-open': faFolderOpen,
    'file-code': faFileCode,
    'copy': faCopy,
    'palette': faPalette,
    'mobile': faMobileAlt,
    'desktop': faDesktop,
    'archive': faFileArchive,
    'clone': faClone,
    'sync': faSync,
    'save': faSave,
    'arrow-left': faArrowLeft
  }
  return (
    <button ref={ref} {...props} className={`p-1 text-purple-600 hover:text-gray-900 cursor-pointer ${props.className}`}>
      <FontAwesomeIcon icon={icons[props.icon]} />
    </button>
  )
});



export default IconButton;
