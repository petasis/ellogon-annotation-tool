import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FixedSizeList } from 'react-window';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {Button, FormControl, InputLabel, List, ListItem, ListItemText, MenuItem, Select} from "@material-ui/core";
import {
    getAttributeAlternatives,
    getAttributes, getCoreferenceAttributes,
    getLanguages, getSchema,
    getTypes, getValues,
    schemerequestInstance
} from "../AnnotationSchemeAPI";
//import {schemerequestInstance,getLanguages, getTypes, getAttributes, getAttributeAlternatives, getValues, getCoreferenceAttributes
//} from "../AnnotationSchemeAPI"
const useStyles = makeStyles((theme) => ({
    button: {
        display: 'inline',
        marginLeft: 30,
    },
    myButtons: {
        textAlign: 'right',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 300,
        maxWidth: 300,
        position: "relative",
    },
    root: {
        width: '100%',
        height: 200,
        maxWidth: 200,
        backgroundColor: theme.palette.background.paper,
        marginTop: 30,
    },
    myTab:{
        maxWidth: 700,
    },
    titleStyle:{
color: 'red',
// fontSize: 20,
},
}));

// switches content according to selected tab
function TabPanel(props) {
  const { children, value, index} = props;
  const classes = useStyles();
  return (
    <div className={classes.myTab}>
      {value === index && (
          <h6>{children}</h6>
      )}
    </div>
  );
}

function ItemRenderer(props){
     const item = this.props.data[this.props.index];
     return (

      <div style={this.props.style}>

        {item}

      </div>

    );

  }



const rowValue = ({ index, style }) => (
  <div style={style}>Value {index}</div>
);


