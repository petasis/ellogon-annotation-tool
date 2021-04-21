import React, { Component } from "react";
import TreeList from 'react-treelist';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import {FaMinusCircle} from "react-icons/fa";
import {Button} from "@material-ui/core";
const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();
  const DeleteRecord=(index)=> {
        let type="annotation"
        console.log(props.count)
        console.log(props.countd)
        console.log(props.countr)
        let l1=props.count
        if(index>=l1){
            if(props.countd!=0 && props.countr==0){
                 type="document_attribute"
            }
            if(props.countd==0 && props.countr!=0){
                 type="relation_attribute"
            }
        }
        console.log(type)
       props.Delete(index,type)

  }




  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.id}
        </TableCell>
        <TableCell align="right">{row.from}</TableCell>
        <TableCell align="right">{row.to}</TableCell>
        <TableCell align="right">{row.type}</TableCell>
          <TableCell align="right">
              <Button color="secondary" size={"large"}>
                <FaMinusCircle
                        onClick={() => DeleteRecord(row.id)}



                />

              </Button>


          </TableCell>

      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Details
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.detail.map((historyRow) => (
                    <TableRow>
                      <TableCell component="th" scope="row">
                        {historyRow.name}
                      </TableCell>
                      <TableCell>
                          <span style={{display:((historyRow.name=="Document Segment"||historyRow.name=="Arg1"||historyRow.name=="Arg2"))?"inline-block":"none"}}> <textarea style={{marginTop:"4%",resize:"both"}}  readOnly={true}
                                                                                                         value={historyRow.value}></textarea>
                          </span>
                          <span style={{display:(!(historyRow.name=="Document Segment"||historyRow.name=="Arg1"||historyRow.name=="Arg2"))?"inline-block":"none"}}> {historyRow.value}
                          </span>

                          </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}





class AnnotationsView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:[],textAreaValue:"",
            annotator_id:""
        };

    this.handleChange=this.handleChange.bind(this)
    this.Delete=this.Delete.bind(this)
    this.handleClose=this.handleClose.bind(this)
    this.defineAnnnotatorId=this.defineAnnnotatorId.bind(this)
    this.CreateButtonAnnotationList=this.CreateButtonAnnotationList.bind(this)
        this.displayannotationcontent=this.displayannotationcontent.bind(this)
    }


 handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
      //  console.log(event.target.value)

    }
handleClose(){
        this.props.HideAnnotations()
        window.$('#AnnotationsView').modal('hide')
        // this.props.history.push("/main");
}



Delete(index,type){
       this.props.DeleteAnnotation(index,type)
        let data = this.CreateButtonAnnotationList()
        //console.log(data.length)
        //let data=this.state.data
      //  data.splice(index, 1);
       //console.log(data)
        this.setState({data:data})
}

    //console.log(response)




    defineAnnnotatorId() {
        let annotator_id = this.props.annotator_params["kind"]
        let params=this.props.annotator_params["params"]
        let count=0
        for (const [key, value] of Object.entries(params)) {

                annotator_id = annotator_id+"_"+value


        }
      //  console.log(params)
        return annotator_id
    }

    CreateButtonAnnotationList(){
        let record = null
        let data = []
      //  console.log(this.props.annotation_properties)
        for (let i = 0; i < this.props.annotations.length; i++) {
            record = {
                id: i,
                from: "line: " + this.props.annotations[i].start.line + "," + "character: " + this.props.annotations[i].start.ch,
                to: "line: " + this.props.annotations[i].end.line + "," + "character: " + this.props.annotations[i].end.ch,
                type: this.props.annotator_params["params"].annotation,
                detail:[{name:"ID",value:i},{name:"Type",value:this.props.annotator_params["params"].annotation},
                    {name:"Annotator ID",value:this.defineAnnnotatorId()}, {name:"Document Segment",value:this.props.annotation_contents[i]},
                    {name:"Attribute",value:this.props.annotation_labels[i]+"("+this.props.annotation_titles[i]+")"}]}
               if(this.props.annotation_properties[i]!=""){

                        record["detail"].push({name:"",value:this.props.annotation_properties[i]})

               }


               data.push(record)

            record={}
        }
       // for(let i=0;)
        let j=this.props.annotations.length
        for (const [key, value] of Object.entries(this.props.document_attributes)) {
            record={id:j,from:"",to:"",type: this.props.annotator_params["params"].annotation,
                detail:[{name:"ID",value:j},{name:"Type",value:this.props.annotator_params["params"].annotation},
                    {name:"Annotator ID",value:this.defineAnnnotatorId()}, {name:"Document Attribute",value:key},
                    {name:"Attribute",value:"document "+key},{name:"",value:key+":"+value}]}
                data.push(record)
                j=j+1
                record={}

            }
         let k=0
         if(this.props.document_attributes.length==null){
             k=this.props.annotations.length
         }
        else{
            k=this.props.annotations.length+this.props.document_attributes.length
         }
         for (const [key, value] of Object.entries(this.props.relation_attributes)) {
             record={id:k,from:"",to:"",type:"argument_relation",detail:[{name:"ID",value:k},{name:"Type",value:"argument_relation"},
                    {name:"Annotator ID",value:this.defineAnnnotatorId()}, {name:"Type Attribute",value:value.type},
                    {name:"Arg1",value:this.props.annotation_contents[value.arg1]},{name:"Arg2",value:this.props.annotation_contents[value.arg2]}]}
             data.push(record)
             k=k+1
             record={}
         }

        return data

    }



    componentDidMount() {
        if(this.props.viewshow==true){
             let data = this.CreateButtonAnnotationList()
       /*  const annotator_id=this.defineAnnnotatorId()
            this.setState({annotator_id:annotator_id})

        let data = []
        let record = null
        for (let i = 0; i < this.props.annotations; i++) {
            record = {
                id: i,
                from: "line: " + this.props.annotations[i].start.line + "," + "character: " + this.props.annotations[i].start.ch,
                to: "line: " + this.props.annotations[i].end.line + "," + "character: " + this.props.annotations[i].end.ch,
                type: "",
                parentId: null
            }
            data.push(record)
        }*/
        this.setState({data:data})
        window.$('#AnnotationsView').modal('show')

        }




    }

 componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.viewshow==true && prevProps.viewshow==false){
             let data = this.CreateButtonAnnotationList()

           /* const annotator_id=this.defineAnnnotatorId()
            this.setState({annotator_id:annotator_id})
        let data = []
        let record = null
        for (let i = 0; i < this.props.annotations.length; i++) {
            record = {
                id: i,
                from: "line: " + this.props.annotations[i].start.line + "," + "character: " + this.props.annotations[i].start.ch,
                to: "line: " + this.props.annotations[i].end.line + "," + "character: " + this.props.annotations[i].end.ch,
                type: this.props.annotator_params["params"].annotation,
                parentId: null
            }
            data.push(record)


        }*/
          //console.log("Deleted")
         this.setState({data:data})
        window.$('#AnnotationsView').modal('show')
      }
        //console.log("alex")





    }


        // It's not the most straightforward thing to run an async method in componentDidMount
       // window.addEventListener('onbeforeunload', this.props.handleWindowClose);

        // Version 1 - no async: Console.log will output something undefined.
