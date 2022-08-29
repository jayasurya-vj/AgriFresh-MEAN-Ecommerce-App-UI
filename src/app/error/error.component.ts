import { Component, OnInit, Inject } from '@angular/core';
import { AgriFreshService } from '../services/agrifresh.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  message = "An unknown Error Occured!"
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string },
    public dialogRef: MatDialogRef<ErrorComponent>,
    public agriFreshService: AgriFreshService) { }

  ngOnInit(): void {    
    this.agriFreshService.loaded=true;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
