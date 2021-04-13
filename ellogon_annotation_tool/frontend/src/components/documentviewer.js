import React, { Component } from "react";
import requestInstance from "../requestAPI";
import {UnControlled as CodeMirror} from 'react-codemirror2'
import {FaTimes} from "react-icons/fa";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ProSidebar} from "react-pro-sidebar";
import AnnotationsView from "./AnnotationsView";
import Define_annotation from "./Define_annotation"
import SelectAnnotationSchema from "./SelectAnnotationSchema";
import Annotator from "./Annotator";
import AddCustomValue from "./AddCustomValue";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@material-ui/core";

class DocumentViewer extends Component {
    constructor(props) {
        super(props);
        //  this.annotator = React.createRef();
        this.state = {
            filename: "",
            text: "",
            collection: "",
            project: "",
            selectoptions: ["transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent"],
            options_status: ["enabled", "disabled", "disabled", "disabled", "disabled", "enabled", "enabled"],
            selected_text: {
                start: {line: null, ch: null},
                end: {line: null, ch: null}
            },
            selected_content: "",
            editor: null,
            annotations: [],
            annotation_contents: [],
            annotation_labels: [],
            annotation_properties: [],
            annotation_titles: [],
            viewshow: false,
            viewshow2: false,
            annotator_view: false,
            schema_info: {},
            tooltip_state: false,
            tooltip_title: "No selected",
            tooltip_label: "No selected",
            document_attributes: {},
            add_custom_value_display: "none",
            add_custom_value_view: false,
            selected_annotation_id: -1,
            autosave: false,
            closewarning: false,
            showCoref:false,
            corefC:0


        }
        this.DeleteSelectedAnnotation = this.DeleteSelectedAnnotation.bind(this)
        this.DeleteAnnotation = this.DeleteAnnotation.bind(this)
        this.setEditor = this.setEditor.bind(this)
        this.getText = this.getText.bind(this)
        this.SelectAnnotationScheme = this.SelectAnnotationScheme.bind(this)
        this.getSelectedText = this.getSelectedText.bind(this)
        this.AnnotateSelectedText = this.AnnotateSelectedText.bind(this)
        this.SelectMenuItem = this.SelectMenuItem.bind(this)
        this.ViewAnnotations = this.ViewAnnotations.bind(this)
        this.ViewForm = this.ViewForm.bind(this)
        this.HideAnnotations = this.HideAnnotations.bind(this)
        this.SelectAnnotationScheme = this.SelectAnnotationScheme.bind(this)
        this.HideForm = this.HideForm.bind(this)
        this.HideAnnotations = this.HideAnnotations.bind(this)
        this.DiffState = this.DiffState.bind(this)
        this.ShowAnnotationType = this.ShowAnnotationType.bind(this)
        this.setDocumentAttributes = this.setDocumentAttributes.bind(this)
        this.DisplayAddCustomValue = this.DisplayAddCustomValue.bind(this)
        this.AddCustomValueBtn = this.AddCustomValueBtn.bind(this)
        this.ChangeWarningDialogState = this.ChangeWarningDialogState.bind(this)
        this.handleChanges=this.handleChanges.bind(this)
        this.setShowCoref=this.setShowCoref.bind(this)
        this.SetCorefC=this.SetCorefC.bind(this)
    }


    DisplayAddCustomValue(value) {
        console.log(value)
        this.setState({add_custom_value_display: value})

    }

    AddCustomValueBtn(button) {
        let ui_structure = this.state.schema_info["ui_structure"]
        let found_in_collection = ui_structure[ui_structure.length - 1]
        if ("rows" in found_in_collection) {
            let last_row = found_in_collection["rows"][found_in_collection["rows"].length - 1]
            if (last_row.length < parseInt(found_in_collection["colspan"])) {
                last_row.push(button)
                found_in_collection["rows"][found_in_collection["rows"].length - 1] = last_row
                ui_structure[ui_structure.length - 1]["rows"] = found_in_collection["rows"]
            } else {
                found_in_collection["rows"].push([])
                found_in_collection["rows"][found_in_collection["rows"].length - 1].push(button)
                ui_structure[ui_structure.length - 1]["rows"] = found_in_collection["rows"]
            }
        } else {
            ui_structure[ui_structure.length - 1]["rows"] = [[button]]

        }
        this.setState(prevState => ({
            ...prevState,
            ui_structure: ui_structure
        }), function () {
            console.log(this.state.schema_info.ui_structure)
        });

    }


