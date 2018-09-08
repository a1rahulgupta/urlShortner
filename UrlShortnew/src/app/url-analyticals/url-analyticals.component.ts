import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { AmChartsService } from "amcharts3-angular2";

@Component({
  selector: 'app-url-analyticals',
  templateUrl: './url-analyticals.component.html',
  styleUrls: ['./url-analyticals.component.css']
})
export class UrlAnalyticalsComponent implements OnInit {
  histogramData: any;
  responseData: any;
  gd: any = [];
  dateFormatArray: any;
  avgCountArray: any;
  chart: any;
  id: any;
  analyticalData: any;
  minDate: Date;
  maxDate: Date;
  params: any = {
    startDate: '',
    startTimeDate: '',
    endTimeDate: '',
    endDate: '',
    period: '',
    shortUrl: '',
    month: '',
    year: ''
  }

  timeDate: '';
  startTime: '';
  endTime: '';
  period: string = '';
  year: string = '';

  graphData: any;

  constructor(private router: Router,
    public AmCharts: AmChartsService,
    private route: ActivatedRoute, private api: ApiService, private formBuilder: FormBuilder) {

  }

  ngOnInit() {
    this.getUrlInfo(this.route.snapshot.params['id']);
    this.maxDate = new Date();
  }


  getUrlInfo(url) {
    this.id = {
      shortUrl: url,
      todayDate: new Date()
    };
    this.api.getUrlInfo(this.id).subscribe(res => {
      this.analyticalData = res.data;
      this.makeGraph(this.params);
    })

  }
  makeGraph(graphValue) {
    let avgCountArray1 = [];
    let dateFormatArray1 = [];
    this.params.shortUrl = this.analyticalData.shortUrl;
    if (this.params.period == 'hours') {
      var timeDateObj = new Date(this.timeDate);

      var startTimeDateObj = new Date(this.startTime);
      var startTimeHours = startTimeDateObj.getHours();
      var startTimeMinutes = startTimeDateObj.getMinutes();
      timeDateObj.setHours(startTimeHours);
      timeDateObj.setMinutes(startTimeMinutes);
      this.params.startDate = timeDateObj;
      var timeDateObj = new Date(this.timeDate);
      var endTimeDateObj = new Date(this.endTime);
      var endTimeHours = endTimeDateObj.getHours();
      var endTimeMinutes = endTimeDateObj.getMinutes();
      timeDateObj.setHours(endTimeHours);
      timeDateObj.setMinutes(endTimeMinutes);
      this.params.endDate = timeDateObj;
    }

    this.api.makeGraph(this.params)
      .subscribe(res => {
        this.responseData = res.data;
        this.histogramData = res.data.dateFormatArray;
        this.chart = this.AmCharts.makeChart("chartdiv", {
          "type": "serial",
          "theme": "light",
          "columnWidth": 1,
          "dataProvider": this.histogramData,
          "graphs": [{
            "fillColors": "#c55",
            "fillAlphas": 0.9,
            "lineColor": "#fff",
            "lineAlpha": 0.7,
            "type": "column",
            "valueField": "count"
          }],
          "categoryField": "category",
          "categoryAxis": {
            "startOnAxis": true,
            "title": "Date"
          },
          "valueAxes": [{
            "title": "Count"
          }]
        });
      }, (err) => {
        console.log(err);
      });

  }
}
