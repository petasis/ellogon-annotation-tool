
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AnnotationService } from '../annotation-service/annotation.service';
import { ButtonAnnotatorService } from '../button-annotator-service/button-annotator.service';
import { CollectionService } from '../collection-service/collection-service.service';
import { CoreferenceAnnotatorService } from '../coreference-annotator-service/coreference-annotator.service';
import { CoreferenceColorDataService } from '../coreference-color-data-service/coreference-color-data.service';
import { TempAnnotationService } from '../temp-annotation-service/temp-annotation.service';
import { TextWidgetAPI } from '../text-widget/text-widget.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(public http: HttpClient, public dialog: MatDialog, public TextWidgetAPI: TextWidgetAPI, public annotationService: AnnotationService, public tempAnnotationService: TempAnnotationService, public buttonAnnotator: ButtonAnnotatorService, public coreferenceAnnotatorService: CoreferenceAnnotatorService,
    public collectionService: CollectionService,
    public zone: NgZone,
    public coreferenceColorDataService: CoreferenceColorDataService) { }

  /*var sanitizeObj = function (inputObj) {
      _.each(inputObj, function(val, key) {
        inputObj[key] = $sanitize(val);
      });
  
      return inputObj;
    };*/

  async getToken() {
    return await this.http.get('api/auth/gettoken').toPromise();
  }

  refreshCSRFToken() {
    return this.getToken();
  }

  register(user): Promise<any> {
    // Ensure we have a valid CSRF token...
    this.refreshCSRFToken();
    return new Promise((resolve, reject) => {
      this.http.post('./api/auth/register', user)
        .subscribe((response) => {
          resolve(response);
        }, (error) => {
          reject(error);
        });
    });
  };


  // Login/logout is handled by:
  // src/ng-matero/core/authentication/login.service.ts (@core)
  login(credentials): Promise<any> {
    return;
    // Ensure we have a valid CSRF token...
    this.refreshCSRFToken();
    //var deferred = $q.defer();
    //var sanCredentials = sanitizeObj(credentials);
    //sanCredentials.csrf_token = CSRF_TOKEN;
    credentials["csrf_token"] = "this.CSRF_TOKEN";

    return new Promise((resolve, reject) => {
      this.http.post('./api/auth/login', credentials)
        .subscribe((response) => {
          if (response["success"] && typeof (response["data"]["email"] != "undefined")) {
            resolve(response);
          } else {
            reject(response);
          }
        }, (error) => {
          reject(error);
        });

    });
  };

  // Login/logout is handled by:
  // src/ng-matero/core/authentication/login.service.ts (@core)
  logout(): Promise<any> {
    // Ensure we have a valid CSRF token...
    this.refreshCSRFToken();
    //var deferred = $q.defer();
    return new Promise((resolve, reject) => {
      this.http.get('./api/auth/logout')            // Make an AJAX call to check if the user is logged in
        .subscribe((response) => {
          resolve(response);
        }, (error) => {
          reject(error);
        });

    });
  };

  resetPassword(credentials): Promise<any> {
    // Ensure we have a valid CSRF token...
    this.refreshCSRFToken();
    return new Promise((resolve, reject) => {
      this.http.post('./api/auth/reset', credentials)
        .subscribe((response) => {
          resolve(response);
        }, (error) => {
          reject(error);
        });
    });

  };


  updatePassword(credentials): Promise<any> {
    // Ensure we have a valid CSRF token...
    this.refreshCSRFToken();
    console.log("update_password1")
    //var deferred = $q.defer();
    //var sanCredentials = sanitizeObj(credentials);
    let tokenstr=localStorage.getItem("TOKEN")
    let tokenjson=JSON.parse(tokenstr)
    let access_token=tokenjson["token"]["access"]
    let headers=new HttpHeaders({'Authorization': 'JWT ' +access_token})
    return new Promise((resolve, reject) => {
      this.http.post('./api/user/update', credentials,{"headers":headers})
        .subscribe((data) => {
          resolve(data);
        }, (error) => {
          reject(error);
        });
    });
  };

  getStats(): Promise<any> {
    let tokenstr=localStorage.getItem("TOKEN")
    let tokenjson=JSON.parse(tokenstr)
    let access_token=tokenjson["token"]["access"]
    let headers=new HttpHeaders({'Authorization': 'JWT ' +access_token})
    // Ensure we have a valid CSRF token...
    this.refreshCSRFToken();
    return new Promise((resolve, reject) => {
      this.http.get('./api/user',{ 'headers': headers })
        .subscribe((response) => {
          resolve(response);
        }, (error) => {
          reject(error);
        });

    });
  }
}