    async getText() {
        const url = '/fileoperation/document/open/'
        const userproject = this.props.location.state.project
        const useremail = localStorage.getItem("email")
        const usercollection = this.props.location.state.collection
        const filename = this.props.location.state.filename
        let data = {
            "owner": useremail,
            "project": userproject,
            "collection": usercollection,
            "name": filename
        }
        try {
            let response = await requestInstance.get(url, {
                params: data
            })


            //   console.log(response)
            const res_data = (response.data).data;
            this.setState({
                text: res_data.text,
                filename: res_data.name,
                project: res_data.project,
                collection: res_data.collection
            });
            // console.log(message)
            return res_data;
        } catch (error) {
            //console.log("Error: ", JSON.stringify(error, null, 4));
            this.props.history.push({pathname: "/sign-in"});
            throw error;
        }
    }

    ChangeOrder(p1, p2) {

        if (p1.line == p2.line && p1.ch > p2.ch) {
            return true
        } else {
            if (p1.line > p2.line) {
                return true
            }
        }
        return false


    }


    setDocumentAttributes(attrs) {
        this.setState({document_attributes: attrs}, function () {
            console.log(this.state.document_attributes)

        })
    }


    getSelectedText(editor, data) {
        console.log(data)
        console.log(editor)
        /*let selected_points=data.ranges[0]
        let reverse_order = this.ChangeOrder(data.ranges[0].anchor, data.ranges[0].head)
        //console.log(selected_points)
        if (reverse_order == true) {
            let temp = selected_points.anchor
           selected_points.anchor = selected_points.head
           selected_points.head = temp
         //   selected_points={anchor:selected_points.head,head:selected_points.anchor}
        }
       // console.log(selected_points)
      //  let start = {line: selected_points.anchor.line, ch: selected_points.anchor.ch}
      //  let end = {line: selected_points.head.line, ch: selected_points.head.ch}
        //console.log(start)
       // console.log(end)*/
        let reverse_order = this.ChangeOrder(data.ranges[0].anchor, data.ranges[0].head)
        if (reverse_order == false) {
            //console.log(editor.getRange(data.ranges[0].anchor, data.ranges[0].head))
            this.setState({selected_content: editor.getRange(data.ranges[0].anchor, data.ranges[0].head)}, function () {


            })
            this.setState(prevState => ({
                selected_text: {
                    ...prevState.selected_text,
                    start: data.ranges[0].anchor,
                    end: data.ranges[0].head
                }

            }))
        } else {

            this.setState({selected_content: editor.getRange(data.ranges[0].head, data.ranges[0].anchor)}, function () {


            })
            this.setState(prevState => ({
                selected_text: {
                    ...prevState.selected_text,
                    start: data.ranges[0].head,
                    end: data.ranges[0].anchor
                }

            }))


        }
    }

    ViewAnnotations() {
        if (this.state.options_status[3] == "enabled") {
            this.setState({viewshow: true})
        }
    }

    HideAnnotations() {
        this.setState({viewshow: false})
    }

