---
title:
  zh-CN: 基础样例
  en-US: Basic Usage
order: 0
---

## zh-CN

最简单的用法。

## en-US

Simplest of usage.

```ts
import { Component } from '@angular/core';
import { SFRadioWidgetSchema, SFSchema } from '@delon/form';
import { NzMessageService } from 'ng-zorro-antd/message';
import { of, delay } from 'rxjs';

@Component({
  selector: 'app-demo',
  template: ` <sf [schema]="schema" (formSubmit)="submit($event)"></sf> `,
})
export class DemoComponent {
  schema: SFSchema = {
    properties: {
      btn: {
        type: 'string',
        title: 'Button',
        enum: ['A', 'B', 'C'],
        ui: {
          widget: 'radio',
          styleType: 'button',
          buttonStyle: 'solid',
        } as SFRadioWidgetSchema,
        default: 'A',
      },
      // 异步数据
      async: {
        type: 'string',
        title: 'Async',
        ui: {
          widget: 'radio',
          asyncData: () =>
            of([
              { label: '男', value: 'M' },
              { label: '女', value: 'F' },
              { label: '未知', value: 'N' },
            ]).pipe(delay(100)),
          change: console.log,
        } as SFRadioWidgetSchema,
        default: 'N',
      },
    },
  };

  constructor(private msg: NzMessageService) {}

  submit(value: {}): void {
    this.msg.success(JSON.stringify(value));
  }
}
```
