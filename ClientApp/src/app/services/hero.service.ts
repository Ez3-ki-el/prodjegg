import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HeroSection } from '../models/content.models';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private apiUrl = '/api/hero';

  constructor(private http: HttpClient) {}

  get(): Observable<HeroSection> {
    return this.http.get<HeroSection>(this.apiUrl);
  }

  update(hero: HeroSection): Observable<HeroSection> {
    return this.http.put<HeroSection>(this.apiUrl, hero);
  }
}
