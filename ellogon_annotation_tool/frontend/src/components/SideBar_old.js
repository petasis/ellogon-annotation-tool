import React, { Component } from "react";
import {ProSidebar, Menu, MenuItem, SubMenu, SidebarContent, SidebarHeader, SidebarFooter} from 'react-pro-sidebar';
import {Link, withRouter} from 'react-router-dom';
import {
    FaUserEdit,
    FaSignOutAlt,
    FaHeart,
    FaTrashAlt,
    FaFolder,
    FaRegFolder,
    FaFileAlt,
    FaPlusCircle,
    FaEdit,
    FaArrowsAltH
} from "react-icons/fa";
import requestInstance from "../requestAPI";
import logo from '../images/EllogonCyan.png';


class SideBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userdata: [],update_count:0,collapsed:false
        };
        this.DeleteHandler=this.DeleteHandler.bind(this)
        this.AddViewHandler=this.AddViewHandler.bind(this)
        this.RenameViewHandler=this.RenameViewHandler.bind(this)
        this.RetrieveUserData=this.RetrieveUserData.bind(this)
        this.collapseSidebar=this.collapseSidebar.bind(this)

    }

    DeleteHandler(item,project,collection,filename){
       let  params={ item:item,project:project,collection:collection,filename:filename}
       /* this.setState(prevState => {
             return {update_count: prevState.update_count + 1}
                    })*/

        this.props.history.push({
        pathname: '/delete_item',
  search: '',
  state:  params
})

         //   console.log(item+","+project+","+ collection+","+filename);
    }

collapseSidebar(){


       this.setState({

      collapsed:!this.state.collapsed
    })


}

    AddViewHandler(item,project,collection,filename){
          console.log(this.props)
         let  params={ item:item,project:project,collection:collection,filename:filename}
       /*   this.setState(prevState => {
             return {update_count: prevState.update_count + 1}
                    })*/

          this.props.history.push({
        pathname: '/add_item',
  search: '',
  state:  params
})
        // console.log(item+","+project+","+ collection+","+filename);
    }

    RenameViewHandler(item,project,collection,filename){
         let  params={ item:item,project:project,collection:collection,filename:filename}
         /* this.setState(prevState => {
             return {update_count: prevState.update_count + 1}
                    })*/


          this.props.history.push({
        pathname: '/rename_item',
  search: '',
  state:  params
})


        // console.log(item+","+project+","+ collection+","+filename);
    }

