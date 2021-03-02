import React, { Component } from "react";
import requestInstance from "../requestAPI";
import ToggleButton from 'react-toggle-button'
import {Check,X} from "./toggle_icons"
class AddItem extends Component {
    constructor(props) {
        super(props);
        this.fileReader=null
        this.state = {
            name:"",handler:"",encoding:"UTF-8",public:false,selectefile:null,text:""
        };
    this.handleChange=this.handleChange.bind(this)
    this.onFileChange=this.onFileChange.bind(this)
     this.handleFileRead=this.handleFileRead.bind(this)
    this.handleSubmit=this.handleSubmit.bind(this)
    }


capitalizeTitle(title){
        return  title.charAt(0).toUpperCase() + title.slice(1);
}

handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
   //    console.log(event.target.value)

    }
handleFileRead(event) {
    const content = this.fileReader.result;
    console.log(content)
    this.setState({text: content});
    // … do something with the 'content' …
  };
     onFileChange(event){
        event.preventDefault()
        // console.log(event.target.files[0])
         if(this.props.location.state.item=="document"){
                 this.setState({ selectedfile: event.target.files[0] });
                 this.fileReader = new FileReader();
                 this.fileReader.onloadend = this.handleFileRead;
                 this.fileReader.readAsText(event.target.files[0]);}
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
            userproject=this.props.location.state.project
            const  usercollection=this.props.location.state.collection
            data={name:this.state.selectedfile.name,external_name:this.state.selectedfile.name,encoding:this.state.encoding,handler:this.state.handler,text:this.state.text,public:this.state.public,owner:useremail,updated_by:useremail,project:userproject,collection:usercollection}
             message="The upload of document "+this.state.name+" of collection "+usercollection +" of project "+userproject
            break;
    // code block
}
    // console.log(url)
     //console.log(data)
    let msg
    try {
        const response = await requestInstance.post(url, data);
        msg=message+" was done successfully"
         this.props.history.push({
            pathname: '/main',
            search: '',
                 state: {msg:msg,className:"alert alert-success",change:true}
                        })
        return response;
    } catch (error) {
        msg= msg=message+" was failed"
        this.props.history.push({
  pathname: '/main',
  search: '',
  state: {msg:msg,className:"alert alert-danger",change:false}
})}

    }
    //console.log(response)


    componentDidMount(){
        // It's not the most straightforward thing to run an async method in componentDidMount
       // window.addEventListener('onbeforeunload', this.props.handleWindowClose);

        // Version 1 - no async: Console.log will output something undefined.

    }




    render(){
       let type=this.props.location.state.item
      // this.setState({ item: this.props.location.state.item });
       //  console.log(this.props.location.state.item)
        let fieldname=  <div className="form-group">
                    <label>Name</label>
                    <input type="text" name="name" className="form-control" placeholder="Name" value={this.state.name} onChange={this.handleChange} required />
                </div>
       let field_handler=<div className="form-group">
                    <label>Handler</label>
                    <input type="text" name="handler" className="form-control" placeholder="Handler" value={this.state.handler} onChange={this.handleChange} required />
                </div>
        let common_fields=[]
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
  }} />
                    </div>)
let documentbrowser=<div className="form-group">
                    <label>Upload File</label><br/>
                    <input type="file" onChange={this.onFileChange} />
    </div>
   let form_fields=[]
        if( type=="project" || type=="collection"){
            form_fields.push(fieldname)
        }
         if( type=="document" || type=="collection"){
              form_fields.push(field_handler)
         }
         if( type=="document"){
              form_fields.push(documentbrowser)
         }
        form_fields.push(common_fields)

        return (
            <div>
                <h3> New {this.capitalizeTitle(type)} </h3>
                <form onSubmit={this.handleSubmit}>
                    {form_fields}
                    {/* <div style={{display:(this.props.location.state==1) ? "block":"none"}}  className="alert alert-success" role="alert">
                    Your account has been created, see your email
                </div>
             <div style={{display:(this.props.location.state==0) ? "block":"none"}}  className="alert alert-danger" role="alert">The creation of account failed due to invalid data</div>
                <h3>Sign Up</h3>
                */}
              <button type="submit" className="btn btn-primary btn-block">Submit</button>
            </form>





            </div>
        )
    }
}

export default AddItem;