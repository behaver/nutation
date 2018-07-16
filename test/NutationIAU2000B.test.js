'use strict';

const NutationIAU2000B = require('../src/NutationIAU2000B');
const { JDateRepository, JDate } = require('@behaver/jdate');
const expect = require("chai").expect;

describe('#NutationIAU2000B', () => {
  describe('#consturctor(jdr)', () => {
    it('The param jdr should be a JDateRepository', () => {
      expect(() => {
        new NutationIAU2000B();
      }).to.throw();
      expect(() => {
        new NutationIAU2000B(12);
      }).to.throw();
      expect(() => {
        new NutationIAU2000B('222');
      }).to.throw();
      expect(() => {
        let jdate = new JDate();
        new NutationIAU2000B(jdate);
      }).to.throw();
      expect(() => {
        let jdr = new JDateRepository(2446896);
        new NutationIAU2000B(jdr);
      }).not.to.throw();
    });
  })

  describe('#on(jdr)', () => {
    it('The param jdr should be a JDateRepository', () => {
      expect(() => {
        let jdr = new JDateRepository(2446896);
        let n = new NutationIAU2000B(jdr);
        n.on();
      }).to.throw();
      expect(() => {
        let jdr = new JDateRepository(2446896);
        let n = new NutationIAU2000B(jdr);
        n.on(12);
      }).to.throw();
      expect(() => {
        let jdr = new JDateRepository(2446896);
        let n = new NutationIAU2000B(jdr);
        n.on('222');
      }).to.throw();
      expect(() => {
        let jdr = new JDateRepository(2446896);
        let n = new NutationIAU2000B(jdr);
        let jdate = new JDate();
        n.on(jdate);
      }).to.throw();
      expect(() => {
        let jdr = new JDateRepository(2446896);
        let n = new NutationIAU2000B(jdr);
        n.on(new JDateRepository(2446833));
      }).not.to.throw();
    });
  })

  describe('#get longitude()', () => {
    it('The res should be a Number', () => {
      let jdr = new JDateRepository(2446896);
      let n = new NutationIAU2000B(jdr);
      expect(n.longitude).to.be.a('Number');
    })
    it('The cache should be sync on jdate', () => {
      let jdr = new JDateRepository(2446896);
      let n = new NutationIAU2000B(jdr);
      let l_old = n.longitude;
      jdr.JD = 2446816;
      expect(l_old).not.equal(n.longitude);
    })
  })

  describe('#get obliquity()', () => {
    it('The res should be a Number', () => {
      let jdr = new JDateRepository(2446896);
      let n = new NutationIAU2000B(jdr);
      expect(n.obliquity).to.be.a('Number');
    })
    it('The cache should be sync on jdate', () => {
      let jdr = new JDateRepository(2446896);
      let n = new NutationIAU2000B(jdr);
      let l_old = n.obliquity;
      jdr.JD = 2446816;
      expect(l_old).not.equal(n.obliquity);
    })
  })

  describe('verify', () => {
    it('《天文算法》P115 例21.a', () => {
      let jdr = new JDateRepository(2446895.5);
      let n = new NutationIAU2000B(jdr);

      expect(n.longitude).to.closeTo(-3788, 10);
      expect(n.obliquity).to.closeTo(9443, 10);
    })
  })
})