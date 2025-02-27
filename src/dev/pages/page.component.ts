import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { format } from 'date-fns';

@Component({
  selector: 'dev-page',
  template: `
    <page-header></page-header>
    <p>first: {{ first | json }}，now: {{ now | json }}</p>
    <p>id: {{ id | json }}</p>
    page: {{ route.url | json }}
  `
})
export class DevPageComponent implements OnInit {
  first = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  now = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  id = 0;

  constructor(public route: ActivatedRoute) {}

  ngOnInit(): void {
    console.log('ngoninit');
    this.route.params.subscribe(params => (this.id = +params.id));
  }

  _onReuseInit(): void {
    this.now = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    console.log('by _onReuseInit', this.id);
  }
}
