import React, {Component} from 'react';
import requestInstance from "../requestAPI";
import TreeList from 'react-treelist';
import {withRouter} from "react-router-dom";
import ReactDOM from "react-dom";
import {ControlledMenu, MenuItem} from '@szhsin/react-menu';

class UserItemView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userdata: [], update_count: 0,MenuOpen:false,anchorPoint:{x:0,y:0},params:null,menu_items:[]
        };
        this.OpenOptions=this.OpenOptions.bind(this)
        this.OpenMenu=this.OpenMenu.bind(this)
        this.CloseMenu=this.CloseMenu.bind(this)
        this.setAnchorPoint=this.setAnchorPoint.bind(this)
        this.RetrieveUserData=this.RetrieveUserData.bind(this)
        this.FileOperationHandler=this.FileOperationHandler.bind(this)


    }

    FileOperationHandler(item,pathname){


        let  params={ item:item,project:this.state.params.project,collection:this.state.params.collection,filename:this.state.params.filename}


        this.props.history.push({
        pathname: pathname,
  search: '',
  state:  params
})
}




OpenOptions(row){
       //event.preventDefault();
      // console.log(row)
    if(row!=null) {
        let item, project, collection
        let identifier = row.id
        let params = {}
        let precord = {}
        let documents = []
        let menuitems=[]
        switch (identifier.charAt(0)) {
            case "P":
                item = "project"
                project = row.name
                params["project"] = project
                let collections = (this.state.userdata.filter(obj => {
                    return (obj.parentName === row.name && obj.rootName == row.parentName)
                }))
                params["collection"] = []

                for (const [index, value] of collections.entries()) {
                    precord = {"collection": value.name, "documents": []}
                    documents = (this.state.userdata.filter(obj => {
                        return (obj.parentName === value.name && obj.rootName == value.parentName)
                    }))
                    for (const [index2, value2] of documents.entries()) {
                        precord["documents"].push(value2.name)
                    }
                    params["collection"].push(precord)
                }
                params["filename"]=null
                menuitems=[
                    {
                        name:"Add Project",
                        item:"project",
                        path:"/add_item"
                    },
                    {
                        name:"Add Collection",
                        item:"collection",
                        path:"/add_item"
                    },
                    {
                        name:"Rename Project",
                        item:"project",
                        path:"/rename_item"
                    },
                    {
                        name:"Delete Project",
                        item:"project",
                        path:"/delete_item"
                    }

                ]
                //params["document"]=[]
                break
            case "C":
                item = "collection"
                project = row.parentName
                params["project"] = project
                params["collection"] = row.name
                params["filename"] = []
                documents = (this.state.userdata.filter(obj => {
                    return (obj.parentName === row.name && obj.rootName == row.parentName)
                }))
               for (const [index, value] of documents.entries()) {
                    params["filename"].push(value.name)
               }
               // params["filename"] = documents
                  menuitems=[
                    {
                        name:"Add Document",
                        item:"document",
                        path:"/add_item"
                    },
                    {
                        name:"Rename Collection",
                        item:"collection",
                        path:"/rename_item"
                    },
                    {
                        name:"Delete Collection",
                        item:"collection",
                        path:"/delete_item"
                    }

                ]
                break
            case "D":
                item = "document"
                params["filename"] = row.name
                collection = row.parentName
                params["collection"] = collection
                project = (this.state.userdata.filter(obj => {
                    return obj.id === row.id
                }))
                //console.log(project[0].rootName)
                params["project"] = project[0].rootName
                menuitems=[
                    {
                        name:"Open Document",
                        item:"document",
                        path:"/document_view"
                    },
                    {
                        name:"Rename Document",
                        item:"document",
                        path:"/rename_item"
                    },
                    {
                        name:"Delete Document",
                        item:"document",
                        path:"/delete_item"
                    }

                ]




                break
        }
        this.setState({params: params,menu_items:menuitems})
        this.OpenMenu()
        //console.log(params)
    }


     /*  if(row!=null){
      //  this.setAnchorPoint(event)
      // this.OpenMenu()
       }
*/
        if(row==null){
      //  this.setAnchorPoint(event)
     //  this.CloseMenu()

        }


        }

setAnchorPoint(event) {

       // if(this.state.MenuOpen==false){
           this.setState({anchorPoint:{ x: event.screenX, y: event.screenY-100 }})

    //    }
     // console.log("mouse position")
   //  console.log(event.screenX+","+event.screenY)
   //  this.setState({anchorPoint:{ x: event.screenX, y: event.screenY-100 }})
    //this.setState({ x: e.screenX, y: e.screenY });
  }



