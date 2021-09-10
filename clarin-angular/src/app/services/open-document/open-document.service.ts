import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OpenDocumentService {

  constructor(public http: HttpClient) { }

  getAll() {
    let tokenstr=localStorage.getItem("TOKEN")
    let tokenjson=JSON.parse(tokenstr)
    let access_token=tokenjson["token"]["access"]
    let headers=new HttpHeaders({'Authorization': 'JWT ' +access_token})




    return new Promise((resolve, reject) => {
      this.http.get('./api/open_documents',{ 'headers': headers })
        .subscribe((data) => {
          resolve(data);
        }, (error) => {
          reject(error);
        });
    });
  }; /* getAll */

  get(documentId, annotatorId) {
    let tokenstr=localStorage.getItem("TOKEN")
    let tokenjson=JSON.parse(tokenstr)
    let access_token=tokenjson["token"]["access"]
    let headers=new HttpHeaders({'Authorization': 'JWT ' +access_token})

    return new Promise((resolve, reject) => {
      this.http.get('./api/open_documents/' + documentId + '/' + annotatorId,{"headers":headers})
        .subscribe((data) => {
          resolve(data);
        }, (error) => {
          reject(error);
        });
    });
  }; /* get */

  save(documentData) {
    let tokenstr=localStorage.getItem("TOKEN")
    let tokenjson=JSON.parse(tokenstr)
    let access_token=tokenjson["token"]["access"]
    
    return new Promise((resolve, reject) => {
      this.http.post('./api/open_documents', { data: documentData }, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json','Authorization': 'JWT ' +access_token
        })
      }).subscribe((data) => {
        resolve(data);
      }, (error) => {
        reject(error);
      });

    });
  }; /* save */

  destroy(documentId, annotatorId) {
    let tokenstr=localStorage.getItem("TOKEN")
    let tokenjson=JSON.parse(tokenstr)
    let access_token=tokenjson["token"]["access"]
    let headers=new HttpHeaders({'Authorization': 'JWT ' +access_token})

    console.log("destroyeros")
    return new Promise((resolve, reject) => {
      this.http.delete('./api/open_documents/' + documentId + '/' + annotatorId,{"headers":headers})
        .subscribe((data) => {
          resolve(data);
        }, (error) => {
          reject(error);
        });
    });
  }; /* destroy */
}; /* OpenDocumentService */
