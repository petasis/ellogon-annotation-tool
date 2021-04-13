import React, { Component } from "react";
import requestInstance from "../requestAPI";
import ToggleButton from 'react-toggle-button'
import {Check,X} from "./toggle_icons"
import {Redirect} from 'react-router-dom';
import {FaArrowLeft, FaArrowRight, FaMinusCircle, FaTimes} from "react-icons/fa";
import {MenuItem} from "react-pro-sidebar";
class AddItem extends Component {

    constructor(props) {
        super(props);
      //  this.fileReader=[]
       // this.index=0
       // this.text=[]
        this.state = {
            name:"",handler:"",encoding:"UTF-8",public:false,selectefile:null,filenames:[],texts:[],doc_encodings:[],doc_handlers:[], doc_publics:[],index:0
        };


    this.handleChange=this.handleChange.bind(this)
    this.onFileChange=this.onFileChange.bind(this)
     this.handleFileRead=this.handleFileRead.bind(this)
    this.handleSubmit=this.handleSubmit.bind(this)
     this.Next=this.Next.bind(this)
      this.Back=this.Back.bind(this)
      this.StoreDocData=this.StoreDocData.bind(this)
        this.DeleteDoc=this.DeleteDoc.bind(this)
        this.getFiles=this.getFiles.bind(this)
        this.dragOver=this.dragOver.bind(this)
        this.dragEnter=this.dragEnter.bind(this)
        this.dragLeave=this.dragLeave.bind(this)
        this.fileDrop= this.fileDrop.bind(this)

    }


capitalizeTitle(title){
        return  title.charAt(0).toUpperCase() + title.slice(1);
}

handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
        console.log(event.target.value)

    }

   handleFileRead(file) {
    var name = file.name;
    var reader = new FileReader();
    reader.onload = (function(event) {
        // get file content
        var text = event.target.result;
       // console.log(text)
        this.setState(prevState => ({
                     texts: [...prevState.texts, text]
                                }))
    }).bind(this)
    reader.readAsText(file);
}

getFiles(files){
        if (this.props.location.state.item == "document") {
            for (let j = 0; j <files.length; j++) {
                this.setState(prevState => ({
                     filenames: [...prevState.filenames, files[j].name]
                 }))
                 this.handleFileRead(files[j])
            }
        }
        let ncount=files.length


             for(let y=0;y<ncount;y++){
                    this.setState(prevState => ({
                                 doc_encodings: [...prevState.doc_encodings, "UTF-8"],  doc_handlers: [...prevState.doc_handlers, ""],doc_publics: [...prevState.doc_publics, false]
                                           }))
        }

}


     onFileChange(event) {
         event.preventDefault()
         const files = event.target.files;
         this.getFiles(files)
         // console.log(event.target.files[0])
     /*    if (this.props.location.state.item == "document") {
             //   console.log(event.target.files)
             //let  filenames=[]
             let tex
             for (let j = 0; j < event.target.files.length; j++) {
                 //  console.log(event.target.files[j].name)
                 this.setState(prevState => ({
                     filenames: [...prevState.filenames, event.target.files[j].name]
                 }))
                 this.handleFileRead(event.target.files[j])


             }
          //   console.log("here")
             let ncount=event.target.files.length


             for(let y=0;y<ncount;y++){
                    this.setState(prevState => ({
                                 doc_encodings: [...prevState.doc_encodings, ""],  doc_handlers: [...prevState.doc_handlers, ""],doc_publics: [...prevState.doc_publics, false]
                                           }))
        }




         }*/

}



 async handleSubmit(event) {
    event.preventDefault();
    const type=this.props.location.state.item
    const useremail=localStorage.getItem("email")
    let userproject =""
    let url="/fileoperation/"
    let data={}
    let message
    switch(type) {
       case "project":
          url=url+"project/create/"
          data={"name":this.state.name,encoding:this.state.encoding,public:this.state.public,owner:useremail}
          message="The creation of project "+this.state.name
           break;
     case "collection":
           url=url+"collection/create/"
           userproject=this.props.location.state.project
           data={"name":this.state.name,encoding:this.state.encoding,handler:this.state.handler, public:this.state.public,owner:useremail,project:userproject}
             message="The creation of collection "+this.state.name+" of project "+userproject
           break;
      case "document":
            url=url+"document/upload/"
           // this.StoreDocData()
            userproject=this.props.location.state.project
            const  usercollection=this.props.location.state.collection
            data=[]
            let doc_count=this.state.filenames.length-1
            let  record={
                    name:this.state.filenames[doc_count],
                    external_name:this.state.filenames[doc_count],
                    text:this.state.texts[doc_count],
                    encoding:this.state.encoding,
                    handler:this.state.handler,
                    public:this.state.public,
                    owner:useremail,
                    updated_by:useremail,
                    project:userproject,
                    collection:usercollection
                }
            for(let k=doc_count;k>=0;k--){
                if(k==doc_count){
                    data.push(record)
                    continue
                }

                record={
                    name:this.state.filenames[k],
                    external_name:this.state.filenames[k],
                    text:this.state.texts[k],
                    encoding:this.state.doc_encodings[k],
                    handler:this.state.doc_handlers[k],
                    public:this.state.doc_publics[k],
                    owner:useremail,
                    updated_by:useremail,
                    project:userproject,
                    collection:usercollection
                }
                data.push(record)
            }
          //  console.log(data[0])
        //  console.log(this.state.doc_handlers)
           // data={name:this.state.selectedfile.name,external_name:this.state.selectedfile.name,encoding:this.state.encoding,handler:this.state.handler,text:this.state.text,public:this.state.public,owner:useremail,updated_by:useremail,project:userproject,collection:usercollection}
             message="The upload of document(s) "+this.state.name+" of collection "+usercollection +" of project "+userproject
            break;
    // code block
}
    // console.log(url)
     //console.log(data)
    let msg

        try {

            const response = await requestInstance.post(url, data);
            msg = message + " was done successfully"
            this.props.history.push({
                pathname: '/main',
                search: '',
                state: {msg: msg, className: "alert alert-success", change: true}
            })
            return response;
        } catch (error) {
            msg = msg = message + " was failed"
            this.props.history.push({
                pathname: '/main',
                search: '',
                state: {msg: msg, className: "alert alert-danger", change: false}
            })
        }
    }

    StoreDocData(){
         const doc_encodings = this.state.doc_encodings.slice()
         doc_encodings[this.state.index] = this.state.encoding
         const doc_handlers = this.state.doc_handlers.slice()
         doc_handlers[this.state.index] = this.state.handler
         const doc_publics = this.state.doc_publics.slice()
         doc_publics[this.state.index] = this.state.public
        this.setState({doc_encodings: doc_encodings,doc_handlers:doc_handlers,doc_publics:doc_publics},function(){ console.log(this.state) })
    }


    //console.log(response)
    Next(event){
         event.preventDefault();
         this.StoreDocData()
         this.setState({encoding:this.state.doc_encodings[this.state.index+1],handler:this.state.doc_handlers[this.state.index+1],public:this.state.doc_publics[this.state.index+1]}
         )
          //set the new state
        this.setState(prevState => {
       return {index: prevState.index + 1}
    })
    };
