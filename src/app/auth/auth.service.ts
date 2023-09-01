import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticated: boolean = false;
  private token: string;
  private authStatusListener = new Subject<boolean>();

  private userId: string; //creating user id to store that's coming from express

  private tokenTimer;

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {email, password}
    this.http.post<{message: string}>("http://localhost:3000/api/user/signup", authData).subscribe(() => {
      this.router.navigate(["/"])
    }, error => {
      this.authStatusListener.next(false);
    })
    
  }

  login(email: string, password: string) {
    const authData: AuthData = {email, password}
    this.http.post<{token: string, expiresIn: number, userId: string}>("http://localhost:3000/api/user/login", authData)
    .subscribe((response) => {
      const expiresInDuration = response.expiresIn;
      console.log(expiresInDuration);

      this.userId = response.userId; //storing the userId from login response
      
      this.token = response.token; //setting up the token
      this.isAuthenticated = true; //setting up a synchronous value to say that the user is authenticated
      this.authStatusListener.next(true); //emitting up a asynchronous observable value to say that the user is authenticated
      this.setAuthTimer(response.expiresIn); //setting up time when the user need to logout

      const now = new Date();
      const expirationDate = new Date(now.getTime() + expiresInDuration *1000);
      this.saveAuthData(this.token, expirationDate, response.userId); //setting up the localstorage with token and expirationDate value


      this.router.navigate(["/"]);

    }, error => {
      this.authStatusListener.next(false);
    });
  }

  //auto logging the user whenever the page reloads with the help of localstorage
  //This method is set in bootstrap component, because that's the first loaded component, whenever a page reloads
  autoAuthUser() {
    const authInformation = this.getAuthData(); //getting the token and expiration date from localstorage

    if(!authInformation) //checking for value is null
      return;

    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime(); //setting up expiresIn with respect to current time and token expiration time
    if(expiresIn > 0) { 
      this.token = authInformation.token; //setting up the token
      this.isAuthenticated = true; //setting up a synchronous value to say that the user is authenticated
      this.authStatusListener.next(true); //emitting out a asynchronous observable value to say that the user is authenticated
      this.authStatusListener.next(true); //setting up time when the user need to logout

      this.userId = authInformation.userId; //restoring back the userId whenever any loading occurs from localstorage
    }

  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();  
    }, duration * 1000);
  }

  logout() {

    this.userId = null;

    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userId", userId); //storing the userId in localstorage to persist the ID once any reload happens
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId"); //remove userId after logout
  }

  private getAuthData(): any {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");

    const userId = localStorage.getItem("userId");

    if(!token || !expirationDate) {
      return;
    }

    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId //returning userId while autoLogin function is called
    }

  }

}
