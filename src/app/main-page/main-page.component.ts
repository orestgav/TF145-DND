import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  public info = [
    { id:'112814254', name: 'Aris', money: 0 },
    { id:'114321107', name: 'Boratello', money: 0 },
    { id:'100187035', name: 'Corvo', money: 0 },
    { id:'93647500', name: 'Ihorko', money: 0 },
    { id:'90458811', name: 'Marianna', money: 0 },
    { id:'92925793', name: 'Nadine', money: 0 },
    { id:'110500470', name: 'Olgert', money: 0 },
    { id:'109247308', name: 'Gosling', money: 0 },
    { id:'92925939', name: 'Fishkinson', money: 0 },
    { id:'116521580', name: 'Yurulf', money: 0 },
  ];
  
  public chars:string[] = [];
  public hiden:string[] = [];

  public sum(): number {
    let sum = 0;

    this.info.forEach(i => {
      if (this.chars.includes(i.id)) {
        sum += i.money;
      }
    });

    return sum;
  }

  constructor() { 
    this.info.forEach(i => {
      if (!window.localStorage.getItem(i.id)) {
        this.chars.push(i.id);
      } else {
        this.hiden.push(i.id);
      }

    });
  }

  ngOnInit(): void {

  }

  public hide(id: string): void {
    const index = this.chars.indexOf(id);
    if (index > -1) { 
      this.chars.splice(index, 1);
      window.localStorage.setItem(id, 'true');
      this.hiden.push(id);
    }
  }

  public unhide(id: string): void {
    const index = this.hiden.indexOf(id);
    if (index > -1) { 
      this.hiden.splice(index, 1);
      window.localStorage.removeItem(id);
      this.chars.push(id);
    }
  }

  public money(id: string, sum: number): void {
    const char = this.info.find(i => i.id == id);

    if (char) {
      char.money = sum;
    }
  }

  public nameFromId(id: string): string {
    const item = this.info.find(i => i.id == id);

    if (item) {
      return item.name;
    }

    return '';
  }

}
