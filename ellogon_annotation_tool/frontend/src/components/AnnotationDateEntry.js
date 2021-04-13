import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React, {Component} from "react";


class AnnotationDateEntry extends Component {

constructor(props) {
        super(props);
        var today = new Date();
         var dd = String(today.getDate()).padStart(2, '0');
         var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
         var yyyy = today.getFullYear();

         today =yyyy + '-' + mm + '-' + dd;
        // console.log(today)
        this.state = {
            date:today,
            today:today,
            s:0
        };
 this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        // console.log(this.state.date)


        this.setState({date: event.target.value,s:1});
        this.props.SetProperty(event.target.value)
    }
     componentDidUpdate(prevProps, prevState, snapshot)

        {

            if (this.props.markedfield!="when" && this.state.date!=this.state.today){
                this.setState({date:this.state.today,s:2})

            }
            if (this.props.markedfield=="when"){


                            console.log(this.state.s)
                             console.log(prevState.s)
                            if (this.state.s==prevState.s) {

                                if(this.props.default_value==""){
                                    this.setState({date:this.state.today,s:2})
                                }
                                else{
                                this.setState({date: this.props.default_value, s: 3})}
                            }

            }


           /*  if (this.props.markedfield=="when" && this.state.date!=this.props.default_value){
                 this.setState({date:this.props.default_value})
                 // this.setState({date:this.state.today,s:2})
             }*/



               // this.setState({date:this.state.today})
             //   console.log("other date field")
            }







    render()
    {

      /*  var today = new Date();
         var dd = String(today.getDate()).padStart(2, '0');
         var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
         var yyyy = today.getFullYear();

         today =yyyy + '-' + mm + '-' + dd;*/


        return (
            <td colSpan={2}>
                <div className="input-group col-md-12 annotation-date-entry">
                    <input annotation-type={this.props.annotationType}  disabled={this.props.disabled}
                           annotation-attribute={this.props.annotationAttribute} //type="text"
                           type="date"
                           value={this.state.date}

                                onChange={this.handleChange}
                           //
                        // {this.state.date}
                        // className="form-control datepicker-input" datepicker-popup={this.props.format}
                           //datepicker-options="dateOptions" close-text="Close"/>
                        />
                    {/*    <span className="input-group-btn date-entry-btn">
                        <button type="button" className="btn btn-default btn-sm datepicker-btn" disabled={this.props.disabled}>
                            <FontAwesomeIcon className="fa fa-calendar-minus-o" icon={"calendar-minus"}></FontAwesomeIcon>
                        </button>
                    </span>*/}
                </div>
            </td>
        )
    };
}
export default AnnotationDateEntry;






