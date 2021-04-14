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
         console.log(today)
        this.state = {
            date:today,
        };
 this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        // console.log(this.state.date)


        this.setState({date: event.target.value});
        this.props.SetProperty(event.target.value)
    }



    render()
    {




        return (
            <td colSpan={2}>
                <div className="input-group col-md-12 annotation-date-entry">
                    <input annotation-type={this.props.annotationType}  disabled={this.props.disabled}
                           annotation-attribute={this.props.annotationAttribute} //type="text"
                           type="date"
                           value={this.state.date} onChange={this.handleChange}
                           //className="form-control datepicker-input" datepicker-popup={this.props.format}
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






