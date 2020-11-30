import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

//all modules
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from "ngx-toastr";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

//all components
import { AppRoutingModule } from "./app-routing.module";
import { HeaderComponent } from "./header/header/header.component";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { AppMaterialModule } from "./app-material.module";
import { AuthInterceptor } from "./auth/auth-intercepor";
import { PostsComponent } from "./posts/posts.component";
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { CommentComponent } from "./comment/comment.component";
import { DialogFormComponent } from "./comment/dialog-form/dialog-form.component";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    SignupComponent,
    PostsComponent,
    PostCreateComponent,
    CommentComponent,
    DialogFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    AppMaterialModule,
    ReactiveFormsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  entryComponents: [DialogFormComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
