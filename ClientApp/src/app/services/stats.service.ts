import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Stat } from '../models/content.models';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private apiUrl = '/api/stats';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Stat[]> {
    return this.http.get<Stat[]>(this.apiUrl);
  }

  getById(id: number): Observable<Stat> {
    return this.http.get<Stat>(`${this.apiUrl}/${id}`);
  }

  create(stat: Stat): Observable<Stat> {
    return this.http.post<Stat>(this.apiUrl, stat);
  }

  update(id: number, stat: Stat): Observable<Stat> {
    return this.http.put<Stat>(`${this.apiUrl}/${id}`, stat);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
