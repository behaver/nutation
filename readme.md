# Nutation 组件库

[![GitHub license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](#) [![npm version](https://img.shields.io/npm/v/react.svg?style=flat)](https://www.npmjs.com/package/@behaver/nutation) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#)

## 简介

Nutation 组件库用于计算天文学中的地球章动运动，它包含模型 IAU2000B 和 LP 低精度快速模型作为计算使用模型。 

Nutation 系列组件的使用依赖于 [JDateRepository](https://github.com/behaver/jdate/blob/master/doc/JDateRepository.md)

## 用例

通过npm安装，在项目目录下执行：

`npm i @behaver/nutation`

---

使用 Nutation 组件进行地球章动计算：

```js
const Nutation = require('@behaver/nutation');
const { JDateRepository } = require('@behaver/jdate');

let jdr = new JDateRepository(new Date('1992/8/15 08:25:12'), 'date');
let nutation = new Nutation({
  epoch: jdr
});

// 黄经章动值
console.log(nutation.longitude);

// 交角章动值
console.log(nutation.obliquity);
```

## API

`constructor(options)`

构造函数: 

* epoch 儒略时间仓库 对象
* model 计算模型, 包含: iau2000b 和 lp

`set epoch(value)`

设置 计算历元对象

`get epoch()`

获取 计算历元对象

`set model(value)`

设置 计算模型字串, 包含: iau2000b 和 lp

`get model()`

获取 计算模型字串

`get longitude()`

获取黄经章动角度，单位：角毫秒

`get obliquity()`

获取交角章动角度，单位：角毫秒

## 许可证书

The MIT license.
