import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss']
})
export class CharacterComponent implements OnInit {
  @Input() id: string = '';
  @Input() name: string = '';
  @Output() hideChar = new EventEmitter<void>();
  @Output() moneyEarned = new EventEmitter<number>();
  public allModifiers: any[] = [];

  public str: number = 0;
  public dex: number = 0;
  public con: number = 0;
  public int: number = 0;
  public wis: number = 0;
  public chr: number = 0;

  public char: any;
  public loaded: boolean = false;
  public equipment: any[] = [];
  public backpack: any[] = [];
  public chest: any[] = [];
  public bag: any[] = [];
  public money: number = 0;
  public maxWeight: number = 0;

  public maxHP: number = 0;
  public curHP: number = 0;
  public level: number = 6;

  constructor(private http: HttpClient) { }

  public roundOne(value: number): number {
    return Math.round(value * 10) / 10; 
  }

  public toKg(value: number): number {
    return Math.round(value * 0.45); 
  }


  public allWeight(items: any[]): number {

    let sum = 0;

    items.forEach((item: { definition: any; quantity: number; }) => {
      sum += item.definition.weight * item.quantity;
    });

    return Math.round(sum);
  }

  public valHP(): number {
    return this.curHP * (100 / this.maxHP);
  }

  public weightPers(): number {
    return Math.round((this.allWeight(this.equipment) + this. allWeight(this.backpack))/(this.maxWeight / 100)  );
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
        console.log(this.char.name);
        console.log(this.char);

        this.char.inventory = this.modifyItems(this.char.inventory)
        this.allModifiers.push(...this.char.modifiers.class);
        this.allModifiers.push(...this.char.modifiers.feat);
        this.allModifiers.push(...this.char.modifiers.item);
        this.allModifiers.push(...this.char.modifiers.race);


        // stats 
        this.str = this.char.stats[0].value + this.bonus('strength-score');
        this.dex = this.char.stats[1].value + this.bonus('dexterity-score');
        this.con = this.char.stats[2].value + this.bonus('constitution-score');
        this.int = this.char.stats[3].value + this.bonus('intelligence-score');
        this.wis = this.char.stats[4].value + this.bonus('wisdom-score');
        this.chr = this.char.stats[5].value + this.bonus('charisma-score');
        
        // weight 
        this.maxWeight = this.str * 15; 

        // money
        this.money = Math.round(this.char.currencies.cp/100 + this.char.currencies.sp/10 + this.char.currencies.ep/2 + this.char.currencies.gp + this.char.currencies.pp*10);
        this.moneyEarned.emit(this.money);

        // HP
        let hp = this.char.baseHitPoints + this.char.temporaryHitPoints + (Math.round((this.con - 10)/2) * this.level);

        if (this.char.feats.find((f: { definition: any; }) => f.definition.name == 'Tough')) {
          hp += 2 *  this.level;
        }
        this.maxHP = hp;
        this.curHP = this.maxHP - this.char.removedHitPoints;

        // equipment
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

  public modifyItems(items: []): [] {
    items.forEach((item: { definition: any; id: number;  }) => {
      const custom =  this.char.characterValues.find((c: { typeId: number; valueId: number; }) => c.typeId == 8 && c.valueId == item.id)
      if (custom) {
        item.definition.name = custom.value;
      }
    });

    return items;
  }

  public bonus(type: string): number {
    let bonus = 0;
    this.allModifiers.forEach(m => {
      if (m.subType == type) {
        bonus += m.fixedValue;
      }
    });

    return bonus;
  }

  public hide(): void {
    this.hideChar.emit();
  }
}
