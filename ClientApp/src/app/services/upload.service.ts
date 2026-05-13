import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private apiUrl = '/api/upload';

  constructor(private http: HttpClient) {}

  uploadImage(file: File, folder: string = 'general'): Observable<{ path: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ path: string }>(`${this.apiUrl}/image?folder=${folder}`, formData);
  }

  deleteImage(path: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/image?path=${encodeURIComponent(path)}`);
  }
}
