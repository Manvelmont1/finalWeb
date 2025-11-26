import { Component, OnInit } from '@angular/core';
import { ReviewService } from '../services/review.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reviews',
  standalone: true,
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css'],
  imports: [CommonModule]
})
export class ReviewsComponent implements OnInit {

  reviews: any[] = [];
  currentUser: any = {}; // ⬅️ AÑADIDO

  constructor(
    private reviewService: ReviewService,
    private router: Router
  ) {}

  ngOnInit(): void {

    // ⬅️ Cargar usuario guardado en login
    const userData = localStorage.getItem('user');
    if (userData) {
      this.currentUser = JSON.parse(userData);
    }

    this.loadReviews();
  }

  loadReviews() {
    this.reviewService.getAll().subscribe({
      next: (res) => {
        this.reviews = res.reviews;
      },
      error: (err) => console.error(err)
    });
  }

  deleteReview(id: string) {
    if (!confirm('¿Eliminar reseña?')) return;

    this.reviewService.delete(id).subscribe({
      next: () => this.loadReviews(),
      error: err => console.error(err)
    });
  }

  editReview(id: string) {
    this.router.navigate(['/add-review', id]);
  }
}
