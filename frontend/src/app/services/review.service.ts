import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReviewService {

  private api = 'http://localhost:2608/api/reviews';

  constructor(private http: HttpClient) {}

  createReview(data: any): Observable<any> {
    return this.http.post(this.api, data);
  }

  getAll(): Observable<any> {
    return this.http.get(this.api);
  }

  getMyReviews(): Observable<any> {
    return this.http.get(`${this.api}/my-reviews`);
  }

  getByUser(id: string): Observable<any> {
    return this.http.get(`${this.api}/user/${id}`);
  }

  update(id: string, data: any): Observable<any> {
    return this.http.put(`${this.api}/${id}`, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }

  filter(min: number, max: number): Observable<any> {
    return this.http.get(`${this.api}/filter?minRating=${min}&maxRating=${max}`);
  }
}