Back(event){
    event.preventDefault();
     this.StoreDocData()
    this.setState({encoding:this.state.doc_encodings[this.state.index-1],handler:this.state.doc_handlers[this.state.index-1],public:this.state.doc_publics[this.state.index-1]}
         )
 this.setState(prevState => {
       return {index: prevState.index - 1}
    })
};


DeleteDoc(){
    this.state.filenames.splice(this.state.index, 1);
   this.state.texts.splice(this.state.index, 1);
   this.state.doc_encodings.splice(this.state.index, 1);
   this.state.doc_handlers.splice(this.state.index, 1);
   this.state.doc_publics.splice(this.state.index, 1);
   this.setState({name:"A"},function(){ console.log(this.state) })
    let new_index=this.state.index
    if(new_index==this.state.filenames.length){
        new_index=new_index-1
        this.setState(prevState => {
       return {index: prevState.index - 1}})
    }
    this.setState({encoding:this.state.doc_encodings[new_index],handler:this.state.doc_handlers[new_index],public:this.state.doc_publics[new_index]})
  /*  if (this.state.index!=0){
     //    this.setState({encoding:this.state.doc_encodings[this.state.index-1],handler:this.state.doc_handlers[this.state.index-1],public:this.state.doc_publics[this.state.index-1]})
        this.setState(prevState => {
       return {index: prevState.index - 1}
    })
    }
    else{
       //  this.setState({encoding:this.state.doc_encodings[this.state.index+1],handler:this.state.doc_handlers[this.state.index+1],public:this.state.doc_publics[this.state.index+1]})
        this.setState(prevState => {
       return {index: prevState.index + 1}
    })
    }*/



}
// DRAG & DROP
dragOver(event){
    event.preventDefault();
}

dragEnter(event) {
    event.preventDefault();
}

dragLeave(event){
    event.preventDefault();
}

fileDrop(event) {
    event.preventDefault();
    const files = event.dataTransfer.files;
    this.getFiles(files)
}


