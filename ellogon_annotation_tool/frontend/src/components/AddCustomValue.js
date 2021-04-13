import React, {Component} from "react";
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

import {Button, OutlinedInput} from "@material-ui/core";

import ColorPicker from "./ColorPicker";
const useStyles = (theme) => ({
  root: {

      margin: theme.spacing(1),

      display: 'flex',
      flexWrap: 'wrap'

  },
     textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),

  }, button: {
        display: 'inline',
        marginLeft: 30,
    },
    myButtons: {
        textAlign: 'right',
    },




});



class AddCustomValue extends Component {

    constructor(props) {
        super(props);
        this.state = {
            button_value:"",
            button_label:"",
            button_color:"#aabbcc",
            submit_status:false
        };

    this.handleChange=this.handleChange.bind(this)
      this.Submit=this.Submit.bind(this)
    this.handleClose=this.handleClose.bind(this)
     this.getcolor=this.getcolor.bind(this)

    }


getcolor(color){
        this.setState({button_color:color},function (){
            console.log(this.state.button_color)
        })
}




 handleChange(event) {
        this.setState({[event.target.name]: event.target.value},function(){
            console.log(this.state)
        });


    }
handleClose(){
        this.props.HideSchemaForm("add-custom-value")
        window.$('#AddCustomValueForm').modal('hide')
        // this.props.history.push("/main");
}

Submit(event){
        event.preventDefault();
        if(this.state.button_value=="" || this.state.button_label==""){
            this.state({submit_status:true})

        }
        else{
            let  custom_value = {id: "custom_value_btn", title: this.state.button_value, label: this.state.button_label, color:this.state.button_color, type: "annotation-button",
                   colspan:null}
             this.props.AddCustomValueBtn(custom_value)
            this.setState({button_value:"",
            button_label:"",
            button_color:"#aabbcc",
            submit_status:false})
           this. props.HideSchemaForm("add-custom-value")
            window.$('#AddCustomValueForm').modal('hide')
        }




}




    componentDidMount() {



        if(this.props.add_custom_value_view==true){



        window.$('#AddCustomValueForm').modal('show')

        }




    }

 componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.add_custom_value_view==true && prevProps.add_custom_value_view==false){




        window.$('#AddCustomValueForm').modal('show')
      }






    }



    render() {


    const { classes } = this.props;





       // console.log(this.props.location.state)
        return (
            <div>
                 <form onSubmit={this.Submit}>
                <div className="modal modal"  id="AddCustomValueForm" tabIndex="-1" role="dialog"
                     aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" style={{maxWidth: "40%"}} role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLongTitle">Add Annotation Button</h5>
                                <button type="button" onClick={this.handleClose} className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>

                                  <div className="modal-body">
                                       <div className={classes.root}>

                                        <TextField
                                            error={(this.state.submit_status)}
                                            required
                                            fullWidth
                                            name="button_value"

                                    label="Button Value"
                                    style={{ margin: "8px" }}

                                    placeholder="Please enter an attribute for the new button..."
                                            helperText={(this.state.submit_status==true)?"This field is required":""}

                                     margin="normal"
                                    InputLabelProps={{
                                    shrink: true,
                                          }}
                                      variant="filled"
                                       value={this.state.button_value}
                                     onChange={this.handleChange}
                                         />
                                        <TextField
                                            error={(this.state.submit_status)}
                                            required
                                            id="filled-full-width"
                                    label="Button Label"
                                    style={{ margin: 8 }}
                                    placeholder="Please enter a label for the new button..."
                                            helperText={(this.state.submit_status==true)?"This field is required":""}
                                    fullWidth
                                     margin="normal"
                                    InputLabelProps={{
                                    shrink: true,
                                          }}
                                      variant="filled"
                                         name="button_label"
                                       value={this.state.button_label}
                                     onChange={this.handleChange}
                                         />


                                     <ColorPicker getcolor={this.getcolor}/>





                                       </div>








                            </div>
                            <div className="modal-footer">
                                 <div className={classes.myButtons}>
                                    <Button className={classes.button} variant="outlined" color="secondary" onClick={this.handleClose}>Cancel</Button>
                                    <Button type="submit" className={classes.button} variant="outlined" color="secondary">Submit</Button>
                                        </div>





                            </div>

                        </div>
                    </div>
                </div>

                </form>
            </div>
        )
    }

}
export default withStyles(useStyles)(AddCustomValue);