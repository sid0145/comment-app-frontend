import { Component, OnChanges, OnInit } from "@angular/core";
import { MatDialog, MatSnackBar } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { remove } from "lodash";

//all local imports here
import { AuthService } from "../auth/auth.service";
import { PostService } from "../posts/post.service";
import { CommentService } from "./comment.service";
import { DialogFormComponent } from "./dialog-form/dialog-form.component";

@Component({
  selector: "app-comment",
  templateUrl: "./comment.component.html",
  styleUrls: ["./comment.component.css"],
})
export class CommentComponent implements OnInit, OnChanges {
  title: string;
  username: string;
  content: string;
  userId: string;
  postId: string;
  commentCount;
  isLoading: boolean = false;

  comments = [];
  allComments = [];
  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private authService: AuthService,
    private commentService: CommentService,
    private snackBar: MatSnackBar
  ) {
    this.getIdOfthePost();
  }

  ngOnInit() {
    this.getpostIdandPopulate();
    this.getCommentsofPost();
    this.getCommentsOfComment();
    this.countCommnet();
    this.userId = this.authService.getUserId();
  }

  ngOnChanges() {
    this.allComments = [...this.allComments];
  }

  //-----------------------------getting id of the current  post with activated routes -------//
  private getIdOfthePost() {
    this.route.params.subscribe((params) => {
      this.postId = params["id"];
    });
  }

  //-------------------------------------------------------get and print the comments of the post
  private getCommentsofPost() {
    this.commentService
      .getCommentByPostId(this.postId)
      .subscribe((data: { comments: any }) => {
        for (let i = 0; i < data.comments.length; i++) {
          this.comments.push(data.comments[i]);
        }
      });
  }
  //---------------------------count total number of comments in post------------------------//

  private countCommnet() {
    this.commentService.getCountOfComment(this.postId).subscribe((data) => {
      this.commentCount = data;
    });
  }

  //--------------------------------get post and populate on the top of the all comments------------------//
  private getpostIdandPopulate() {
    this.postService.getPost(this.postId).subscribe(
      (post: {
        id: string;
        username: string;
        title: string;
        content: string;
      }) => {
        this.title = post.title;
        this.content = post.content;
        this.username = post.username;
      },
      (err) => {
        this.toastr.error("something went wrong!", "error", {
          timeOut: 2000,
        });
      }
    );
  }

  //-------------------------------comments reply function with edit also functionality---------------------//
  openDialog(id: string, commentId: string): void {
    const options = {
      width: "400px",
      height: "250px",
      data: {},
    };
    if (id && commentId) {
      options.data = { id: id, commentId: commentId };
    } else if (id) {
      options.data = { id: id };
    }
    const dialogRef = this.dialog.open(DialogFormComponent, options);
    dialogRef.afterClosed().subscribe((result) => {
      if (id && commentId) {
        // console.log(commentId);
        this.commentService
          .updateNestedCommentById(id, commentId, result.comment, this.postId)
          .subscribe((data) => {
            const index = this.allComments.findIndex(
              (comment) => comment._id === id
            );
            this.allComments[index].id = id;
            this.allComments[index].comment = result.comment;
            this.allComments[index].commentId = commentId;
            this.allComments[index].postId = this.postId;
            this.allComments[index].username = this.username;
            this.allComments[index].userId = this.userId;
            //console.log(this.allComments);
            this.allComments = [...this.allComments];
            this.snackBar.open("you updated this comment", "success", {
              duration: 2000,
            });
          });
      } else if (id) {
        this.commentService
          .updateCommentById(id, result.comment, this.postId)
          .subscribe((data) => {
            const index = this.comments.findIndex(
              (comment) => comment._id === id
            );
            this.comments[index].id = id;
            this.comments[index].comment = result.comment;
            this.comments[index].postId = this.postId;
            this.comments[index].username = this.username;
            this.comments[index].userId = this.userId;
            this.comments = [...this.comments];
            this.snackBar.open("you updated this comment", "success", {
              duration: 2000,
            });
          });
      } else {
        this.commentService
          .createComment(result.comment, this.postId)
          .subscribe((data) => {
            this.comments.push(data);
            this.comments = [...this.comments];
            this.countCommnet();
            this.snackBar.open("you commented on this post", "success", {
              duration: 2000,
            });
          });
      }
    });
  }

  // ----------------------deleting a comment if you are auhtorized
  delteHandler(id: string) {
    this.commentService.deleteComment(id).subscribe(
      (data: any) => {
        remove(this.comments, (comment) => {
          return comment._id === data._id;
        });
        this.comments = [...this.comments];
        this.countCommnet();
        this.snackBar.open("you deleted this comment", "success", {
          duration: 2000,
        });
      },
      (err) => {
        this.snackBar.open("oop's something went wrong", "error", {
          duration: 2000,
        });
      }
    );
  }

  // *********************{all nested comments code  here}*********************

  //-----------listing input of nested reply and push it into local array-----------//
  onKey(event: any, id: string) {
    const data = event.target.value;
    if (event.keyCode === 13) {
      event.preventDefault();
      this.commentService.createMultiComment(data, this.postId, id).subscribe(
        (data) => {
          if (data === null) {
            return;
          }
          this.allComments.push(data);
          this.allComments = [...this.allComments];
          this.snackBar.open("success", "success", {
            duration: 2000,
          });
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  //--------------getting all the nesting comments ---------------//
  getCommentsOfComment() {
    this.commentService
      .getMultiComment(this.postId)
      .subscribe((data: { comments: any }) => {
        for (let i = 0; i < data.comments.length; i++) {
          this.allComments.push(data.comments[i]);
        }
      });
  }

  //---------------------delete handler of nested comments -------------------//

  deleteHandler(id: string) {
    this.commentService.deleteNestedComment(id).subscribe(
      (data: any) => {
        console.log(data);
        remove(this.allComments, (comment) => {
          return comment._id === data._id;
        });
        this.allComments = [...this.allComments];
        this.snackBar.open("you deleted this comment", "success", {
          duration: 2000,
        });
      },
      (err) => {
        this.snackBar.open("oop's something went wrong", "error", {
          duration: 2000,
        });
      }
    );
  }
}
