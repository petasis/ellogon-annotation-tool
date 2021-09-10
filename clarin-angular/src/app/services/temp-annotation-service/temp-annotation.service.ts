import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TempAnnotationService {

  constructor(public http: HttpClient) { }

  getAll = function (collectionId, documentId, annotatorId = null) {
    // console.error("TempAnnotationService: getAll():", collectionId, documentId, annotatorId);
    return new Promise((resolve, reject) => {
      var uri = './api/collections/' + collectionId + '/documents/' + documentId + '/temp_annotations';
      if (annotatorId) {
        uri = uri + '/' + annotatorId;
      }
      this.http.get(uri)
        .subscribe(function (data) {
          resolve(data);
        }, (error) => {
          reject(error);
        });

    });
  };

  get(collectionId, documentId, annotationId) {
    let tokenstr=localStorage.getItem("TOKEN")
    let tokenjson=JSON.parse(tokenstr)
    let access_token=tokenjson["token"]["access"]
    let headers=new HttpHeaders({'Authorization': 'JWT ' +access_token})





    // console.error("TempAnnotationService: get():", collectionId, documentId, annotationId);
    return new Promise((resolve, reject) => {
      this.http.get('./api/collections/' + collectionId + '/documents/' + documentId + '/temp_annotations/' + annotationId,{"headers":headers})
        .subscribe(function (data) {
          resolve(data);
        }, (error) => {
          reject(error);
        });

    });
  };

  save(collectionId, documentId, annotationData) {
    let tokenstr=localStorage.getItem("TOKEN")
    let tokenjson=JSON.parse(tokenstr)
    let access_token=tokenjson["token"]["access"]
    // console.error("TempAnnotationService: save():", collectionId, documentId, annotationData);
    return new Promise((resolve, reject) => {
      this.http.post('./api/collections/' + collectionId + '/documents/' + documentId + '/temp_annotations', {
        data: annotationData
      }, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json','Authorization': 'JWT ' +access_token
        })
      }).subscribe(function (data) {
        resolve(data);
      }, (error) => {
        reject(error);
      });

    });
  };

  update(annotationData) {
    let tokenstr=localStorage.getItem("TOKEN")
    let tokenjson=JSON.parse(tokenstr)
    let access_token=tokenjson["token"]["access"]
    // console.error("TempAnnotationService: update():", annotationData);
    return new Promise((resolve, reject) => {
      this.http.put('./api/collections/' + annotationData.collection_id + '/documents/' + annotationData.document_id + '/temp_annotations/' + annotationData._id, {
        data: annotationData
      }, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json','Authorization': 'JWT ' +access_token
        })
      }).subscribe(function (data) {
        resolve(data);
      }, (error) => {
        reject(error);
      });

    });
  };

  destroy = function (collectionId, documentId, annotationId) {
    let tokenstr=localStorage.getItem("TOKEN")
    let tokenjson=JSON.parse(tokenstr)
    let access_token=tokenjson["token"]["access"]
    let headers=new HttpHeaders({'Authorization': 'JWT ' +access_token})
    // console.error("TempAnnotationService: destroy():", collectionId, documentId, annotationId);
    return new Promise((resolve, reject) => {
      this.http.delete('api/collections/' + collectionId + '/documents/' + documentId + '/temp_annotations/' + annotationId,{"headers":headers})
        .subscribe((data) => {
          resolve(data);
        }, (error) => {
          reject(error);
        });

    });
  };

}
