import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  public chars = ['92925939',  '109247308', '100187035', '110500470', '116521580', '114321107', '92925793',  ];
  //'112814254', '90458811', '93647500' 
  constructor() { }

  ngOnInit(): void {



  }

}
