import React, { Component } from "react";
import TreeList from 'react-treelist';

class AnnotationsView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:[],textAreaValue:""
        };

    this.handleChange=this.handleChange.bind(this)
    this.handleClose=this.handleClose.bind(this)
    this.handleSubmit=this.handleSubmit.bind(this)
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




  handleSubmit(event) {



    }
    //console.log(response)












    componentDidMount() {
        if(this.props.viewshow==true){
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
            console.log("run")
        let data = []
        let record = null
        for (let i = 0; i < this.props.annotations.length; i++) {
            record = {
                id: i,
                from: "line: " + this.props.annotations[i].start.line + "," + "character: " + this.props.annotations[i].start.ch,
                to: "line: " + this.props.annotations[i].end.line + "," + "character: " + this.props.annotations[i].end.ch,
                type: "",
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