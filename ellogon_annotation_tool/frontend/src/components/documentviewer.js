import React, { Component } from "react";
import requestInstance from "../requestAPI";
import {UnControlled as CodeMirror} from 'react-codemirror2'
import {FaTimes} from "react-icons/fa";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ProSidebar} from "react-pro-sidebar";
import AnnotationsView from "./AnnotationsView";
import Define_annotation from "./Define_annotation"
import SelectAnnotationSchema from "./SelectAnnotationSchema";
class DocumentViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filename: "",
            text: "",
            collection: "",
            project: "",
            selectoptions: ["transparent", "transparent", "transparent", "transparent", "transparent", "transparent"],
            options_status: ["enabled", "disabled", "disabled", "disabled", "disabled", "enabled"],
            selected_text: {
                start: {line: null, ch: null},
                end: {line: null, ch: null}
            },
            selected_content:"",
            editor: null,
            annotations:[],
            annotation_contents:[]
            ,viewshow:false,
            viewshow2:false


        }
        this.DeleteSelectedAnnotation=this.DeleteSelectedAnnotation.bind(this)
        this.setEditor = this.setEditor.bind(this)
        this.getText = this.getText.bind(this)
        this.SelectAnnotationScheme = this.SelectAnnotationScheme.bind(this)
        this.getSelectedText = this.getSelectedText.bind(this)
        this.AnnotateSelectedText = this.AnnotateSelectedText.bind(this)
        this.SelectMenuItem = this.SelectMenuItem.bind(this)
        this.ViewAnnotations=this.ViewAnnotations.bind(this)
        this.ViewSchemaForm=this.ViewSchemaForm.bind(this)
        this.HideAnnotations=this.HideAnnotations.bind(this)
        this.SelectAnnotationScheme=this.SelectAnnotationScheme.bind(this)
        this.HideSchemaForm=this.HideSchemaForm.bind(this)
        this.HideAnnotations=this.HideAnnotations.bind(this)
        this.DiffState = this.DiffState.bind(this)
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

 ChangeOrder(p1,p2){

        if(p1.line>p2.line){
            return true
        }
        else{
            if(p1.ch>p2.ch){
                 return true
            }
        }
return false


    }

    getSelectedText(editor, data) {
        console.log(data)
        console.log(editor)
        let reverse_order=this.ChangeOrder(data.ranges[0].anchor,data.ranges[0].head)
        if (reverse_order==true){
            let temp=data.ranges[0].anchor
            data.ranges[0].anchor=data.ranges[0].head
            data.ranges[0].head=temp

        }
        let start={line: data.ranges[0].anchor.line, ch: data.ranges[0].anchor.ch}
        let end={line: data.ranges[0].head.line, ch: data.ranges[0].head.ch}
        this.setState({selected_content:editor.getRange(start,end)})
        this.setState(prevState => ({
            selected_text: {
                ...prevState.selected_text,
                start: start,
                end: end
            }

        }))

    }

        ViewAnnotations(){
         if (this.state.options_status[3] == "enabled") {
        this.setState({viewshow:true})}
        }
        HideAnnotations(){
         this.setState({viewshow:false})
        }

            ViewSchemaForm(){

        this.setState({viewshow2:true})
        }
        HideSchemaForm(){
         this.setState({viewshow2:false})
        }



    AnnotateSelectedText() {
        /* if(this.state.annotate_status==true){
             console.log("annotate")
               this.setState({annotate_status:false})
         }*/
        if (this.state.options_status[1] == "enabled") {
            let editor = this.state.editor

            var markOptions = {css: "background-color: chartreuse"};


            editor.markText(this.state.selected_text.start, this.state.selected_text.end, markOptions);
             this.setState(prevState => ({
                                 annotations: [...prevState.annotations, this.state.selected_text], annotation_contents: [...prevState.annotation_contents, this.state.selected_content]
                                           }),function (){
                // console.log(this.state.annotation_contents)
               //  console.log(this.state.annotations)
             })
        }
    }

    CompareAnnotations(a1,a2){
         let foundstart=false
         let foundend= false
         if(a1.start.line==a2.start.line && a1.start.ch==a2.start.ch){
             foundstart=true
         }
         if(a1.end.line==a2.start.line && a1.end.ch==a2.start.ch){
             foundend=true
         }
        let found = (foundstart || foundend)
        return found
    }




     DeleteSelectedAnnotation() {

        if (this.state.options_status[4] == "enabled") {
              let selected_annotation=this.state.selected_text
              let found=false
              let editor = this.state.editor
              let markOptions = {css: "background-color: white"};
              for (let i=0;i<this.state.annotations.length;i++){
                  found=this.CompareAnnotations(this.state.annotations[i],selected_annotation)
                  if(found==true){
                       editor.markText(this.state.annotations[i].start, this.state.annotations[i].end, markOptions);
                       this.state.annotations.splice(i, 1);
                       this.state.annotation_contents.splice(i, 1);
                      break
                  }
              }

            console.log(this.state.annotation_contents)





}}





    setEditor(editor) {
        this.setState({editor: editor})
    }

    componentDidMount() {
        const data = this.getText();
        // console.log(data)

    }

    SelectAnnotationScheme(response) {

        const options_status = this.state.options_status.slice()
        for (let i = 1; i < 5; i++) {
            options_status[i] = "enabled"
        }
        this.setState({options_status: options_status});
        console.log(response)

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
        //   let filename=this.props.location.state


    }


    SelectMenuItem(id, colorname) {
        if (this.state.options_status[id] == "enabled") {
            const selectoptions = this.state.selectoptions.slice()
            selectoptions[id] = colorname
            this.setState({selectoptions: selectoptions});
        }
    }


    render() {
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
                                     onClick={this.ViewSchemaForm}></FontAwesomeIcon>
                    <FontAwesomeIcon style={{
                        marginRight: "5%",
                        cursor: "pointer",
                        color: (this.state.options_status[1] == "enabled") ? "black" : "gray",
                        backgroundColor: this.state.selectoptions[1]
                    }} className="fas fa-highlighter fa-2x" icon="highlighter"
                                     onMouseEnter={() => this.SelectMenuItem(1, "aquamarine")}
                                     onMouseLeave={() => this.SelectMenuItem(1, "transparent")}
                                     onClick={this.AnnotateSelectedText}></FontAwesomeIcon>
                    <FontAwesomeIcon style={{
                        marginRight: "5%",
                        cursor: "pointer",
                        color: (this.state.options_status[2] == "enabled") ? "black" : "gray",
                        backgroundColor: this.state.selectoptions[2]
                    }} className="far fa-save fa-2x" icon="save"
                                     onMouseEnter={() => this.SelectMenuItem(2, "aquamarine")}
                                     onMouseLeave={() => this.SelectMenuItem(2, "transparent")}></FontAwesomeIcon>
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
                                     onClick={this.props.ReturnMain}></FontAwesomeIcon>
                    {/*       <FaTimes size={22} onClick={this.props.ReturnMain} style={{cursor: "pointer",position:"absolute",top:0,right:0}} />*/}
                </div>
                <div>
                    <CodeMirror
                        value={this.state.text}
                        options={{

                            lineWrapping: true,
                            readOnly: 'nocursor'

                        }}
                        onChange={(editor, data, value) => {
                        }}
                        onSelection={(editor, data) => {
                            this.getSelectedText(editor, data)
                            // console.log(editor)
                            // console.log(data)

                        }}
                        editorDidMount={(editor) => this.setEditor(editor)}
                    /></div>
                    <SelectAnnotationSchema SelectAnnotationScheme={this.SelectAnnotationScheme} HideSchemaForm={this.HideSchemaForm} viewshow={this.state.viewshow2}/>
                <AnnotationsView HideAnnotations={this.HideAnnotations} viewshow={this.state.viewshow} annotations={this.state.annotations} annotation_contents={this.state.annotation_contents}/>
            </div>
        )
    }


}
export default DocumentViewer;