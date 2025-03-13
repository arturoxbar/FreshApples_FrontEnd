import { Component, OnInit } from '@angular/core';

interface Food {
  id: number;
  name: string;

}

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: false
})
export class SearchPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  foods: Food[] = [
    {
      id: 1,
      name: 'Apples',

    },
    {
      id: 2,
      name: 'Carrots',

    },
    {
      id: 3,
      name: 'Cupcakes',

    },
  ];

  compareWith(o1: Food | null, o2: Food | Food[] | null): boolean {
    if (!o1 || !o2) {
      return o1 === o2;
    }

    if (Array.isArray(o2)) {
      return o2.some((o) => o.id === o1.id);
    }

    return o1.id === o2.id;
  }

  handleChange(event: Event) {
    const target = event.target as HTMLIonSelectElement;
    console.log('Current value:', JSON.stringify(target.value));
  }
  
}
