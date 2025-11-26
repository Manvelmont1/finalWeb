import { Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { RegisterComponent } from './register/register.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { AddReviewComponent } from './add-review/add-review.component';

export const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'reviews', component: ReviewsComponent },
  { path: 'add-review', component: AddReviewComponent },
  { path: 'edit-review/:id', component: AddReviewComponent },
];
