import { Injectable } from '@angular/core';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import { TokenResponse, User, LoginData } from './interface';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(protected http: HttpClient) {}

  async getToken() {
    return await this.http.get('api/auth/gettoken').toPromise();
  }

  refreshCSRFToken() {
    console.log("csrf")
    return this.getToken();
  }

  login(email: string, password: string, rememberMe: boolean = false) {
    console.log("work1")
    // Ensure we have a valid CSRF token...
    this.refreshCSRFToken();
    console.log("work2")
    //calldjjdfdj()
    return this.http.post<LoginData | any>('/api/auth/login', {
      email,
      password,
      remember_me: rememberMe,
    }).pipe(
      // Caller expects a <TokenResponse>
      map(loginData => {
        console.log("work3")
      //  console.log(loginData)
       // localStorage.setItem("access_token",loginData["access"])
        return {token: loginData.data.jwtToken,
                                token_type: 'bearer'}})
    );
  }; /* login */

  refresh() {
    // return this.http.post<TokenResponse | any>('/auth/refresh', {});
    return this.http.post<TokenResponse | any>('/api/user/refresh-token', {});
  }; /* refresh */

  logout() {
    let tokenstr=localStorage.getItem("TOKEN")
    let tokenjson=JSON.parse(tokenstr)
    let refresh_token=tokenjson["token"]["refresh"]
    localStorage.clear()
    // return this.http.post('/auth/logout', {});
    return this.http.post('/api/user/logout',{"refresh_token":refresh_token});
  }; /* logout */

  me() {
    // return this.http.get<User>('/me');
    let tokenstr=localStorage.getItem("TOKEN")
    let tokenjson=JSON.parse(tokenstr)
    let access_token=tokenjson["token"]["access"]
    let headers=new HttpHeaders({'Authorization': 'JWT ' +access_token})
    return this.http.get<LoginData>('/api/user/me',{ 'headers': headers }).pipe(
      map(data => {
        return {id: data.data.id,
                name: data.data.first_name + " " + data.data.last_name,
                email: data.data.email,
                first_name: data.data.first_name,
                last_name: data.data.last_name,
                avatar: './assets/images/avatar-default.jpg'};
      })
    );
  }; /* me */

  menu() {
    //return this.http.get('/me/menu');
    return this.http.get('assets/data/menu.json?_t=' + Date.now());
  }; /* menu */
}
