import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "./auth/auth.guard";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { CommentComponent } from "./comment/comment.component";
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { PostsComponent } from "./posts/posts.component";

const routes: Routes = [
  { path: "", component: PostsComponent },
  {
    path: "post-create",
    component: PostCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "comments/:id",
    component: CommentComponent,
    canActivate: [AuthGuard],
  },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
