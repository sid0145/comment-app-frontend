import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PostsComponent } from "./posts.component";
import { CommentComponent } from "./comment/comment.component";
import { AppMaterialModule } from "../app-material.module";
import { PostCreateComponent } from "./post-create/post-create.component";
import { FormsModule } from "@angular/forms";
import { PostService } from "./post.service";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  declarations: [PostsComponent, CommentComponent, PostCreateComponent],
  imports: [CommonModule, AppMaterialModule, FormsModule, HttpClientModule],
  providers: [PostService],
})
export class PostsModule {}