    ViewForm(param) {

        if (param == "schema") {

            //  console.log(param)
            this.setState({viewshow2: true})

        }
        if (param == "add-custom-value") {

            //  console.log(param)
            this.setState({add_custom_value_view: true})

        }


        console.log(param)
        if (param == "annotator") {
            let selection = this.state.editor.getSelection()
            // let selected_annotation = this.state.selected_text

            //let editor = this.state.editor


            //  console.log(this.state.editor.getSelection())
            if (this.state.options_status[1] == "enabled") {
                let cursor_pos = this.state.editor.getCursor()
                let idx = -1
                //   console.log(param)
                for (let i = 0; i < this.state.annotations.length; i++) {
                    idx = this.GetSelectedAnnotation(cursor_pos, this.state.annotations[i], i)
                    if (idx != -1) {
                        break;
                    }
                }


                //console.log(idx)
                if (selection || idx != -1) {
                    console.log(idx)


                    this.setState({annotator_view: true, selected_annotation_id: idx})
                } else {
                    this.setState({selected_annotation_id: -1})
                    if (this.state.schema_info["params"]["annotation"] == "VAST_value") {
                        //this.annotator.current.
                        this.setState({annotator_view: true})
                    }

                }


            }
        }

    }

    HideForm(param) {
        if (param == "schema") {

            //  console.log(param)
            this.setState({viewshow2: false})

        }
        if (param == "add-custom-value") {

            //  console.log(param)
            this.setState({add_custom_value_view: false})

        }


        if (param == "annotator") {


            // console.log(param)
            this.setState({annotator_view: false})

        }
    }

    AnnotateSelectedText(markedcolor, title, label, property) {
        /* if(this.state.annotate_status==true){
             console.log("annotate")
               this.setState({annotate_status:false})
         }*/
        if (this.state.options_status[1] == "enabled") {
            let editor = this.state.editor
            var style = "background-color:" + markedcolor
            var markOptions = {css: style};
            // console.log(markedcolor)
            if (this.state.selected_annotation_id != -1) {
                editor.markText(this.state.annotations[this.state.selected_annotation_id].start, this.state.annotations[this.state.selected_annotation_id].end, markOptions);
                const annotation_labels = this.state.annotation_labels.slice()
                annotation_labels[this.state.selected_annotation_id] = label
                const annotation_titles = this.state.annotation_titles.slice()
                annotation_titles[this.state.selected_annotation_id] = title
                const annotation_properties = this.state.annotation_properties.slice()
                annotation_properties[this.state.selected_annotation_id] = property
                this.setState({
                        annotation_labels: annotation_labels,
                        annotation_titles: annotation_titles,
                        annotation_properties: annotation_properties,
                        tooltip_state: true,
                        tooltip_label: label,
                        tooltip_title: title

                    },

                    function () {
                        console.log(this.state)
                    })


            } else {


                // console.log(this.state.selected_content)
                //   console.log(this.state.selected_text)
                editor.markText(this.state.selected_text.start, this.state.selected_text.end, markOptions);
                this.setState(prevState => ({
                    annotations: [...prevState.annotations, this.state.selected_text],
                    annotation_contents: [...prevState.annotation_contents, this.state.selected_content],
                    annotation_labels: [...prevState.annotation_labels, label],
                    annotation_titles: [...prevState.annotation_titles, title],
                    annotation_properties: [...prevState.annotation_properties, property],
                    tooltip_state: true,
                    tooltip_label: label,
                    tooltip_title: title

                }), function () {


                    //  console.log(this.state.annotations)
                })
            }
        }
    }

    CompareAnnotations(a1, a2) {
        let foundstart = false
        let foundend = false
        let foundinside = false
        if (a1.start.line == a2.start.line && a1.start.ch == a2.start.ch) {
            foundstart = true
        }
        if (a1.end.line == a2.start.line && a1.end.ch == a2.start.ch) {
            foundend = true
        }

        console.log(a1)
        console.log(a2)
        if (a1.start.line == a2.start.line) {
            if (a1.start.ch < a2.start.ch) {
                if (a2.end.line == a1.end.line) {
                    if (a1.end.ch > a2.end.ch) {
                        //  console.log("a2")
                        foundinside = true
                    }
                } else {

                    if (a2.start.line < a1.end.line) {

                        foundinside = true

                    }
                }


            }
        } else {
            if (a1.start.line < a2.start.line) {
                if (a2.start.line == a1.end.line) {
                    if (a1.end.ch > a2.end.ch) {
                        foundinside = true
                    }
                } else {
                    if (a2.start.line < a1.end.line) {
                        foundinside = true

                    }
                }
            }
        }
        let found = (foundstart || foundend || foundinside)
        return found
    }