export default function AnnotationSchemeSelection(props) {

    const classes = useStyles();
    const [mode,setMode]=React.useState('button');
    const [languages,setLanguages]=React.useState([]);
    const [annotationtypes,setTypes]=React.useState([])
    const [annotationattributes,setAttributes]=React.useState([])
     const [attribute_alternatives,setAttributeAlternatives]=React.useState([])
     const [values,setValues]=React.useState([])
    const [coreferenceattributes,setCoreferenceAttributes]=React.useState([])
    const [tabValue, setTabValue] = React.useState(0);
    const [b_language, setLanguageB] = React.useState('');
    const [b_annotationType, setAnnotationTypeB] = React.useState('');
    const [b_annotationAttribute, setAnnotationAttributeB] = React.useState('');
    const [b_attributeAlternative, setAttributeAlternativeB] = React.useState('');
    const [c_language, setLanguageC] = React.useState('');
    const [c_annotationType, setAnnotationTypeC] = React.useState('');
    const [c_attributeAlternative, setAttributeAlternativeC] = React.useState('');
   // let languages=[]
  //  let annotation_attribute_state=true
  const getlanguages=(type)=>{
      setMode(type)
      let   r=getLanguages(schemerequestInstance,type).then(x => {
                     //console.log(x);
                     setLanguages(x["languages"])
            })
      //  console.log(languages)
    }



// first time

const gettypes=(type,lang)=>{

       // let lang=getlang(type)
         console.log(b_language)
         let   r=getTypes(schemerequestInstance,type,lang).then(x => {
                     console.log(x);
                    setTypes(x["annotation_types"])
            })
    }

    const getannotationattributes=(annotation_type)=>{

       // let lang=getlang(type)
       //  console.log(b_language)
         let   r=getAttributes(schemerequestInstance,"button",b_language,annotation_type).then(x => {
                   //  console.log(x);
                   setAttributes(x["attributes"])
            })
    }

    const getannotationalternatives=(type,p)=>{
            let language=null
            let annotation_type=null
            let attribute=null
            if (type=="button"){
                language=b_language
                annotation_type=b_annotationType
                attribute=p
            }
            else{
                language=c_language
                annotation_type=p
            }
             let   r=getAttributeAlternatives(schemerequestInstance,type,language,annotation_type,attribute).then(x => {
                     console.log(x);
                    setAttributeAlternatives(x["alternatives"])
            })
    }

 const getvalues=(p)=>{

             let   r=getValues(schemerequestInstance,"button",b_language,b_annotationType,b_annotationAttribute,p).then(x => {
                     console.log(x);//?
                     let val_items=[]
                    let record={}
                     for(let i=0;i<x["groups"].length;i++){
                         record={val:x["groups"][i].group,title:true}
                         val_items.push(record)
                         for(let j=0;j<x["groups"][i].values.length;j++){
                             record={val:x["groups"][i].values[j],title:false}
                            val_items.push(record)
                         }

                     }
                     console.log(val_items)
                     setValues(val_items)
            })
    }

const getcoreferenceattirbutes=(p)=>{

             let   r=getCoreferenceAttributes(schemerequestInstance,"coreference",c_language,c_annotationType,p).then(x => {
                     console.log(x);//?
                    let attributes=[]
                    for (let j = 0; j < x["attributes"].length; j++){
                            console.log(x["attributes"][j].attribute)
                            attributes.push(x["attributes"][j].attribute)
}

                   setCoreferenceAttributes(attributes)
            })
    }


    const handleTabChange = (event, newValue) => {
        setTabValue(newValue)
    }

    const handleLanguageB = (event) => {
        setLanguageB(event.target.value)
        //console.log()
        gettypes("button",event.target.value)
        //console.log(languages)
    }

    const handleLanguageC = (event) => {
        setLanguageC(event.target.value)
        gettypes("coreference",event.target.value)
    }

    const handleAnnotationTypeB = (event) => {
        setAnnotationTypeB(event.target.value)
        getannotationattributes(event.target.value)
    }

    const handleAnnotationTypeC = (event) => {
        setAnnotationTypeC(event.target.value)
        getannotationalternatives("coreference", event.target.value)
    }

    const handleAnnotationAttributeB = (event) => {
        setAnnotationAttributeB(event.target.value)
        getannotationalternatives("button", event.target.value)
    }

    const handleAttributeAlternativeB = (event) => {
        setAttributeAlternativeB(event.target.value)
        getvalues(event.target.value)
    }

    const handleAttributeAlternativeC = (event) => {
        setAttributeAlternativeC(event.target.value)
        getcoreferenceattirbutes(event.target.value)
    }

  const AttrValue = ({ index, style }) => (
  <div style={style}>{coreferenceattributes[index]}</div>
);

const ValValue = ({ index, style }) => (
  <div style={style} className={ values[index].title ? classes.titleStyle : null }>{values[index].val}</div>
);


const Submit=(event) =>{
    event.preventDefault();
    let r
    if (mode=="button"){
         r=getSchema(schemerequestInstance,mode,b_language,b_annotationType,b_annotationAttribute,b_attributeAlternative).then(x => {
                props.SelectMyAnnotationScheme(x)
        })

    }
    else{
        r=getSchema(schemerequestInstance,mode,c_language,c_annotationType,"",c_attributeAlternative).then(x => {
                props.SelectMyAnnotationScheme(x)
        })
    }


    props.handleClose()
}




useEffect(() => {

 getlanguages("button")


 }, []);


/*
useEffect(() => {

        getlanguages("button")

      });*/

 return (
        <div>
            <AppBar position="static">
                <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab label="Button Annotator"  onClick={() => getlanguages("button")}    />{/*disabled>*/}
                    <Tab label="Coreference Annotator" onClick={() => getlanguages("coreference")}/>
                </Tabs>
            </AppBar>
            <TabPanel value={tabValue} index={0}> {/*0 stands for Button Annotator / 1 for Coreference Annotator*/}
                {/*Button Annotator language*/}
                <FormControl className={classes.formControl}>
                    <InputLabel>Language</InputLabel>
                    <Select value={b_language} onChange={handleLanguageB}>
                        <MenuItem value="">
                            <em>Please select language</em>
                        </MenuItem>
                         {languages.map((value, index) => {
                    return <MenuItem value={value}>{value}</MenuItem>
      })}
                        {/*} <MenuItem value={"greek"}>
                            Greek
                        </MenuItem>
                        <MenuItem value={"english"}>
                            English
                        </MenuItem>*/}
                    </Select>
                </FormControl>
                {/*Button Annotator Annotation Type*/}
                <FormControl className={classes.formControl}>
                    <InputLabel>Annotation Type</InputLabel>
                    <Select value={b_annotationType}   onChange={handleAnnotationTypeB}>
                        <MenuItem value="">
                            <em>Please select annotation type</em>
                        </MenuItem>
                          {annotationtypes.map((value, index) => {
                    return <MenuItem value={value}>{value}</MenuItem>
      })}



                    </Select>
                </FormControl>
                {/*Button Annotator Annotation Attribute*/}
                <FormControl className={classes.formControl} >{/*disabled>*/}
                    <InputLabel>Annotation Attribute</InputLabel>
                    <Select value={b_annotationAttribute} onChange={handleAnnotationAttributeB}>
                        <MenuItem value="">
                            <em>Please select annotation attribute</em>
                        </MenuItem>
                       {annotationattributes.map((value, index) => {
                    return <MenuItem value={value}>{value}</MenuItem>
      })}
                    </Select>
                </FormControl>
                {/*Button Annotator Attribute Alternative*/}
                <FormControl className={classes.formControl}>
                    <InputLabel>Attribute Alternative</InputLabel>
                    <Select value={b_attributeAlternative} onChange={handleAttributeAlternativeB}>
                        <MenuItem value="">
                            <em>Please select attribute alternative</em>
                        </MenuItem>
                        {attribute_alternatives.map((value, index) => {
                    return <MenuItem value={value}>{value}</MenuItem>
      })}



                    </Select>
                </FormControl>
                <div className={classes.root}>
                    <h6>Annotation Values:</h6>
                    <FixedSizeList height={120} width={200} itemSize={30} itemCount={values.length}>
                      {ValValue}
                    </FixedSizeList>
                </div>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                {/*Coreference Annotator language*/}
                <FormControl className={classes.formControl}>
                    <InputLabel>Language</InputLabel>
                    <Select value={c_language} onChange={handleLanguageC}>
                        <MenuItem value="">
                            <em>Please select language</em>
                        </MenuItem>
                        {languages.map((value, index) => {
                    return <MenuItem value={value}>{value}</MenuItem>
      })}
                    </Select>
                </FormControl>
                {/*Coreference Annotator Annotation Type*/}
                <FormControl className={classes.formControl}>
                    <InputLabel>Annotation Type</InputLabel>
                    <Select value={c_annotationType} onChange={handleAnnotationTypeC}>
                        <MenuItem value="">
                            <em>Please select annotation type</em>
                        </MenuItem>
                            {annotationtypes.map((value, index) => {
                    return <MenuItem value={value}>{value}</MenuItem>
      })}

                    </Select>
                </FormControl>
                {/*Coreference Annotator Attribute Alternative*/}
                <FormControl className={classes.formControl}>
                    <InputLabel>Attribute Alternative</InputLabel>
                    <Select value={c_attributeAlternative} onChange={handleAttributeAlternativeC}>
                        <MenuItem value="">
                            <em>Please select attribute alternative</em>
                        </MenuItem>
                       {attribute_alternatives.map((value, index) => {
                    return <MenuItem value={value}>{value}</MenuItem>
                                })}




                    </Select>
                </FormControl>
                <div className={classes.root}>
                    <h6>Annotation Attributes:</h6>

                       <FixedSizeList height={120} width={200} itemSize={30} itemCount={coreferenceattributes.length}>

                             {AttrValue}

                    </FixedSizeList>
                </div>
            </TabPanel>
        <div className={classes.myButtons}>
            <Button className={classes.button} variant="outlined" color="secondary" onClick={props.handleClose}>Cancel</Button>
            <Button className={classes.button} variant="outlined" color="secondary" onClick={Submit}>Submit</Button>
        </div>
    </div>
    );

}