componentDidCatch(error, errorInfo) {
        console.log("executed")

}



    componentDidMount(){

        // It's not the most straightforward thing to run an async method in componentDidMount
       // window.addEventListener('onbeforeunload', this.props.handleWindowClose);

        // Version 1 - no async: Console.log will output something undefined.

    }



    render() {



       // if (this.location.state)
        /*try {
            let type = this.props.location.state.item
        } catch (err) {
        c
        }*/
        /*if (this.props.location.state===undefined){
            this.props.ReturnMain()
        }
        */



            if(this.props.location.state==null){

                return <Redirect to='/sign-in' />
            }

              let type = this.props.location.state.item

            let submitview
            if (type == "project" || type == "collection") {
                submitview = true


            } else {
                if (this.state.index == (this.state.filenames.length - 1)) {
                    submitview = true
                } else {
                    submitview = false
                }
            }


            // this.setState({ item: this.props.location.state.item });
            //  console.log(this.props.location.state.item)
            let fieldname = <div className="form-group">
                <label>Name</label>
                <input type="text" name="name" className="form-control" placeholder="Name" value={this.state.name}
                       onChange={this.handleChange} required/>
            </div>
            let field_handler = <div className="form-group">
                <label>Handler</label>
                <input type="text" name="handler" className="form-control" placeholder="Handler"
                       value={this.state.handler} onChange={this.handleChange} required/>
            </div>
            let common_fields = []
            common_fields.push(<div className="form-group">
                <label>Encoding</label><br/>
                <select name="encoding" value={this.state.encoding} onChange={this.handleChange}>
                    <option value="UTF-8">UTF-8</option>
                    <option value="UNICODE">UNICODE</option>
                    <option value="ASCII">ASCII</option>
                    <option value="OTHER">OTHER</option>
                </select>
            </div>)
            common_fields.push(<div className="form-group">
                <label>Public</label>
                <ToggleButton
                    inactiveLabel={<X/>}
                    activeLabel={<Check/>}
                    value={this.state.public}
                    onToggle={(value) => {
                        this.setState({
                            public: !value,
                        })
                    }}/>
            </div>)
            let documentbrowser = <div className="form-group">
                <label for="files">Browser or Drag/Drop your files</label><br/>
                <input id="files" type="file" accept="text/plain" multiple onChange={this.onFileChange}
                       className="drop-container"
                       onDragOver={this.dragOver}
                       onDragEnter={this.dragEnter}
                       onDragLeave={this.dragLeave}
                       onDrop={this.fileDrop}
                />
            </div>
            let form_fields = []
            if (type == "project" || type == "collection") {
                form_fields.push(fieldname)
                form_fields.push(common_fields)
            }
            if (type == "collection") {
                form_fields.push(field_handler)
            }
            if (type == "document") {
                form_fields.push(documentbrowser)


                let item
                for (const [index, value] of this.state.filenames.entries()) {
                    item = <div style={{display: (this.state.index == index) ? "block" : "none"}}>
                        <h5> Filename:{value} &nbsp;&nbsp;
                            <span style={{color: 'red', cursor: "pointer"}}><FaMinusCircle
                                onClick={this.DeleteDoc}/></span></h5>
                        {field_handler}
                        {common_fields}
                        <span> < button className="btn btn-dark btn-block"
                                        style={{display: (this.state.index != 0) ? "block" : "none"}}
                                        onClick={this.Back}> <FaArrowLeft/> < /button>
                          < button className="btn btn-dark btn-block"
                                   style={{display: (this.state.index != (this.state.filenames.length - 1)) ? "block" : "none"}}
                                   onClick={this.Next}> <FaArrowRight/> < /button></span>
                    </div>
                    form_fields.push(item)


                    //   let test=<p style={{display:(this.state.filecount!=0) ? "block":"none"}}>Files selected:{this.state.filecount} </p>
                    //  form_fields.push(test)
                }
            }
            if (type == "document") {
                type = "documents"
            }



        return (
            <div>

                 <FaTimes onClick={this.props.ReturnMain} style={{

                    cursor: "pointer",position:"relative",top:0,right:0}} />

                <h3> New {this.capitalizeTitle(type)}


                </h3>
                <form onSubmit={this.handleSubmit}>
                    {form_fields}
                    {/* <div style={{display:(this.props.location.state==1) ? "block":"none"}}  className="alert alert-success" role="alert">
                    Your account has been created, see your email
                </div>
             <div style={{display:(this.props.location.state==0) ? "block":"none"}}  className="alert alert-danger" role="alert">The creation of account failed due to invalid data</div>
                <h3>Sign Up</h3>
                */}

                <button type="submit" className="btn btn-primary btn-block" style={{display: (submitview) ? "block" : "none",marginTop: "8%"}}>Add</button>

                </form>





            </div>
        )
    }
}

export default AddItem;