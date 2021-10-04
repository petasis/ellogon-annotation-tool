import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(public http: HttpClient) { }

  readDocument(collection_id, documentFile) {
    return new Promise((resolve, reject) => {
      var docData = {};
      var reader = new FileReader();

      reader.onload = function (e) {
        docData["name"] = documentFile.name;
        docData["type"] = documentFile.type;
        docData["text"] = reader.result;
        docData["collection_id"] = collection_id;
        docData["external_name"] = documentFile.name;
        docData["encoding"] = documentFile.encoding;
        docData["handler"] = documentFile.handler;

        resolve(docData);
      }

      reader.readAsText(documentFile.file);
    });
  }

  getAll(collectionId) {
    return new Promise((resolve, reject) => {
      this.http.get('./api/collections/' + collectionId + '/documents')
        .subscribe((data) => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }


  get(collectionId, documentId) {
    return new Promise((resolve, reject) => {
      this.http.get('./api/collections/' + collectionId + '/documents/' + documentId)
        .subscribe(function (data) {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  };

  save(collectionId, documents) {
    //read and save multiple documents
    var promises: any = [];
    // console.error("Documents:", documents);
    documents.forEach(element => {
      promises.push(new Promise<any>((resolve, reject) => {
        this.readDocument(collectionId, element)
          .then((readData) => {
            this.http.post('./api/collections/' + collectionId + '/documents', { data: readData }, {
              headers: new HttpHeaders({
                'Content-Type': 'application/json'
              })
            }).subscribe(function (data) {
              resolve(data);
            }, error => {
              reject(error);
            });
          });
      })
      )
    });
    return Promise.all(promises);
  }

  saveDocument(collectionId, doc) {
    // doc is an object, not a FILE/BLOB.
    doc['collection_id'] = collectionId;
    return new Promise((resolve, reject) => {
      this.http.post('./api/collections/' + collectionId + '/documents', { data: doc })
        .subscribe((response) => {
          // console.error("DocumentService: saveDocument(): response:", response);
          if (response["success"]) {
            resolve(response);
          } else {
            reject(response);
          }
        }, (error) => {
          //console.error("DocumentService: saveDocument(): error:", error);
          reject(error);
        });
    });
  }; /* saveDocument */

  saveDocuments(collectionId, docs) {
    var promises: any = [];
    docs.forEach(doc => {
      promises.push(this.saveDocument(collectionId, doc));
    });
    return Promise.all(promises);
  }; /* saveDocuments */

  destroy(collectionId, documentId) {
    return new Promise((resolve, reject) => {
      this.http.delete('./api/collections/' + collectionId + '/documents/' + documentId)
        .subscribe(function (data) {
          resolve(data);
        }, (error) => {
          reject(error);
        });

    });
  }
}
