import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CtaSection } from '../models/content.models';

@Injectable({
  providedIn: 'root'
})
export class CtaService {
  private apiUrl = '/api/cta';

  constructor(private http: HttpClient) {}

  get(): Observable<CtaSection> {
    return this.http.get<CtaSection>(this.apiUrl);
  }

  update(cta: CtaSection): Observable<CtaSection> {
    return this.http.put<CtaSection>(this.apiUrl, cta);
  }
}
