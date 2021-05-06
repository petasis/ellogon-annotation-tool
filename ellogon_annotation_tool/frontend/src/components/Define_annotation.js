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
    const [mode, setMode] = React.useState('button');
    const [languages, setLanguages] = React.useState([]);
    const [annotationtypes, setTypes] = React.useState([])
    const [annotationattributes, setAttributes] = React.useState([])
    const [attribute_alternatives, setAttributeAlternatives] = React.useState([])
    const [values, setValues] = React.useState([])
    const [coreferenceattributes, setCoreferenceAttributes] = React.useState([])
    const [tabValue, setTabValue] = React.useState(0);
    const [b_language, setLanguageB] = React.useState('');
    const [b_annotationType, setAnnotationTypeB] = React.useState('');
    // const [b_annotationTypeRequired, setAnnotationTypeRequiredB] = React.useState(true);
    const [b_annotationAttribute, setAnnotationAttributeB] = React.useState('');
    // const [b_annotationAttributeRequired, setAnnotationAttributeRequiredB] = React.useState(true);
    const [b_attributeAlternative, setAttributeAlternativeB] = React.useState('');
    // const [b_attributeAlternativeRequired, setAttributeAlternativeRequiredB] = React.useState(true);
    const [c_language, setLanguageC] = React.useState('');
    const [c_annotationType, setAnnotationTypeC] = React.useState('');
    const [c_attributeAlternative, setAttributeAlternativeC] = React.useState('');
    const [req, setReq] = React.useState(true);
    const [e1, setE1] = React.useState(false);
    const [e2, setE2] = React.useState(false);
    const [e3, setE3] = React.useState(false);
    const [e4, setE4] = React.useState(false);
    const [e5, setE5] = React.useState(false);
    const [e6, setE6] = React.useState(false);
    const [e7, setE7] = React.useState(false);


    const getCurrentState = (type) => {
        getlanguages(type)

        console.log("executed12")
        if (type == "button" && (b_language != ''|| localStorage.getItem("LanguageB")!=null)) {
            console.log("executed2")
             setLanguageB(b_language)
            setAnnotationTypeB(b_annotationType)
            setAnnotationAttributeB(b_annotationAttribute)
            setAttributeAlternativeB(b_attributeAlternative)
            gettypes("button", b_language)
            getannotationattributes(b_annotationType)
            getannotationalternatives(type, b_annotationAttribute)
            getvalues(b_attributeAlternative)




        } else {
            if (c_language != '' || localStorage.getItem("LanguageC") != null) {
                 if (localStorage.getItem("LanguageC") != null) {
        setLanguageC(localStorage.getItem("LanguageC"))
    }
    if (localStorage.getItem("AnnotationTypeC") != null) {
        setAnnotationTypeC(localStorage.getItem("AnnotationTypeC"))
    }
    if (localStorage.getItem("AttributeAlternativeC") != null) {
        setAttributeAlternativeC(localStorage.getItem("AttributeAlternativeC"))

    }
                gettypes("coreference", c_language)
                getannotationalternatives(type, c_annotationType)
                getcoreferenceattirbutes(c_attributeAlternative)
            }
        }
    }


    const getlanguages = (type) => {
        setMode(type)
        let r = getLanguages(schemerequestInstance, type).then(x => {
            //console.log(x);
            setLanguages(x["languages"])
        })
        //console.log(languages)
    }


