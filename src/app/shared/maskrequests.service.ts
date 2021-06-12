import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
 
@Injectable({
  providedIn: 'root'
})
export class MasksRequetsService {
 
  constructor(private http: HttpClient) { }
 
  public getData = (route: string) => {
   // return this.http.get(this.createCompleteRoute("/api/v1/"+route, environment.urlAddress));
   return this.http.get(this.createCompleteRoute("/maskapp/"+route, environment.maskRequestEP));
  }
 
  public create = (route: string, body) => {
    return this.http.post(this.createCompleteRoute("/maskapp/"+route, environment.maskRequestEP), body, this.generateHeaders());
  }

  public contribute = (route: string, body) => {
    return this.http.post(this.createCompleteRoute("/maskapp/"+route, environment.maskRequestEP), body, this.generateHeaders());
  }
 
 
  public update = (route: string, body) => {
    return this.http.put(this.createCompleteRoute(route, environment.urlAddress), body, this.generateHeaders());
  }
 
  public delete = (route: string) => {
    return this.http.delete(this.createCompleteRoute(route, environment.urlAddress));
  }
 
  private createCompleteRoute = (route: string, envAddress: string) => {
    return `${envAddress}${route}`;
  }
 
  private generateHeaders = () => {
    return {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }
  }
}
