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
import { SFSchema, SFTransferWidgetSchema } from '@delon/form';
import { NzMessageService } from 'ng-zorro-antd/message';
import { of, delay } from 'rxjs';

@Component({
  selector: 'app-demo',
  template: ` <sf [schema]="schema" (formSubmit)="submit($event)"></sf> `,
})
export class DemoComponent {
  schema: SFSchema = {
    properties: {
      roles: {
        type: 'number',
        title: '角色',
        enum: [
          { title: 'DNS管理', value: 10 },
          { title: 'ECS管理', value: 11 },
          { title: 'OSS管理', value: 12 },
          { title: 'RDS管理', value: 13 },
        ],
        ui: {
          widget: 'transfer',
          titles: ['未拥有', '已拥有'],
        } as SFTransferWidgetSchema,
        default: [11, 12],
      },
      roles2: {
        type: 'number',
        title: '角色',
        ui: {
          widget: 'transfer',
          titles: ['未拥有', '已拥有'],
          asyncData: () =>
            of([
              { title: 'DNS管理', value: 10 },
              { title: 'ECS管理', value: 11 },
              { title: 'OSS管理', value: 12 },
              { title: 'RDS管理', value: 13 },
            ]).pipe(delay(10)),
        } as SFTransferWidgetSchema,
        default: [11, 12],
      },
    },
  };

  constructor(private msg: NzMessageService) {}

  submit(value: {}): void {
    this.msg.success(JSON.stringify(value));
  }
}
```
