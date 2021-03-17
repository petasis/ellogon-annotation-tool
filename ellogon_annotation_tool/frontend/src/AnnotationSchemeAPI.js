import axios from 'axios'



export const schemerequestInstance = axios.create({
    baseURL: '/annotation_scheme_options/',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'accept': 'application/json;charset=utf-8'
    }
});


export async function  getLanguages(r,type){
  let  url="get_languages/"+type
    try
       {
        let response = await r.get(url);
       // console.log(response.data.languages)
        const languages=response.data.languages
        console.log(languages)

       // console.log(message)
       return languages
      //  return languages;
    }catch(error){
        console.log(error.response.data)
       // console.log(error)
        //console.log("Error: ", JSON.stringify(error, null, 4));
       // this.props.history.push({pathname:"/sign-in"});
        throw error;
    }

}
export async function  getTypes(r,type,lang){
  let  url="get_types/"+type
    const data={"lang":lang}
    try
       {
        let response = await r.get(url, {params: data});
      //  console.log(response)


       // console.log(response.data.languages)
        const types=response.data.types
        console.log(types)

       // console.log(message)
       return types
      //  return languages;
    }catch(error){
        console.log(error.response.data)
       // console.log(error)
        //console.log("Error: ", JSON.stringify(error, null, 4));
       // this.props.history.push({pathname:"/sign-in"});
        throw error;
    }

}

export async function  getAttributes(r,type,lang,annotation_type){
  let  url="get_attributes/"+type
    const data={"lang":lang, "type":annotation_type}
    try
       {
        let response = await r.get(url, {params: data});
      //  console.log(response)


       // console.log(response.data.languages)
        const attributes=response.data.attributes
        console.log(annotation_type+":")
            console.log(attributes)

       // console.log(message)
       return attributes
      //  return languages;
    }catch(error){
        console.log(error.response.data)
       // console.log(error)
        //console.log("Error: ", JSON.stringify(error, null, 4));
       // this.props.history.push({pathname:"/sign-in"});
        throw error;
    }

}

export async function  getAttributeAlternatives(r,type,lang,annotation_type,annotation_attribute){
  let  url="get_attribute_alternatives/"+type
    const data={"lang":lang, "type":annotation_type,"attribute":annotation_attribute}
    try
       {
        let response = await r.get(url, {params: data});
      //  console.log(response)


       // console.log(response.data.languages)
        const attribute_alternatives=response.data.attribute_alternatives
        console.log(annotation_attribute+":")
            console.log(attribute_alternatives)

       // console.log(message)
       return attribute_alternatives
      //  return languages;
    }catch(error){
        console.log(error.response.data)
       // console.log(error)
        //console.log("Error: ", JSON.stringify(error, null, 4));
       // this.props.history.push({pathname:"/sign-in"});
        throw error;
    }

}

export async function  getValues(r,type,lang,annotation_type,annotation_attribute,attribute_alternative){
  let  url="get_values/"+type
    const data={"lang":lang, "type":annotation_type,"attribute":annotation_attribute,"attribute_alternative":attribute_alternative}
    try
       {
        let response = await r.get(url, {params: data});
      //  console.log(response)


       // console.log(response.data.languages)
        const values=response.data.values
        console.log(attribute_alternative+":")
            console.log(values)

       // console.log(message)
       return values
      //  return languages;
    }catch(error){
        console.log(error.response.data)
       // console.log(error)
        //console.log("Error: ", JSON.stringify(error, null, 4));
       // this.props.history.push({pathname:"/sign-in"});
        throw error;
    }

}

export async function  getCoreferenceAttributes(r,type,lang,annotation_type,attribute_alternative){
  let  url="get_coreference_attributes/"+type
    const data={"lang":lang, "type":annotation_type,"attribute_alternative":attribute_alternative}
    try
       {
        let response = await r.get(url, {params: data});
      //  console.log(response)


       console.log(response.data.languages)
       const attributes=response.data.attributes
        console.log(attribute_alternative+":")
          console.log(attributes)

       // console.log(message)
       return attributes
      //  return languages;
    }catch(error){
        console.log(error.response.data)
       // console.log(error)
        //console.log("Error: ", JSON.stringify(error, null, 4));
       // this.props.history.push({pathname:"/sign-in"});
        throw error;
    }

}

export async function  getSchema(r,type,lang,annotation_type,annotation_attribute,attribute_alternative){
  let  url="get_schema/"+type
    const data={"lang":lang, "type":annotation_type,"attribute":annotation_attribute,"attribute_alternative":attribute_alternative}
    try
       {
        let response = await r.get(url, {params: data});
      //  console.log(response)


       console.log(response)



       return response.data
      //  return languages;
    }catch(error){
        console.log(error.response.data)
       // console.log(error)
        //console.log("Error: ", JSON.stringify(error, null, 4));
       // this.props.history.push({pathname:"/sign-in"});
        throw error;
    }

}