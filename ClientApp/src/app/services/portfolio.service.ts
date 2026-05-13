import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PortfolioItem } from '../models/content.models';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private apiUrl = '/api/portfolio';

  constructor(private http: HttpClient) {}

  getAll(category?: string): Observable<PortfolioItem[]> {
    let params = new HttpParams();
    if (category && category !== 'ALL') {
      params = params.set('category', category);
    }
    return this.http.get<PortfolioItem[]>(this.apiUrl, { params });
  }

  getById(id: number): Observable<PortfolioItem> {
    return this.http.get<PortfolioItem>(`${this.apiUrl}/${id}`);
  }

  create(item: PortfolioItem): Observable<PortfolioItem> {
    return this.http.post<PortfolioItem>(this.apiUrl, item);
  }

  update(id: number, item: PortfolioItem): Observable<PortfolioItem> {
    return this.http.put<PortfolioItem>(`${this.apiUrl}/${id}`, item);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