OpenMenu(){
         this.setState({

      MenuOpen:true
    })
}

CloseMenu(){
        this.setState({

      MenuOpen:false
    })
}
  //  FileOperationHandler(item,project,collection,filename,pathname){
       /* let  params={ item:item,project:project,collection:collection,filename:filename}
this.FileOperationHandler=this.FileOperationHandler.bind(this)

        this.props.history.push({
        pathname: pathname,
  search: '',
  state:  params
})*/



    async RetrieveUserData(){
       // console.log("retrieve_userdata")
       let useremail=localStorage.getItem(('email'))
        let url_request='/fileoperation/retrieve_userdata_details/'+useremail
        //console.log(url_request)
try {
        let response = await requestInstance.get(url_request);
     //   console.log(response)
        let userdata = response.data.userdata;
        this.setState({
            userdata: userdata,
        });
      //  console.log(userdata)
        return userdata;
    }catch(error){
        //console.log("Error: ", JSON.stringify(error, null, 4));
        this.props.history.push({pathname:"/sign-in"});
        throw error;
    }
}


    componentDidMount(){
        // It's not the most straightforward thing to run an async method in componentDidMount
       // window.addEventListener('onbeforeunload', this.props.handleWindowClose);

        // Version 1 - no async: Console.log will output something undefined.
       // console.log(this.state.collapsed)
         console.log(this.props.login_status)
        if (this.props.login_status==true){
           // console.log("request_block")
            const userdata = this.RetrieveUserData();
          // console.log((userdata))

        }
      // let node = ReactDOM.findDOMNode(this);
       // console.log(node)

       // children.addEventListener("click",this.OpenOptions() );
       //
        // document.getElementsByClassName("row-class").addEventListener("click",this.OpenOptions() );

    }



    componentDidUpdate(prevProps, prevState, snapshot) {
        // console.log(prevProps.location.state)
        //   console.log(this.props.location.state)


        if (this.props.login_status == true) {

            if ((this.state.update_count == 0) || (prevState.update_count != this.state.update_count)) {
               // console.log("request_block")
                const userdata = this.RetrieveUserData();
                //  console.log((userdata))

            }
            if (this.state.update_count == 0) {
                this.setState(prevState => {
                    return {update_count: prevState.update_count + 1}
                })
            }
            if (this.props.location.state != undefined) {

                if (this.props.location.state.change == true) {
                    this.setState(prevState => {
                        return {update_count: prevState.update_count + 1}
                    })
                 /*   this.props.history.push({
                        pathname: '/main',
                        search: '',
                        state: {msg: this.props.location.state.msg, className: "alert alert-success", change: false}
                    })*/
                }

            }
        }
    }


    render() {




        let data=this.state.userdata

      //  console.log(data)
        const columns= [{

      title: 'ItemId',
      field: 'id',
      type: 'string',
    //  width: 100
    },{

      title: 'Name',
      field: 'name',
      type: 'string',
    //  width: 100
    }, {
      title: 'Encoding',
      field: 'encoding',
      type: 'string'
    }, {
      title: 'Created',
      field: 'created',
      type: 'string'
    }
    ,
    {
      title: 'Updated',
      field: 'updated',
      type: 'string'
    }

    ];
     const options={
      minimumColWidth: 100,
      expandAll: true,
      canSelect: true,
       //  rowClass: "row-class"
    };
     const handlers={onSelectRow: this.OpenOptions}
     let menuitems=[]
     for (const [index, value] of this.state.menu_items.entries()) {

         menuitems.push(
             <MenuItem  onClick={() => this.FileOperationHandler(value.item,value.path)}>{value.name}</MenuItem>)


     }



     return(<div onClick={this.setAnchorPoint}>
         <TreeList
  data={data}
  columns={columns}
  options={options}
  handlers={handlers}
  id={'name'}
  parentId={'parentName'}></TreeList>

                 <ControlledMenu anchorPoint={this.state.anchorPoint} isOpen={this.state.MenuOpen}
                onClose={this.CloseMenu}>
                     {menuitems}
                     {/*}  <MenuItem>Cut</MenuItem>
                <MenuItem>Copy</MenuItem>
                <MenuItem>Paste</MenuItem>*/}
            </ControlledMenu>

     </div>)


    }


}
export  default  withRouter(UserItemView)