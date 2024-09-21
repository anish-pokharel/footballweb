import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private apiUrl = environment.api_url + 'match';

  constructor(private http:HttpClient) { }
  postBet(obj:any):Observable<any>{
    return this.http.post(environment.api_url+'match',obj)
  }
  getAnswerAssignment():Observable<any>{
    return this.http.get<any>(environment.api_url+'matches')
  }
  updateMatch(id: string, obj: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, obj);
  }

  deleteMatch(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}
