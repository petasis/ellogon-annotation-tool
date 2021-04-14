import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
//import "./css/index.css";
import App from "./components/App";
import { library } from '@fortawesome/fontawesome-svg-core'

import {faEye, faEyeSlash,faHighlighter,faWindowClose,faSave,faTrash,faFolderOpen,faList,faMinus,faCalendarMinus,faArrowAltCircleLeft,faTimes,faPlus,faEdit,faUndo,faTrashAlt,faArrowCircleLeft,faPlusCircle} from '@fortawesome/free-solid-svg-icons'
//import {faCircle} from '@fortawesome/free-regular-svg-icons'//install
import { faCircle as fasCircle } from '@fortawesome/free-solid-svg-icons'
import { faCircle as farCircle } from '@fortawesome/free-regular-svg-icons'
import {far} from "@fortawesome/free-regular-svg-icons";




library.add(faEye,faEyeSlash,faHighlighter,faWindowClose,faSave,faTrash,faFolderOpen,faList,faMinus,faCalendarMinus,faArrowAltCircleLeft,faTimes,faPlus,faEdit,faUndo,faTrashAlt,faArrowCircleLeft,faPlusCircle,fasCircle,farCircle)
//rlibrary.add(faCircle)
ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
    document.getElementById("root")
);

