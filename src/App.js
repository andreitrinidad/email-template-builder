import './App.css';
import { useState, useEffect, useRef } from 'react';
import './index.css';
import Api from './helpers/api';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Header from './components/Header';
import Preview from './components/Preview';
import { Navigator } from './components/Navigator';
import Action from './components/Action';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { useGlobalContext } from './components/Store';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

function App() {

  const [{ projectName }, dispatch] = useGlobalContext();
  const closeProject = () => {
    dispatch({
      type: 'INIT'
    });
  }
  return (
    <div className="App h-screen">
      <DndProvider backend={HTML5Backend}>
        <main className="flex flex-col h-full">
          <nav className="flex justify-between items-center bg-purple-600 text-white text-xs font-semibold select-none">
            <span></span>
            <div>
              <span className="p-2">
                Email Template Builder 1.0
              </span>
              {
                projectName && (
                  <span className="p-2 bg-indigo-900 rounded">
                    {projectName}
                    <a onClick={closeProject} className='pl-2 cursor-pointer'>
                      <FontAwesomeIcon icon={faTimes} />
                    </a>
                  </span>
                )
              }

            </div>


            <span className="p-2">
              <a href="https://github.com/andreitrinidad/email-template-builder" target="_blank">
                <FontAwesomeIcon icon={faGithub} className="text-lg" /></a>
            </span>

          </nav>
          <div className='flex flex-1'>
            <Navigator />
            <Preview />
            <Action />
          </div>
        </main>
      </DndProvider>
    </div>
  );
}

export default App;