// first time
    const gettypes = (type, lang) => {

        // let lang=getlang(type)
        console.log(b_language)
        let r = getTypes(schemerequestInstance, type, lang).then(x => {
            console.log(x);

            if (x["annotation_types"].length == 0) {
                // setAnnotationTypeRequiredB(false)
                setReq(false)
            } else {
                setReq(true)
            }
            setTypes(x["annotation_types"])
        })
    }

    const getannotationattributes = (annotation_type) => {

        // let lang=getlang(type)
        //  console.log(b_language)
        let r = getAttributes(schemerequestInstance, "button", b_language, annotation_type).then(x => {
            if (x["attributes"].length == 0) {
                // setAnnotationAttributeRequiredB(false)
                setReq(false)
            } else {
                setReq(true)
            }
            setAttributes(x["attributes"])
        })


    }

    const getannotationalternatives = (type, p) => {
        let language = null
        let annotation_type = null
        let attribute = null
        if (type == "button") {
            language = b_language
            annotation_type = b_annotationType
            attribute = p
        } else {
            language = c_language
            annotation_type = p
        }
        let r = getAttributeAlternatives(schemerequestInstance, type, language, annotation_type, attribute).then(x => {


            if (x["alternatives"].length == 0) {
                console.log("ola")
                // setAttributeAlternativeRequiredB(false)
                setReq(false)
            } else {
                setReq(true)
            }
            // }


            setAttributeAlternatives(x["alternatives"])
        })
    }

    const getvalues = (p) => {

        let r = getValues(schemerequestInstance, "button", b_language, b_annotationType, b_annotationAttribute, p).then(x => {

            let val_items = []
            let record = {}
            for (let i = 0; i < x["groups"].length; i++) {
                record = {val: x["groups"][i].group, title: true}
                val_items.push(record)
                for (let j = 0; j < x["groups"][i].values.length; j++) {
                    record = {val: x["groups"][i].values[j], title: false}
                    val_items.push(record)
                }

            }
            console.log(val_items)
            setValues(val_items)

        })
    }

    const getcoreferenceattirbutes = (p) => {

        let r = getCoreferenceAttributes(schemerequestInstance, "coreference", c_language, c_annotationType, p).then(x => {
            console.log(x);//?
            let attributes = []
            for (let j = 0; j < x["attributes"].length; j++) {
                console.log(x["attributes"][j].attribute)
                attributes.push(x["attributes"][j].attribute)
            }

            if (x["attributes"].length == 0) {
                // setAnnotationTypeRequiredB(false)
                setReq(false)
            } else {
                setReq(true)
            }

            setCoreferenceAttributes(attributes)

        })
    }


    const handleTabChange = (event, newValue) => {
        setTabValue(newValue)
    }

    const handleLanguageB = (event) => {
        setE1(true)
        setLanguageB(event.target.value)
        localStorage.setItem('LanguageB', event.target.value);
        setAnnotationTypeB("")
        setAnnotationAttributeB("")
        setAttributeAlternativeB("")
        setValues([])
        //console.log()
        gettypes("button", event.target.value)
        //console.log(languages)
    }

    const handleLanguageC = (event) => {
        setE5(true)
        setLanguageC(event.target.value)
        localStorage.setItem('LanguageC', event.target.value);
        setAnnotationTypeC("")
        setAttributeAlternativeC("")
        setCoreferenceAttributes([])
        gettypes("coreference", event.target.value)
    }

    const handleAnnotationTypeB = (event) => {
        setE2(true)
        setAnnotationTypeB(event.target.value)
        localStorage.setItem('AnnotationTypeB', event.target.value);
        setAnnotationAttributeB("")
        setAttributeAlternativeB("")
        setValues([])
        getannotationattributes(event.target.value)
    }

    const handleAnnotationTypeC = (event) => {
        setE6(true)
        setAnnotationTypeC(event.target.value)
        localStorage.setItem('AnnotationTypeC', event.target.value);
        setAttributeAlternativeC("")
        setCoreferenceAttributes([])
        getannotationalternatives("coreference", event.target.value)
    }

    const handleAnnotationAttributeB = (event) => {
        setE3(true)
        setAnnotationAttributeB(event.target.value)
        localStorage.setItem('AnnotationAttributeB', event.target.value);
        setAttributeAlternativeB("")
        setValues([])
        getannotationalternatives("button", event.target.value)
    }

    const handleAttributeAlternativeB = (event) => {
        setE4(true)
        setAttributeAlternativeB(event.target.value)
        localStorage.setItem('AttributeAlternativeB', event.target.value);
        getvalues(event.target.value)
    }

    const handleAttributeAlternativeC = (event) => {
        setE7(true)
        setAttributeAlternativeC(event.target.value)
        localStorage.setItem('AttributeAlternativeC', event.target.value);
        getcoreferenceattirbutes(event.target.value)
    }

    const handleReqChange = (event) => {
        setReq(event.target.value)
    }

    const AttrValue = ({index, style}) => (
        <div style={style}>{coreferenceattributes[index]}</div>
    );

    const ValValue = ({index, style}) => (
        <div style={style} className={values[index].title ? classes.titleStyle : null}>{values[index].val}</div>
    );


    const Submit = (event) => {
        event.preventDefault();
        let r
        if (mode == "button") {
            r = getSchema(schemerequestInstance, mode, b_language, b_annotationType, b_annotationAttribute, b_attributeAlternative).then(x => {
                props.SelectMyAnnotationScheme(x)
            })
        } else {
            r = getSchema(schemerequestInstance, mode, c_language, c_annotationType, "", c_attributeAlternative).then(x => {
                props.SelectMyAnnotationScheme(x)
            })
        }
        console.log(mode)
        props.handleClose()
    }


