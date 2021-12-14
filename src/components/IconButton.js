import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { icons } from '../helpers/icons';
import { faFolderOpen, faCode, faAngleRight, faFileImport, faFileCode, faCopy, faPallet, faPalette, faMobile, faDesktop, faMobileAlt, faFileArchive, faClone, faSync, faSave, faArrowLeft, } from '@fortawesome/free-solid-svg-icons'

function IconButton(props) {
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
        <a {...props} className={`p-1 text-purple-600 hover:text-gray-900 cursor-pointer ${props.className}`}>
            <FontAwesomeIcon icon={icons[props.icon]} />
        </a>
    )
}

export default IconButton;
