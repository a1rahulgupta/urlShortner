import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-url-create',
  templateUrl: './url-create.component.html',
  styleUrls: ['./url-create.component.css']
})
export class UrlCreateComponent implements OnInit {
  id: any;
  urlData: any;
  shortUrl: any;

  urlForm: FormGroup;
  url: string = '';

  constructor(private router: Router, private api: ApiService, private formBuilder: FormBuilder) { }

  ngOnInit() {

    this.urlForm = this.formBuilder.group({
      'url': [null, Validators.required]
    });

    this.getAllUrl();
    
  }

  onFormSubmit(form: NgForm) {
    this.api.makeUrl(form)
      .subscribe(res => {
        this.shortUrl = res.shortUrl;
        this.url = '';
      }, (err) => {
        console.log(err);
      });
  }


  getAllUrl(){
    this.api.getAllUrl()
    .subscribe(res => {
      this.urlData = res;
    }, err => {
      console.log(err);
    });
  }
    
}
