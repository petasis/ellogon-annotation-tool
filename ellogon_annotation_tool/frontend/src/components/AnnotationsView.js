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

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="right">{row.id}</TableCell>
        <TableCell align="right">{row.from}</TableCell>
        <TableCell align="right">{row.to}</TableCell>
        <TableCell align="right">{row.type}</TableCell>
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
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row">
                        {historyRow.date}
                      </TableCell>
                      <TableCell>{historyRow.customerId}</TableCell>
                      <TableCell align="right">{historyRow.amount}</TableCell>
                      <TableCell align="right">
                        {Math.round(historyRow.amount * row.price * 100) / 100}
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

Row.propTypes = {
  row: PropTypes.shape({
    calories: PropTypes.number.isRequired,
    carbs: PropTypes.number.isRequired,
    fat: PropTypes.number.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        customerId: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      }),
    ).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    protein: PropTypes.number.isRequired,
  }).isRequired,
};



class AnnotationsView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:[],textAreaValue:"",
            annotator_id:""
        };

    this.handleChange=this.handleChange.bind(this)
    this.handleClose=this.handleClose.bind(this)
    this.defineAnnnotatorId=this.defineAnnnotatorId.bind(this)
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






    componentDidMount() {
        if(this.props.viewshow==true){
         const annotator_id=this.defineAnnnotatorId()
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
        }
        this.setState({data:data})
        window.$('#AnnotationsView').modal('show')

        }
    }

 componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.viewshow==true && prevProps.viewshow==false){
            const annotator_id=this.defineAnnnotatorId()
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


        }
        window.$('#AnnotationsView').modal('show')
        this.setState({data:data})}
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




        let data=this.state.data




// αnnotation_list
    const columns= [{

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
                                         <TreeList
                                             data={data}
                                             columns={columns}
                                             options={options}
                                            handlers={handlers}
                                            id={'id'}
                                            parentId={'parentId'}></TreeList>

                                <textarea style={{marginTop:"4%",resize:"both"}}  readOnly={true}
                                        value={this.state.textAreaValue}

                                         />


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