displayannotationcontent(row) {
    //event.preventDefault();
    // console.log(row)
    if (row != null) {

        this.setState({ textAreaValue: this.props.annotation_contents[row.id] });
    }

}






    render() {
      //  console.log(this.props.annotations.length)



        let data=this.state.data




// αnnotation_list
   /* const columns= [{

      title: 'AnnotationId',
      field: 'id',
      type: 'number',
    //  width: 100
    },{

      title: 'From',
      field: 'from',
      type: 'string',
    //  width: 100
    }, {
      title: 'To',
      field: 'to',
      type: 'string'
    }, {
      title: 'Type',
      field: 'type',
      type: 'string'
    }
    ];






     const options={
      minimumColWidth: 100,
      expandAll: true,
      canSelect: true,
       //  rowClass: "row-class"
    };
     const handlers={onSelectRow: this.displayannotationcontent}

// selected annotation_info
    const sa_columns=[{

      title: 'Name',
      field: 'name',
      type: 'string',
    //  width: 100
    },{

      title: 'Value',
      field: 'value',
      type: 'string',
    //  width: 100
    }]
*/

    //annotation_list table
        let annotation_list=null
        if(data.length>0){
            annotation_list=  <TableContainer component={Paper}>
                                 <Table aria-label="collapsible table">
                                     <TableHead>
                                     <TableRow>
                                     <TableCell />
            <TableCell>AnnotationId</TableCell>
            <TableCell align="right">From</TableCell>
            <TableCell align="right">To</TableCell>
            <TableCell align="right">Type</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <Row count={this.props.annotations.length} countd={Object.keys(this.props.document_attributes).length} countr={this.props.relation_attributes.length}

                 Delete={this.Delete} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
        }
        else{
             annotation_list=  <TableContainer component={Paper}>
             <Table></Table>
             <TableBody>
                 <TableCell>The document has not annotations</TableCell>
                  </TableBody>
             </TableContainer>

        }





       // console.log(this.props.location.state)
        return (
            <div>
                <div className="modal modal"  id="AnnotationsView" tabIndex="-1" role="dialog"
                     aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" style={{maxWidth: "80%"}} role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLongTitle">Document Annotations</h5>
                                <button type="button" onClick={this.handleClose} className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>

                                  <div className="modal-body">


                                          {annotation_list}



                                          {/*    <TreeList
                                             data={data}
                                             columns={columns}
                                             options={options}
                                            handlers={handlers}
                                            id={'id'}
                                            parentId={'parentId'}></TreeList>

                                <textarea style={{marginTop:"4%",resize:"both"}}  readOnly={true}
                                        value={this.state.textAreaValue}
*/}



                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={this.handleClose} className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="submit" className="btn btn-primary" onClick={this.handleClose}>Ok</button>

                            </div>

                        </div>
                    </div>
                </div>


            </div>
        )
    }

}
export default AnnotationsView;