async RetrieveUserData(){
       // console.log("retrieve_userdata")
       let useremail=localStorage.getItem(('email'))
        let url_request='/fileoperation/retrieve_userdata/'+useremail
        console.log(url_request)
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

     console.log(this.props.login_status)
        if (this.props.login_status==true){
           // console.log("request_block")
            const userdata = this.RetrieveUserData();
          //  console.log((userdata))

        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
       // console.log(prevProps.location.state)
       //   console.log(this.props.location.state)


        if (this.props.login_status == true) {

            if ((this.state.update_count == 0) || (prevState.update_count != this.state.update_count)) {
                  console.log("request_block")
                  const userdata = this.RetrieveUserData();
              //  console.log((userdata))

            }
            if(this.state.update_count == 0 ){
                this.setState(prevState => {
             return {update_count: prevState.update_count + 1}
                    })
            }
            if (this.props.location.state!=undefined ){

                if(this.props.location.state.change==true){
                    this.setState(prevState => {
             return {update_count: prevState.update_count + 1}
                    })
                    this.props.history.push({
                    pathname: '/main',
            search: '',
                 state: {msg:this.props.location.state.msg,className:"alert alert-success",change:false}
                        })
                }

            }





        }


    }
      render(){
        let documents=this.state.userdata
       /* let documents=[
            {"project":"Project0","collections":[]
            },
             {"project":"Project1","collections":[
                     {
                         "collection":"Collection1","documents":["file1.txt","file2.txt","file3.txt","file3v2.txt"]
                     },
                      {
                         "collection":"Collection2","documents":["file3v3.txt","file4.txt","file5.txt","file6.txt"]
                     },
                      {
                         "collection":"Collection3","documents":["file7.txt","file8.txt","file9.txt","file10.txt"]
                     }]},

            {"project":"Project2","collections":[
                {
                         "collection":"Collection4","documents":["file11.txt","file12.txt","file13.txt","file14.txt"]
                     },
                      {
                         "collection":"Collection5","documents":["file15.txt","file16.txt"]
                     }
                     ]
            },
            {"project":"Project3","collections":[

                {
                         "collection":"Collection6","documents":["file21.txt","file22.txt","file23.txt"]
                     },
                      {
                         "collection":"Collection7","documents":["file321.txt"]
                     }



                ]
            }]*/

          let document_list=[]
          let doc_items=[]
          let collection_items=[]
          let collections,docs,title
          for (const [index, value] of documents.entries()) {
               collections=value.collections
               for (const [index1, value1] of collections.entries()){
                   docs=value1.documents
                   for (const [index2, value2] of docs.entries()){
                       doc_items.push(<MenuItem icon={<FaFileAlt />}>
                           {value2}&nbsp;&nbsp;&nbsp;
                           <FaEdit onClick={() => this.RenameViewHandler("document",value.project,value1.collection,value2)}></FaEdit>&nbsp;&nbsp;&nbsp;
                           <FaTrashAlt  onClick={() => this.DeleteHandler("document",value.project,value1.collection,value2)} />


                       </MenuItem>)
                   }
                   title=<div>{value1.collection}&nbsp;&nbsp;&nbsp;
                   <FaPlusCircle onClick={() => this.AddViewHandler("document",value.project,value1.collection,null)}></FaPlusCircle>&nbsp;&nbsp;&nbsp;
                   <FaEdit onClick={() => this.RenameViewHandler("collection",value.project,value1.collection,null)}></FaEdit>&nbsp;&nbsp;&nbsp;
                     <FaTrashAlt  onClick={() => this.DeleteHandler("collection",value.project,value1.collection,value1.documents)} />

                   </div>
                   collection_items.push(<SubMenu title={title} icon={<FaFolder />}>

                       {doc_items}</SubMenu>)
                   doc_items=[]
               }
                title=<div>{value.project} &nbsp;&nbsp;&nbsp;
                <FaPlusCircle onClick={() => this.AddViewHandler("collection",value.project,null,null)}></FaPlusCircle> &nbsp;&nbsp;&nbsp;
                    <FaEdit onClick={() => this.RenameViewHandler("project",value.project,null,null)}></FaEdit> &nbsp;&nbsp;&nbsp;
                  <FaTrashAlt  onClick={() => this.DeleteHandler("project",value.project,value.collections,null)} />

               </div>
              document_list.push(<SubMenu title={title} icon={<FaRegFolder />}>

                  {collection_items}</SubMenu>)
               collection_items=[]
           }

     /*
          for (const [index, value] of documents.entries()) {

                        document_list.push(<SubMenu title={value.project} icon={<FaRegFolder />}>)
                        collection=value.collections
                        for (const [index1, value1] of collection.entries()){
                           document_list.push(<SubMenu title={value1.collection} icon={<FaFolder />}>)
                           docs=value1.documents
                           for (const [index2, value2] of docs.entries()){
                                  document_list.push(<MenuItem icon={<FaFolder />}>{value2}</MenuItem>)   }
                            document_list.push(</SubMenu>)
                               }
                           document_list.push(</SubMenu>)
                       }


             /*          collection=value.collections
                   for (const [index1, value1] of collection.entries()){
                  //      document_list.push(<SubMenu title={value1.collection} icon={<FaFolder />}>)
                      }
                  docs=value1.documents
                  for (const [index2, value2] of docs.entries()){
                     //   document_list.push(<MenuItem>{value2}</MenuItem>)

              }
*/














          return (
            <ProSidebar collapsed={this.state.collapsed}>
  <SidebarHeader>
      <img src={logo} alt="ELlogon Logo" width="50" height="50"/>
  </SidebarHeader>
  <SidebarContent>
       <Menu iconShape="square">
    <MenuItem icon={<FaUserEdit />} >Manage Profile
    <Link  to={"/user/profile_manage"}></Link>

    </MenuItem>
    <MenuItem icon={<FaSignOutAlt />} onClick={this.props.handleLogout}>Logout</MenuItem>
       </Menu>
         <Menu iconShape="square">

    <SubMenu   title={<div>Projects &nbsp;&nbsp;&nbsp;
        <FaPlusCircle onClick={() => this.AddViewHandler("project",null,null,null)}></FaPlusCircle>


    </div>}

             icon={<FaHeart />}>
          {document_list}
        {/*        <SubMenu title="Project0" icon={<FaHeart />}></SubMenu>
      <SubMenu title="Project1" icon={<FaHeart />}>
          <SubMenu title="Collection1" icon={<FaHeart />}>
               <MenuItem icon={<FaHeart />}>file1.txt</MenuItem>
              <MenuItem icon={<FaHeart />}>file2.txt</MenuItem>
              <MenuItem icon={<FaHeart />}>file3.txt</MenuItem>
               <MenuItem icon={<FaHeart />}> }>file3v2.txt</MenuItem>
          </SubMenu>
             <SubMenu title="Collection2" icon={<FaHeart />}>
               <MenuItem>file3v3.txt <FaTrashAlt  onClick={() => this.DeleteHandler("Project1","Collection2","file3v3.txt")} />


               </MenuItem>
              <MenuItem>file4.txt</MenuItem>
              <MenuItem>file5.txt</MenuItem>
               <MenuItem>file6.txt</MenuItem>
          </SubMenu>

             <SubMenu title="Collection3" icon={<FaHeart />}>
               <MenuItem>file7.txt</MenuItem>
              <MenuItem>file8.txt</MenuItem>
              <MenuItem>file9.txt</MenuItem>
               <MenuItem>file10.txt</MenuItem>
          </SubMenu>
    </SubMenu>
                 <SubMenu title="Project2" icon={<FaHeart />}>
          <SubMenu title="Collection4" icon={<FaHeart />}>
               <MenuItem>file11.txt</MenuItem>
              <MenuItem>file12.txt</MenuItem>
              <MenuItem>file13.txt</MenuItem>
               <MenuItem>file14.txt</MenuItem>
          </SubMenu>
             <SubMenu title="Collection5" icon={<FaHeart />}>
              <MenuItem>file15.txt</MenuItem>
               <MenuItem>file16.txt</MenuItem>
          </SubMenu>

    </SubMenu>
    <SubMenu title="Project3" icon={<FaHeart />}>
          <SubMenu title="Collection6" icon={<FaHeart />}>
               <MenuItem>file21.txt</MenuItem>
              <MenuItem>file22.txt</MenuItem>
              <MenuItem>file23.txt</MenuItem>

          </SubMenu>
             <SubMenu title="Collection7" icon={<FaHeart />}>
               <MenuItem>file321.txt</MenuItem>

          </SubMenu>

    </SubMenu>
        */}

    </SubMenu>
  </Menu>
  </SidebarContent>
  <SidebarFooter>
     <FaArrowsAltH size={30} className="qw" onClick={this.collapseSidebar}></FaArrowsAltH>
  </SidebarFooter>
</ProSidebar>


          )





        }










}

export default withRouter(SideBar);