    DeleteAnnotation(index, type) {
        switch (type) {
            case "annotation":
                let editor = this.state.editor
                let markOptions = {css: "background-color: transparent"};
                if (this.state.tooltip_label == this.state.annotation_labels[index]) {
                    this.setState({tooltip_state: false, tooltip_label: "No selected", tooltip_title: "No selected"})
                }
                editor.markText(this.state.annotations[index].start, this.state.annotations[index].end, markOptions);
                this.state.annotations.splice(index, 1);
                this.state.annotation_contents.splice(index, 1);
                this.state.annotation_labels.splice(index, 1)
                this.state.annotation_titles.splice(index, 1)
                this.state.annotation_properties.splice(index, 1)
                break
            case "document_attribute":

                let j = 0
                let document_attributes = this.state.document_attributes
                for (const [key, value] of Object.entries(document_attributes)) {
                    if (j == (index - this.state.annotations.length)) {
                        delete document_attributes[key]
                        break
                    }
                    j = j + 1
                }
                // console.log(document_attributes)
                this.setState({document_attributes: document_attributes}, function () {
                    console.log(this.state.document_attributes)
                })
                //delete this.state.document_attributes[index]
                break


        }
        //let editor = this.state.editor
        //  let markOptions = {css: "background-color: transparent"};


    }


    DeleteSelectedAnnotation() {

        if (this.state.options_status[4] == "enabled") {
            let selected_annotation = this.state.selected_text
            let found = false
            let editor = this.state.editor
            let markOptions = {css: "background-color: transparent"};
            for (let i = 0; i < this.state.annotations.length; i++) {
                found = this.CompareAnnotations(this.state.annotations[i], selected_annotation)
                if (found == true) {
                    editor.markText(this.state.annotations[i].start, this.state.annotations[i].end, markOptions);
                    this.state.annotations.splice(i, 1);
                    this.state.annotation_contents.splice(i, 1);
                    this.state.annotation_labels.splice(i, 1)
                    this.state.annotation_titles.splice(i, 1)
                    this.state.annotation_properties.splice(i, 1)
                    this.setState({
                        tooltip_state: false,
                        tooltip_label: "No selected",
                        tooltip_title: "No selected"
                    }, function () {

                    })
                    break
                }
            }


        }
    }


    setEditor(editor) {
        this.setState({editor: editor})
    }

    componentDidMount() {
        const data = this.getText();
        // console.log(data)

    }

    setShowCoref(status)
        {
            this.setState({showCoref:status})
        }

        SetCorefC()
        {
            this.setState({corefC: this.state.corefC + 1})
        }




    SelectAnnotationScheme(response) {

        const options_status = this.state.options_status.slice()
        for (let i = 1; i < 6; i++) {
            options_status[i] = "enabled"
        }
        this.setState({options_status: options_status});
        //  console.log(response)
        if (response["params"]["annotation"] == "VAST_value") {
            this.DisplayAddCustomValue("inline-block")
        } else {
            this.DisplayAddCustomValue("none")
        }


        this.setState({schema_info: response})
        console.log(response)
         if (this.state.schema_info['kind'] === "coreference")
            {
                this.setShowCoref(true)
            }
            else
            {
                this.setShowCoref(false)
            }

            this.SetCorefC()



    }


    DiffState(state1, state2) {
        let diffstate = true
        Object.keys(state1).forEach(function (key) {
                if (state1[key] != state2[key]) {
                    diffstate = false

                }
            }
        );
        //     console.log(diffstate)
        return diffstate
    }


