import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit(): void {

    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*'
      })
    };
    
    let req = this.http.get<any>('https://character-service.dndbeyond.com/character/v5/character/112814254', httpOptions);



    req.subscribe(result => {
      console.log( result );
    });

  }

}
