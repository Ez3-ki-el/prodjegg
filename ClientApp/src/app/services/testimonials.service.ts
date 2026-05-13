import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Testimonial } from '../models/content.models';

@Injectable({
  providedIn: 'root'
})
export class TestimonialsService {
  private apiUrl = '/api/testimonials';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Testimonial[]> {
    return this.http.get<Testimonial[]>(this.apiUrl);
  }

  getById(id: number): Observable<Testimonial> {
    return this.http.get<Testimonial>(`${this.apiUrl}/${id}`);
  }

  create(testimonial: Testimonial): Observable<Testimonial> {
    return this.http.post<Testimonial>(this.apiUrl, testimonial);
  }

  update(id: number, testimonial: Testimonial): Observable<Testimonial> {
    return this.http.put<Testimonial>(`${this.apiUrl}/${id}`, testimonial);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
