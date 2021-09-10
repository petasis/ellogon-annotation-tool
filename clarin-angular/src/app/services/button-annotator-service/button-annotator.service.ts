import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CLARIN_CONSTANTS } from 'src/app/helpers/constants';

@Injectable({
  providedIn: 'root'
})
export class ButtonAnnotatorService {

  constructor(public http: HttpClient) { }

  checkForSavedSchema() {
    let tokenstr=localStorage.getItem("TOKEN")
    let tokenjson=JSON.parse(tokenstr)
    let access_token=tokenjson["token"]["access"]
    //let headers=new HttpHeaders({'Authorization': 'JWT ' +access_token})






    return new Promise((resolve, reject) => {
      this.http.get('./api/button_annotators', {
        headers: new HttpHeaders({
          'Content-Type': 'application/json; charset=utf-8',
          'Accept': 'application/json; charset=utf-8','Authorization': 'JWT ' +access_token
        })
      }).subscribe((data) => {   // Asynchronous Service calling
        resolve(data);
      }, (error) => {
        reject(error);
      });

    });
  };

  updateSchema(annotationSchema) {
    let tokenstr=localStorage.getItem("TOKEN")
    let tokenjson=JSON.parse(tokenstr)
    let access_token=tokenjson["token"]["access"]
    return new Promise((resolve, reject) => {
      this.http.post('./api/button_annotators', { data: annotationSchema }, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json','Authorization': 'JWT ' +access_token
        })
      }).subscribe((data) => {
        resolve(data);
      }, (error) => {
        reject();
      });

    });
  };

  getLanguages() {
    return new Promise((resolve, reject) => {
      this.http.get(CLARIN_CONSTANTS.ELLOGON_SERVICES + '/annotation_scheme.tcl').subscribe((data: any) => {   // Asynchronous Service calling
        resolve(data);
      }, (error) => {
        reject();
      });

    });
  };

  getAnnotationTypes(language) {
    return new Promise((resolve, reject) => {
      this.http.get(CLARIN_CONSTANTS.ELLOGON_SERVICES
        + '/annotation_scheme.tcl/'
        + encodeURIComponent(language)).subscribe((data) => {   // Asynchronous Service calling
          resolve(data);
        }, (error) => {
          reject();
        });

    });
  };

  getAnnotationAttributes(language, annotationType) {
    return new Promise((resolve, reject) => {
      this.http.get(CLARIN_CONSTANTS.ELLOGON_SERVICES
        + '/annotation_scheme.tcl/'
        + encodeURIComponent(language) + '/'
        + encodeURIComponent(annotationType)).subscribe((data) => {   // Asynchronous Service calling
          resolve(data);
        }, (error) => {
          reject();
        });

    });
  }

  getAttributeAlternatives(language, annotationType, annotationAttribute) {
    return new Promise((resolve, reject) => {
      this.http.get(CLARIN_CONSTANTS.ELLOGON_SERVICES
        + '/annotation_scheme.tcl/'
        + encodeURIComponent(language) + '/'
        + encodeURIComponent(annotationType) + '/'
        + encodeURIComponent(annotationAttribute)).subscribe((data) => {   // Asynchronous Service calling
          resolve(data);
        }, (error) => {
          reject();
        });

    });
  };

  getValues(language, annotationType, annotationAttribute, attributeAlternative) {
    return new Promise((resolve, reject) => {
      this.http.get(CLARIN_CONSTANTS.ELLOGON_SERVICES
        + '/annotation_scheme.tcl/'
        + encodeURIComponent(language) + '/'
        + encodeURIComponent(annotationType) + '/'
        + encodeURIComponent(annotationAttribute) + '/'
        + encodeURIComponent(attributeAlternative)).subscribe((data) => {   // Asynchronous Service calling
          resolve(data);
        }, (error) => {
          reject();
        });

    });
  };

}
