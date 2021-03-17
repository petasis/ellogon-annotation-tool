import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
//import "./css/index.css";
import App from "./components/App";
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEye, faEyeSlash,faHighlighter,faWindowClose,faSave,faTrash,faFolderOpen,faList} from '@fortawesome/free-solid-svg-icons'
library.add(faEye,faEyeSlash,faHighlighter,faWindowClose,faSave,faTrash,faFolderOpen,faList)
ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
    document.getElementById("root")
);