    componentDidUpdate(prevProps, prevState, snapshot) {

        //  console.log(this.props.location.state)
        //  console.log(this.state)
        let state1 = {
            "filename": this.props.location.state.filename, "collection": this.props.location.state.collection,
            "project": this.props.location.state.project

        }
        let state2 = {
            "filename": this.state.filename, "collection": this.state.collection,
            "project": this.state.project

        }
        let update = this.DiffState(state1, state2)
        if (update == false) {
            let data = this.getText();
        }

         if (this.state.corefC !== prevState.corefC && prevState.corefC!==null)
            {

                this.forceUpdate()
            }


        //  console.log(this.state.selected_content)
        //   let filename=this.props.location.state


    }


    GetSelectedAnnotation(c_pos, a, index) {
        let idx = -1
        // console.log(this.state.annotations)
        if (c_pos.line == a.start.line && c_pos.line == a.end.line) {
            if (c_pos.ch >= a.start.ch && c_pos.ch <= a.end.ch) {
                idx = index
            }
        }
        if (c_pos.line == a.start.line && a.end.line > c_pos.line) {
            if (c_pos.ch >= a.start.ch) {
                idx = index
            }
        }

        if (c_pos.line > a.start.line && c_pos.line == a.end.line) {

            if (c_pos.ch <= a.end.ch) {
                idx = index
            }
        }
        if (c_pos.line > a.start.line && c_pos.line < a.end.line) {
            idx = index
        }
        //   console.log(idx)

        return idx
    }


    ShowAnnotationType(editor, data) {
        //  console.log("cursor")
        if (this.state.annotations.length > 0) {
            let cursor_pos = editor.getCursor()
            let idx = -1
            for (let i = 0; i < this.state.annotations.length; i++) {
                idx = this.GetSelectedAnnotation(cursor_pos, this.state.annotations[i], i)
                if (idx != -1) {
                    break;
                }
            }
            if (idx != -1) {

                this.setState({
                    tooltip_state: true,
                    tooltip_title: this.state.annotation_titles[idx],
                    tooltip_label: this.state.annotation_labels[idx]
                })
            } else {
                this.setState({tooltip_state: false, tooltip_title: "No selected", tooltip_label: "No selected"})
            }
            // console.log(this.state.annotation_labels[idx])
        }


    }

    SelectMenuItem(id, colorname) {
        if (this.state.options_status[id] == "enabled") {
            const selectoptions = this.state.selectoptions.slice()
            selectoptions[id] = colorname
            this.setState({selectoptions: selectoptions});
        }
    }

    ChangeWarningDialogState(b) {
        this.setState({closewarning: b})
        //this.props.ReturnMain
    }

    handleChanges(c) {
        if (c == "s"){
            console.log("save changes")


            }
        else{
            console.log("don't save changes")
        }
        this.ChangeWarningDialogState(false)
         this.props.ReturnMain()
}










