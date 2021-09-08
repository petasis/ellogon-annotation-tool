import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, share, switchMap, tap } from 'rxjs/operators';
import { TokenService } from './token.service';
import { Token, BackendUser, LoginData, User } from './interface';
import { guest } from './user';
import { MainComponent } from '@components/views/main/main.component';
import { UserService } from 'src/app/services/user-service/user.service';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user$ = new BehaviorSubject<User>(guest);

  // private userReq$ = this.http.get<User>('/me');
  // private userReq$ = of(admin);
  private userReq$ = this.http.get<LoginData>('/api/user/me')
  .pipe(
    map(data => {
      if (data.data) {
        return {id: data.data.id,
                name: data.data.first_name + " " + data.data.last_name,
                email: data.data.email,
                first_name: data.data.first_name,
                last_name: data.data.last_name,
                avatar: './assets/images/avatar-default.jpg'};
      } else {
        return of(guest);
      }
    })
  );

  headers;

  constructor(private http: HttpClient, private token: TokenService) {
    this.updateUser();
  }

  updateUser() {
    this.token
      .changed()
      .pipe(
        switchMap(() => iif(() => this.check(), this.userReq$, of(guest))),
        map(user => Object.assign({}, guest, user))
      )
      .subscribe(user => this.user$.next(user));
  }

  check() {
    return this.token.valid();
  }

  async getToken() {
    return await this.http.get('api/auth/gettoken').toPromise();
  }

  refreshCSRFToken() {
    return this.getToken();
  }

  login(email: string, password: string, rememberMe:boolean = false) {
    // Ensure we have a valid CSRF token...
    this.refreshCSRFToken();
    return this.http
     .post<LoginData>('/api/auth/login', { email, password, remember_me: rememberMe })
     .pipe(
       tap(data => {
         // console.error("AuthService: login(): user", data);
         this.token.set({ access_token: data.data.jwtToken, token_type: 'bearer' });
         this.updateUser();
       }),
       map(() => this.check())
     );
    // return this.http
    //   .post<Token>('/auth/login', { email, password, remember_me: rememberMe })
    //   .pipe(
    //     tap(token => this.token.set(token)),
    //     map(() => this.check())
    //   );
    // const _token = { access_token: 'MW56YjMyOUAxNjMuY29tWm9uZ2Jpbg==', token_type: 'bearer' };
    // return of(_token).pipe(
    //   tap(token => this.token.set(token)),
    //   map(() => this.check())
    // );
  }

  logout() {
    // Ensure we have a valid CSRF token...
    this.refreshCSRFToken();
    return this.http.get('/api/user/logout', {}).pipe(
      tap(() => this.token.clear()),
      map(() => !this.check())
    );
    // return of({}).pipe(
    //   tap(() => this.token.clear()),
    //   map(() => !this.check())
    // );
  }

  user() {
    return this.user$.pipe(share());
  }
}
