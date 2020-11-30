import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { DialogData } from "./dialog.interface";

@Component({
  selector: "app-dialog-form",
  templateUrl: "./dialog-form.component.html",
  styleUrls: ["./dialog-form.component.css"],
})
export class DialogFormComponent implements OnInit {
  commentForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit() {
    this.initilizeForm();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  //inilizating form
  private initilizeForm() {
    this.commentForm = this.fb.group({
      comment: ["", Validators.required],
    });
  }
}
