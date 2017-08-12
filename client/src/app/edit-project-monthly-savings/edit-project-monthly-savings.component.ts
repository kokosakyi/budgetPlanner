import { Component, OnInit, Inject } from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';

@Component({
  selector: 'app-edit-project-monthly-savings',
  templateUrl: './edit-project-monthly-savings.component.html',
  styleUrls: ['./edit-project-monthly-savings.component.css']
})
export class EditProjectMonthlySavingsComponent implements OnInit {

  constructor(
    @Inject(MD_DIALOG_DATA) public data: any,
    public dialogRef: MdDialogRef<EditProjectMonthlySavingsComponent>) { }

  ngOnInit() {
  }

}
