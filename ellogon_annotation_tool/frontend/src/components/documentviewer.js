import React, { Component } from "react";
import requestInstance from "../requestAPI";
import {UnControlled as CodeMirror} from 'react-codemirror2'
class DocumentViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filename: "",text:"",collection:"",project:""
        };

          this.getText = this.getText.bind(this)
        this.DiffState = this.DiffState.bind(this)
    }

     async getText(){
        const url='/fileoperation/document/open/'
        const userproject=this.props.location.state.project
        const useremail=localStorage.getItem("email")
        const  usercollection=this.props.location.state.collection
        const filename=this.props.location.state.filename
         let data = {
             "owner": useremail,
             "project": userproject,
             "collection": usercollection,
             "name": filename
         }
     try {
         let response = await requestInstance.get(url,{
    params: data
  })



         console.log(response)
         const res_data = (response.data).data;
         this.setState({
             text: res_data.text,
             filename:res_data.name,
             project:res_data.project,
             collection:res_data.collection
         });
        // console.log(message)
         return res_data;
     }catch(error){
         //console.log("Error: ", JSON.stringify(error, null, 4));
         this.props.history.push({pathname:"/sign-in"});
         throw error;
     }
 }



    componentDidMount() {
        const data = this.getText();
       // console.log(data)

    }

    DiffState(state1,state2){
        let diffstate=true
        Object.keys(state1).forEach(function(key) {
            if (state1[key]!=state2[key]){
                diffstate=false

            }
}
);
        console.log(diffstate)
        return diffstate
    }


    componentDidUpdate(prevProps, prevState, snapshot) {

      //  console.log(this.props.location.state)
      //  console.log(this.state)
      let   state1={ "filename":this.props.location.state.filename,"collection":this.props.location.state.collection,
          "project":this.props.location.state.project

        }
        let   state2={ "filename":this.state.filename,"collection":this.state.collection,
          "project":this.state.project

        }
        let update=this.DiffState(state1,state2)
        if (update==false){
            let data = this.getText();
        }
     //   let filename=this.props.location.state





    }









    render() {
        console.log(this.state.text)
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
            <CodeMirror
                        value={this.state.text}
                        options={{

                            lineWrapping:true,
                            readOnly:'nocursor'

                        }}
                        onChange={(editor, data, value) => {
                        }}
            />
        )
    }

}
export default DocumentViewer;