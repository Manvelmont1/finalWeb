import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReviewService } from '../services/review.service';

@Component({
  selector: 'app-add-review',
  standalone: true,
  templateUrl: './add-review.component.html',
  styleUrls: ['./add-review.component.css'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class AddReviewComponent implements OnInit {

  reviewForm!: FormGroup;
  stars = [1, 2, 3, 4, 5];
  isEdit: boolean = false;
  reviewId: string | null = null;   // <-- añadido

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private reviewService: ReviewService  
  ) {}

  ngOnInit(): void {

    // ⬅ CAMBIO EXACTO: nombres según tu backend
    this.reviewForm = this.fb.group({
      titulo: ['', Validators.required],
      contenido: ['', Validators.required],
      calificacion: [0, Validators.required],
      categoria: ['Otro']
    });

    // ⬅ necesario para detectar si es edición
    this.reviewId = this.route.snapshot.paramMap.get('id');

    if (this.reviewId) {
      this.isEdit = true;

      // ⬅ CARGAR RESEÑA REAL (añadido)
      this.reviewService.getAll().subscribe({
        next: (res) => {
          const r = res.reviews.find((x: any) => x._id === this.reviewId);
          if (r) {
            this.reviewForm.patchValue({
              titulo: r.titulo,
              contenido: r.contenido,
              calificacion: r.calificacion,
              categoria: r.categoria
            });
          }
        }
      });
    }
  }

  setRating(star: number) {
    this.reviewForm.get('calificacion')?.setValue(star);
  }

  // Conexion al backend:
  onSubmit() {
    if (this.reviewForm.invalid) return;

    // ➤ SI ES EDICIÓN
    if (this.isEdit && this.reviewId) {
      this.reviewService.update(this.reviewId, this.reviewForm.value)
        .subscribe({
          next: () => this.router.navigate(['/reviews']),
          error: (err) => console.error(err)
        });
      return;
    }

    // ➤ SI ES CREAR NUEVA
    this.reviewService.createReview(this.reviewForm.value)
      .subscribe({
        next: () => this.router.navigate(['/reviews']),
        error: (err) => console.error(err)
      });
  }
}
