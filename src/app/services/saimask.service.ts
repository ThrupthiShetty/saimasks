import { Injectable, Injector } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SaimaskService {
  rootURL: any;
  constructor(private http: HttpClient) { 
    this.rootURL = "https://us-central1-saimasks.cloudfunctions.net/maskapp"
    }

  getRequests() {
    return this.http.get(`${this.rootURL}/maskrequests`);
  }

  createNewRequest(reqPayload) {
    return this.http.post(`${this.rootURL}/maskrequests`, reqPayload)
  }
}
