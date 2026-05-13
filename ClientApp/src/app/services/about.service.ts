import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AboutSection } from '../models/content.models';

@Injectable({
  providedIn: 'root'
})
export class AboutService {
  private apiUrl = '/api/about';

  constructor(private http: HttpClient) {}

  get(): Observable<AboutSection> {
    return this.http.get<AboutSection>(this.apiUrl);
  }

  update(about: AboutSection): Observable<AboutSection> {
    return this.http.put<AboutSection>(this.apiUrl, about);
  }
}
