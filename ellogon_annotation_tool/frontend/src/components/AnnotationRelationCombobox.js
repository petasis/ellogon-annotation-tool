import React, { Component } from "react";



export default class AnnotationRelationCombobox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message:"",
            disabled:true,
            value:"-1",

        };
 this.handleChange=this.handleChange.bind(this)
  this.formOptions=this.formOptions.bind(this)
    }


handleChange(event) {

    this.setState({value: event.target.value});
   // console.log(typeof event.target.value)
   // console.log(this.props.arg)
    this.props.setRelationArg(this.props.arg,parseInt(event.target.value))

}

formOptions(){
        let omit_id=-1
        if(this.props.arg=="Arg 1"){
           // console.log("1")
            omit_id=this.props.args["Arg 2"]
        }
        if(this.props.arg=="Arg 2"){
          //   console.log("2")
            omit_id=this.props.args["Arg 1"]
        }


        let options=[]

       // console.log(this.props)
      //  console.log(omit_id)

         for (const [index, value] of this.props.annotation_contents.entries()){
             if (omit_id==index){
                 continue
             }
             options.push(<option value={index}>

                       {value.substring(0, 24)+"..."}


             </option>)



         }




    return options
}

componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.current_type==prevProps.element_type && this.props.current_type!=this.props.element_type){
             this.setState({value: "-1"});
             this.props.setRelationArg(this.props.arg,-1)

        }


}


    render(){

        let option_tags=this.formOptions()

       // console.log(this.props)




        return(
            <td>
            <div>
<select  value={this.state.value} onChange={this.handleChange}
        className="selectpicker"
        data-container="body"
        selectpicker=""
        select-collection="annotations" disabled={this.props.current_type==this.props.element_type?false:true}>
          <option value="-1">--- Select Annotation ---</option>
                        {option_tags}



</select>
</div>
            </td>
        )
        }

}