const RetrieveLastOptions=(mode)=>{
        if(mode=="button"){
            let language=localStorage.getItem("LanguageB")
            if( language!=null){
                setE1(true)
                setLanguageB(language)
                gettypes("button", language)
                let type=localStorage.getItem("AnnotationTypeB")
                console.log(type)
                if(type!=null){
                    setE2(true)
                    setAnnotationTypeB(type)
                    let r = getAttributes(schemerequestInstance, "button", language, type).then(x => {
                                                     if (x["attributes"].length == 0) {
                // setAnnotationAttributeRequiredB(false)
                                                          setReq(false)
                                                                      } else {
                                                              setReq(true)
                                                                   }
                                                           setAttributes(x["attributes"])
                                                           })
                     let annotation_attribute=localStorage.getItem("AnnotationAttributeB")
                       if(annotation_attribute!=null){
                           setE3(true)
                           setAnnotationAttributeB(annotation_attribute)
                            let r = getAttributeAlternatives(schemerequestInstance, "button", language, type, annotation_attribute).then(x => {


                                                 if (x["alternatives"].length == 0) {


                                                                    setReq(false)
                                                                  } else {
                                                                  setReq(true)
                                                          }
                                                 setAttributeAlternatives(x["alternatives"])
                                                              })

                            let attribute_alternative=localStorage.getItem("AttributeAlternativeB")
                            console.log(attribute_alternative)
                            if(attribute_alternative!=null){

                                setE4(true)
                              setAttributeAlternativeB(attribute_alternative)
                                 let r = getValues(schemerequestInstance, "button", language, type, annotation_attribute,attribute_alternative).then(x => {

                                     let val_items = []
                                     let record = {}
                                     for (let i = 0; i < x["groups"].length; i++) {
                                                record = {val: x["groups"][i].group, title: true}
                                                 val_items.push(record)
                                                for (let j = 0; j < x["groups"][i].values.length; j++) {
                                                        record = {val: x["groups"][i].values[j], title: false}
                                                                    val_items.push(record)
                                                                 }

                                                     }
                                                 console.log(val_items)
                                                 setValues(val_items)

                                                 })


                            }

                                                  }
                }
            }
        }
        else{
            let language=localStorage.getItem("LanguageC")
             if( language!=null){
                 setE5(true)
                 setLanguageC(language)
                  gettypes("coreference", language)
                  let type= localStorage.getItem('AnnotationTypeC');
                  if(type!=null){
                      setE6(true)
                      setAnnotationTypeC(type)
                       let r = getAttributeAlternatives(schemerequestInstance, "coreference", language, type, null).then(x => {

                                          if (x["alternatives"].length == 0) {

                                                    setReq(false)
                                                } else {
                                                      setReq(true)
                                                     }
            // }

            setAttributeAlternatives(x["alternatives"])
        })
                     let attribute_alternative=localStorage.getItem("AttributeAlternativeC")
                            if(attribute_alternative!=null){
                                setE7(true)
                                 setAttributeAlternativeC(attribute_alternative)
                                 let r = getCoreferenceAttributes(schemerequestInstance, "coreference", language, type, attribute_alternative).then(x => {

                                     let attributes = []
                                     for (let j = 0; j < x["attributes"].length; j++) {
                                                //console.log(x["attributes"][j].attribute)
                                                 attributes.push(x["attributes"][j].attribute)
                                                     }

                                      if (x["attributes"].length == 0) {
                // setAnnotationTypeRequiredB(false)
                                              setReq(false)
                                                  } else {
                                               setReq(true)
                                                       }

                                     setCoreferenceAttributes(attributes)

                                     })

                            }


                  }

             }


        }


    }



    useEffect(() => {
        //retrieve options



       // console.log("executed1")
        getlanguages("button")
        RetrieveLastOptions("button")
        RetrieveLastOptions("coreference")
    }, []);

 return (
        <div>
            <AppBar position="static">
                <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab label="Button Annotator"  onClick={() => getCurrentState("button")}    />{/*disabled>*/}
                    <Tab label="Coreference Annotator" onClick={() => getCurrentState("coreference")}/>
                </Tabs>
            </AppBar>
            <TabPanel value={tabValue} index={0}> {/*0 stands for Button Annotator / 1 for Coreference Annotator*/}
                {/*Button Annotator language*/}
                <form onSubmit={Submit}>
                    <FormControl className={classes.formControl} required={req}>
                        <InputLabel shrink={e1}>Language</InputLabel>
                        <Select value={b_language} onChange={handleLanguageB}
                                displayEmpty={e1}>
                                {/*/!*onBlur={(e) => {setE1(true)}}>*!/ an theloume na fainetai to select language*/}
                            <MenuItem value="" disabled={true}>
                                <em>Please select language</em>
                            </MenuItem>
                            {languages.map((value, index) => {
                                return <MenuItem value={value}>{value}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                    {/*Button Annotator Annotation Type*/}
                    <FormControl className={classes.formControl} required={req}>
                        <InputLabel shrink={e2}>Annotation Type</InputLabel>
                        <Select value={b_annotationType}   onChange={handleAnnotationTypeB}
                                displayEmpty={e2}>
                            <MenuItem value="" disabled={true}>
                                <em>Please select annotation type</em>
                            </MenuItem>
                              {annotationtypes.map((value, index) => {
                                  return <MenuItem value={value}>{value}</MenuItem>
                              })}
                        </Select>
                    </FormControl>
                    {/*Button Annotator Annotation Attribute*/}
                    <FormControl className={classes.formControl} required={req}>{/*disabled>*/}
                        <InputLabel shrink={e3}>Annotation Attribute</InputLabel>
                        <Select value={b_annotationAttribute} onChange={handleAnnotationAttributeB}
                                displayEmpty={e3}>
                            <MenuItem value="" disabled={true}>
                                <em>Please select annotation attribute</em>
                            </MenuItem>
                            {annotationattributes.map((value, index) => {
                                return <MenuItem value={value}>{value}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                    {/*Button Annotator Attribute Alternative*/}
                    <FormControl className={classes.formControl} required={req}>
                        <InputLabel shrink={e4}>Attribute Alternative</InputLabel>
                        <Select value={b_attributeAlternative} onChange={handleAttributeAlternativeB}
                                displayEmpty={e4}>
                            <MenuItem value="" disabled={true}>
                                <em>Please select attribute alternative</em>
                            </MenuItem>
                            {attribute_alternatives.map((value, index) => {
                                return <MenuItem value={value}>{value}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                    <div className={classes.root}>
                        <h6>Annotation Values:</h6>
                        <FixedSizeList height={120} width={480} itemSize={30} itemCount={values.length}>
                          {ValValue}
                        </FixedSizeList>
                    </div>
                    <div className={classes.myButtons}>
                        <Button className={classes.button} variant="outlined" color="secondary" onClick={props.handleClose}>Cancel</Button>
                        <Button type="submit" className={classes.button} variant="outlined" color="secondary">Submit</Button>
                    </div>
                </form>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                <form onSubmit={Submit}>
                {/*Coreference Annotator language*/}
                <FormControl className={classes.formControl} required={req}>
                    <InputLabel shrink={e5}>Language</InputLabel>
                    <Select value={c_language} onChange={handleLanguageC}
                            displayEmpty={e5}>
                        <MenuItem value="" disabled={true}>
                            <em>Please select language</em>
                        </MenuItem>
                        {languages.map((value, index) => {
                            return <MenuItem value={value}>{value}</MenuItem>
                        })}
                    </Select>
                </FormControl>
                {/*Coreference Annotator Annotation Type*/}
                <FormControl className={classes.formControl} required={req}>
                    <InputLabel shrink={e6}>Annotation Type</InputLabel>
                    <Select value={c_annotationType} onChange={handleAnnotationTypeC}
                            displayEmpty={e6}>
                        <MenuItem value="" disabled={true}>
                            <em>Please select annotation type</em>
                        </MenuItem>
                        {annotationtypes.map((value, index) => {
                            return <MenuItem value={value}>{value}</MenuItem>
                        })}
                    </Select>
                </FormControl>
                {/*Coreference Annotator Attribute Alternative*/}
                <FormControl className={classes.formControl} required={req}>
                    <InputLabel shrink={e7}>Attribute Alternative</InputLabel>
                    <Select value={c_attributeAlternative} onChange={handleAttributeAlternativeC}
                            displayEmpty={e7}>
                        <MenuItem value="" disabled={true}>
                            <em>Please select attribute alternative</em>
                        </MenuItem>
                       {attribute_alternatives.map((value, index) => {
                           return <MenuItem value={value}>{value}</MenuItem>
                       })}
                    </Select>
                </FormControl>
                <div className={classes.root}>
                    <h6>Annotation Attributes:</h6>
                       <FixedSizeList height={120} width={480} itemSize={30} itemCount={coreferenceattributes.length}>
                             {AttrValue}
                    </FixedSizeList>
                </div>
                <div className={classes.myButtons}>
                    <Button className={classes.button} variant="outlined" color="secondary" onClick={props.handleClose}>Cancel</Button>
                    <Button type="submit" className={classes.button} variant="outlined" color="secondary">Submit</Button>
                </div>
                </form>
            </TabPanel>
        </div>
    );
}
