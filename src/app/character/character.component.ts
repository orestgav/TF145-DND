import { Component, Input, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss']
})
export class CharacterComponent implements OnInit {
  @Input() id: string = '';
  public char: any;
  public loaded: boolean = false;
  public equipment: any[] = [];
  public backpack: any[] = [];
  public chest: any[] = [];
  public bag: any[] = [];

  constructor(private http: HttpClient) { }

  public roundOne(value: number): number {
    return Math.round(value * 10) / 10; 
  }

  public toKg(value: number): number {
    return Math.round(value * 0.45); 
  }

  public level(): number {
    return 6;
  }

  public money(): number {

    return Math.round(this.char.currencies.cp/100 + this.char.currencies.sp/10 + this.char.currencies.ep/2 + this.char.currencies.gp + this.char.currencies.pp*10);
  }

  public allWeight(items: any[]): number {

    let sum = 0;

    items.forEach((item: { definition: any; quantity: number; }) => {
      sum += item.definition.weight * item.quantity;
    });

    return  Math.round(sum);
  }

  public maxHP(): number {
    let hp = this.char.baseHitPoints + this.char.temporaryHitPoints + (Math.round((this.char.stats[2].value - 10)/2) * this.level());

    if (this.char.feats.find((f: { definition: any; }) => f.definition.name == 'Tough')) {
      hp += 2 *  this.level();
    }

    return hp;
  }

  public curHP(): number {
    return this.maxHP() - this.char.removedHitPoints;
  }

  public valHP(): number {
    return this.curHP() * (100 / this.maxHP());
  }

  ngOnInit(): void {
   

    this.loadData();


  }

  public loadData(): void {
    const httpOptions = {headers: new HttpHeaders({'Access-Control-Allow-Origin': '*'})};
    let req = this.http.get<any>('https://character-service.dndbeyond.com/character/v5/character/' + this.id, httpOptions);

    req.subscribe(result => {
      if (result.success) {
        this.char = result.data;
        console.log( this.char );



        let equipmentId = this.char.id;
        let bag = this.char.inventory.find((i: { definition: { name: string; }; }) => i.definition.name == 'Bag of Holding');
        let bagId = bag ? bag.id : 0;

        let backpack = this.char.inventory.find((i: { definition: { name: string; }; }) => i.definition.name == 'Backpack');
        let backpackId = backpack ? backpack.id : 0;

        let chest = this.char.inventory.find((i: { definition: { name: string; }; }) => i.definition.name == 'Chest');
        let chestId =  chest ? chest.id : 0;

        this.equipment = this.char.inventory.filter( (i: any) => i.containerEntityId == equipmentId && i.definition.name != 'Chest');
        this.bag = this.char.inventory.filter( (i: any) => i.containerEntityId == bagId);
        this.backpack = this.char.inventory.filter( (i: any) => i.containerEntityId == backpackId);
        this.chest = this.char.inventory.filter( (i: any) => i.containerEntityId == chestId);


        this.loaded = true;
      }
    });
  }

}
