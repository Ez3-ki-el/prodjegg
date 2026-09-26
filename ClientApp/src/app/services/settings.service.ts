import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SiteSettings } from '../models/content.models';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private apiUrl = '/api/settings';

  constructor(private http: HttpClient) {}

  get(): Observable<SiteSettings> {
    return this.http.get<SiteSettings>(this.apiUrl);
  }

  update(settings: SiteSettings): Observable<SiteSettings> {
    return this.http.put<SiteSettings>(this.apiUrl, settings);
  }
}
