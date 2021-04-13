import React, { Component } from "react";






class AnnotationEntry extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text:"",
            s:0
        };
 this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({text: event.target.value,s:1});
        this.props.SetProperty(event.target.value)



    }


componentDidMount() {


}


    componentDidUpdate(prevProps, prevState, snapshot)


          /* if(prevProps.disabled==false && this.props.disabled==true){
                this.setState({text:"",s:0})
                 this.props.SetProperty("")

            }*/
             {
            //console.log(this.state.s)
            //console.log(this.props.markedfield)
           // console.log(this.props.label)

            if (this.props.markedfield!=this.props.label && this.state.text!=""){
                this.setState({text:"",s:0})
                stop=true
            }



            if (this.props.markedfield==this.props.label){
                    let labels=this.props.property_labels
                    let index=labels.indexOf(this.props.markedfield)
                    if (index > -1) {
                            labels.splice(index, 1);
                            }
                    labels.push("when")
                    index=labels.indexOf(this.props.prevmarkedfield)
                    console.log(index)

                    console.log(this.props.prevmarkedfield)

                            if (this.state.s==prevState.s) {

                                if(this.props.property_value!="" && this.state.text!=this.props.property_value && this.state.s!=1 && index==-1){
                                        console.log("set")

                                this.setState({text: this.props.property_value, s: 2})}
                            }

            }




        }









    render(){

        return(
            <td colSpan={2}>
               <textarea className="form-control annotation-entry"  value=


                   {this.state.text} onChange={this.handleChange} style={{resize:"none"}}  rows={1} disabled={this.props.disabled}></textarea>
            </td>
        )
        }

}

export default AnnotationEntry;







