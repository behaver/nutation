'use strict';

const { JDateRepository, CacheSpaceOnJDate } = require('@behaver/jdate');
const IAU2000BSeq = require('./data/IAU2000B');
const LPSeq = require('./data/LP');

/**
 * Nutation
 *
 * Nutation 是章动计算组件。
 *
 * @author 董 三碗 <qianxing@yeah.net>
 * @version 2.0.0
 * @license MIT
 */
class Nutation {

  /**
   * 构造函数
   *
   * @param  {JDateRepository} options.epoch 儒略时间仓库 对象
   * @param  {String}          options.model 计算模型
   */
  constructor({
    epoch,
    model,
  }) {
    this.private = {};
    this.epoch = epoch;

    if (model === undefined) model = 'iau2000b';
    this.model = model;
  }

  /**
   * 设置 计算历元对象
   * 
   * @param  {JDateRepository} value 计算历元对象
   */
  set epoch(value) {
    if (!(value instanceof JDateRepository)) throw Error('The param epoch has to be a JDateRepository.');
    
    this.private.epoch = value;

    // 创建基于历元的缓存空间
    this.cache = new CacheSpaceOnJDate(value);
  }

  /**
   * 获取 计算历元对象
   * 
   * @return {JDateRepository} 计算历元对象
   */
  get epoch() {
    return this.private.epoch;
  }

  /**
   * 设置 计算模型字串
   * 
   * @param  {String} value 计算模型字串
   */
  set model(value) {
    if (typeof(value) !== 'string') throw Error('The property model should be a String.');

    let model = value.toLowerCase();

    if (model !== this.private.model) {
      switch(model) {

        case 'lp':
          this.seqs = LPSeq;
          break;

        case 'iau2000b':
          this.seqs = IAU2000BSeq;
          break;

        default: 
          throw Error('The property model should be iau1976, iau2000 or iau2006.');
      }

      this.private.model = model;

      // 清空缓存
      this.cache.clear();
    }
  }

  /**
   * 获取 计算模型字串
   * 
   * @return {String} 计算模型字串
   */
  get model() {
    return this.private.model;
  }

  /**
   * 获取黄经章动角度
   * 
   * @return {Number}              黄经章动角度
   *                               单位：角毫秒
   */
  get longitude() {
    if (!this.cache.has('longitude')) {
      let nut = this.calc();
      this.cache.longitude = nut.longitude;
      this.cache.obliquity = nut.obliquity;
    }

    return this.cache.longitude;
  }

  /**
   * 获取交角章动角度
   * 
   * @return {Number}              交角章动角度
   *                               单位：角毫秒
   */
  get obliquity() {
    if (!this.cache.has('obliquity')) {
      let nut = this.calc();
      this.cache.longitude = nut.longitude;
      this.cache.obliquity = nut.obliquity;
    }

    return this.cache.obliquity;
  }

  /**
   * 章动运算
   *
   * @return {Object}              计算结果对象
   */
  calc() {
    let jdr = this.private.epoch,
      t = jdr.JDEC, 
      t2 = jdr.JDECP(2), 
      t3 = jdr.JDECP(3), 
      t4 = jdr.JDECP(4);

    if (this.private.model === 'iau2000b') {

      // 计算单位：角毫秒
      let l = 485868.249036 + 1717915923.2178 * t + 31.8792 * t2 + 0.051635 * t3 - 0.00024470 * t4;
      let l1 = 1287104.79305 + 129596581.0481 * t - 0.5532 * t2 - 0.000136 * t3 - 0.00001149 * t4;
      let F = 335779.526232 + 1739527262.8478 * t - 12.7512 * t2 - 0.001037 * t3 + 0.00000417 * t4;
      let D = 1072260.70369 + 1602961601.2090 * t - 6.3706 * t2 + 0.006593 * t3 - 0.00003169 * t4;
      let Om = 450160.398036 - 6962890.5431 * t + 7.4722 * t2 + 0.007702 * t3 - 0.00005939 * t4;

      // 弧度每角秒
      let rad_per_seconds = 0.00000484813681109536;

      // 初始黄经章动角度
      let ln = 0;

      // 初始交角章动角度
      let on = 0;

      for (let i = 0; i < this.seqs.length; i++) {
        let c_rad = (this.seqs[i][0] * l + this.seqs[i][1] * l1 + this.seqs[i][2] * F + this.seqs[i][3] * D + this.seqs[i][4] * Om) * rad_per_seconds;

        let sin_c = Math.sin(c_rad);
        let cos_c = Math.cos(c_rad);

        ln += (this.seqs[i][5] + this.seqs[i][6] * t) * sin_c + this.seqs[i][7] * cos_c;
        on += (this.seqs[i][8] + this.seqs[i][9] * t) * cos_c + this.seqs[i][10] * sin_c;
      }

      return { 
        longitude: ln / 10000, 
        obliquity: on / 10000 
      };
    } else if (this.private.model === 'lp') {
      let ln = 0,
          on = 0;

      for (let i = 0; i < this.seqs.length; i++) {
        let c = this.seqs[i][0] + this.seqs[i][1] * t + this.seqs[i][2] * t2 + this.seqs[i][3] * t3 + this.seqs[i][4] * t4;

        ln += (this.seqs[i][5] + this.seqs[i][6] * t / 10) * Math.sin(c);
        on += (this.seqs[i][7] + this.seqs[i][8] * t / 10) * Math.cos(c);
      };

      return { 
        longitude: ln * 0.1, 
        obliquity: on * 0.1 
      };
    }
  }
}

module.exports = Nutation;
