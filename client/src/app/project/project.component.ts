import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  form;
  lineItem: string = '';
  lineCost: number = 0;
  info = [];

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.createForm();
  }

  addItem() {
    this.lineItem = this.form.get('itemName').value;
    this.lineCost = this.form.get('cost').value;
    let lineInfo = {
      lineItem: this.lineItem,
      lineCost: this.lineCost
    };
    this.info.push(lineInfo);
  }

  // Function to create login form
  createForm() {
    this.form = this.formBuilder.group({
      itemName: ['', Validators.required], // Item Name field
      cost: ['', Validators.required] // cost field
    });
  }

}