        render()
        {

            //   console.log(this.state.text)
            /* const valuek = <div>
                 <h1>Name:{this.props.location.state.filename}</h1>
                 <h3>
                     Collection:{this.props.location.state.collection}
                 </h3>
                 <h3>
                     Project:{this.props.location.state.project}
                 </h3>
             </div>
             const options = {}*/
            // change font and letter size
            //load correct file from db
            return (
                <div>

                    <div className="Sticky">

                        <FontAwesomeIcon style={{
                            marginRight: "5%",
                            marginLeft: "1%",
                            cursor: "pointer",
                            color: "black",
                            backgroundColor: this.state.selectoptions[0]
                        }} className="fas folder-open fa-2x" icon="folder-open"
                                         onMouseEnter={() => this.SelectMenuItem(0, "aquamarine")}
                                         onMouseLeave={() => this.SelectMenuItem(0, "transparent")}
                                         onClick={() => this.ViewForm("schema")}></FontAwesomeIcon>
                       <FontAwesomeIcon style={{
                            marginRight: "5%",
                            marginLeft: "1%",
                            cursor: "pointer",
                            color: "black",
                            display:this.state.add_custom_value_display,
                            backgroundColor: this.state.selectoptions[6]
                        }} className="fas fa-plus-circle fa-2x" icon="plus-circle"
                                         onMouseEnter={() => this.SelectMenuItem(6, "aquamarine")}
                                         onMouseLeave={() => this.SelectMenuItem(6, "transparent")}
                                         onClick={() => this.ViewForm("add-custom-value")}></FontAwesomeIcon>
                        <FontAwesomeIcon style={{
                            marginRight: "5%",
                            cursor: "pointer",
                            color: (this.state.options_status[1] == "enabled") ? "black" : "gray",
                            backgroundColor: this.state.selectoptions[1]
                        }} className="fas fa-highlighter fa-2x" icon="highlighter"
                                         onClick={() => this.ViewForm("annotator")}
                                         onMouseEnter={() => this.SelectMenuItem(1, "aquamarine")}
                                         onMouseLeave={() => this.SelectMenuItem(1, "transparent")}
                                        ></FontAwesomeIcon>




                        {/*      <FontAwesomeIcon style={{
                            marginRight: "5%",
                            cursor: "pointer",
                            color: "black",
                            display:this.state.add_custom_value_display,
                            backgroundColor: this.state.selectoptions[6]
                        }} className="fas fa-plus-circle" icon="plus-circle"
                                        // onClick={() => this.ViewForm("annotator")}
                                         onMouseEnter={() => this.SelectMenuItem(6, "aquamarine")}
                                         onMouseLeave={() => this.SelectMenuItem(6, "transparent")}
                                        ></FontAwesomeIcon>
                    */}





                        <span>
                        <FontAwesomeIcon style={{

                            cursor: "pointer",
                            color: (this.state.options_status[2] == "enabled") ? "black" : "gray",
                            backgroundColor: this.state.selectoptions[2]
                        }} className="far fa-save fa-2x" icon="save"
                                         onMouseEnter={() => this.SelectMenuItem(2, "aquamarine")}
                                         onMouseLeave={() => this.SelectMenuItem(2, "transparent")}>



                        </FontAwesomeIcon>
                         <FontAwesomeIcon style={{
                            marginRight: "5%",
                            cursor: "pointer",
                            color: (this.state.options_status[2] == "enabled") ? "black" : "gray",
                            backgroundColor: this.state.selectoptions[2]
                        }} className={(this.state.autosave)? "fas fa-circle fa-xs":"far fa-circle fa-xs"} icon={(this.state.autosave)?['fas', 'circle']:['far', 'circle']}
                          onClick={() => {
                              if (this.state.options_status[2] == "enabled"){
                              this.setState({autosave:!this.state.autosave},function(){
                                  console.log(this.state.autosave)
                                  console.log("autosave status changed")}
                              )
                          }

                          }}
                         ></FontAwesomeIcon>


                        </span>
                        <FontAwesomeIcon style={{
                            marginRight: "5%",
                            cursor: "pointer",
                            color: (this.state.options_status[3] == "enabled") ? "black" : "gray",
                            backgroundColor: this.state.selectoptions[3]
                        }} className="fas fa-list fa-2x" icon="list"
                                         onClick={this.ViewAnnotations}
                                         onMouseEnter={() => this.SelectMenuItem(3, "aquamarine")}
                                         onMouseLeave={() => this.SelectMenuItem(3, "transparent")}></FontAwesomeIcon>
                        <FontAwesomeIcon style={{
                            marginRight: "5%",
                            cursor: "pointer",
                            color: (this.state.options_status[4] == "enabled") ? "black" : "gray",
                            backgroundColor: this.state.selectoptions[4]
                        }} className="far fa-trash fa-2x" icon="trash"
                                         onMouseEnter={() => this.SelectMenuItem(4, "aquamarine")}
                                         onMouseLeave={() => this.SelectMenuItem(4, "transparent")}
                                         onClick={this.DeleteSelectedAnnotation}
                        ></FontAwesomeIcon>
                        <FontAwesomeIcon style={{
                            marginRight: "5%",
                            cursor: "pointer",
                            color: "black",
                            backgroundColor: this.state.selectoptions[5]
                        }} className="far fa-window-close fa-2x" icon="window-close"
                                         onMouseEnter={() => this.SelectMenuItem(5, "aquamarine")}
                                         onMouseLeave={() => this.SelectMenuItem(5, "transparent")}
                                         onClick={()=>this.ChangeWarningDialogState(true)}></FontAwesomeIcon>






                        <span title={this.state.tooltip_title}  style={{display:"inline-block",backgroundColor:"#DCDCDC",color:(this.state.tooltip_state)?"black":"gray", cursor: "pointer",

                            fontSize:"large"}}>{this.state.tooltip_label}</span>
                        {/*       <FaTimes size={22} onClick={this.props.ReturnMain} style={{cursor: "pointer",position:"absolute",top:0,right:0}} />*/}
                    </div>

                    <div className="main-document" style={{width: this.state.showCoref ? "60%" : "100%", float:"left"}}>



                        <CodeMirror
                            value={this.state.text}
                            options={{

                                lineWrapping: true,
                                lineNumbers: true,
                                readOnly: true

                            }}
                            onChange={(editor, data, value) => {
                            }}
                            onSelection={(editor, data) => {
                                this.getSelectedText(editor, data)
                                // console.log(editor)
                                // console.log(data)

                            }}
                            editorDidMount={(editor) => this.setEditor(editor)}
                            onCursor={(editor, data)=> this.ShowAnnotationType(editor,data)}



                        />



                    </div>
                    <SelectAnnotationSchema SelectAnnotationScheme={this.SelectAnnotationScheme}
                                            HideSchemaForm={this.HideForm} viewshow={this.state.viewshow2}/>
                    <Annotator  annotator_disabled={(this.state.selected_content=="" && this.state.selected_annotation_id==-1)?true:false} setDocumentAttributes={this.setDocumentAttributes}

                        uistructure={this.state.schema_info} viewshow={this.state.annotator_view} HideSchemaForm={this.HideForm} AnnotateSelectedText={this.AnnotateSelectedText}
                                selected_annotation_label={(this.state.selected_annotation_id!=-1)?this.state.tooltip_label:""}
                        selected_annotation_title={(this.state.selected_annotation_id!=-1)?this.state.tooltip_title:""}
                        selected_annotation_property={(this.state.selected_annotation_id!=-1)? this.state.annotation_properties[this.state.selected_annotation_id]:""}
                        displayCoref={this.state.showCoref} corefCount={this.state.corefC}
                        document_attributes={this.state.document_attributes}


                    />
                    <AnnotationsView HideAnnotations={this.HideAnnotations}
                                         DeleteAnnotation={this.DeleteAnnotation}
                                     viewshow={this.state.viewshow} annotator_params={{kind:this.state.schema_info['kind'],params:this.state.schema_info["params"]}}
                                     annotations={this.state.annotations}  annotation_titles={this.state.annotation_titles} annotation_labels={this.state.annotation_labels}
                                     annotation_properties={this.state.annotation_properties}
                                     annotation_contents={this.state.annotation_contents}
                                     document_attributes={this.state.document_attributes}
                                     selected_annotation_label={(this.state.selected_annotation_id!=-1)?this.state.tooltip_label:""}
                                     selected_annotation_title={(this.state.selected_annotation_id!=-1)?this.state.tooltip_title:""}
                                     selected_annotation_property={(this.state.selected_annotation_id!=-1)?this.state.annotation_properties[this.state.selected_annotation_id]:""}

                    />
                    <AddCustomValue AddCustomValueBtn={this.AddCustomValueBtn}  HideSchemaForm={this.HideForm}   add_custom_value_view={this.state.add_custom_value_view} />
                    <div>
                <Dialog
                    open={this.state.closewarning}
        onClose={()=>this.ChangeWarningDialogState(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Warning"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
           It seems that you have done changes on the document that have not been saved. What do you want to do?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>this.handleChanges("s")} color="primary">
            Save Changes
          </Button>
          <Button onClick={()=>this.handleChanges("d")} color="primary">
            Continue without saving
          </Button>
        </DialogActions>
      </Dialog>

                    </div>





                </div>
            )
        }




}
export default DocumentViewer;