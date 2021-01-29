import { expect } from "chai";
import { Item, GildedRose } from "../app/gilded-rose";

describe("Gilded Rose", function () {
  it("Item names don't change", function () {
    const gildedRose = new GildedRose([new Item("foo", 0, 0)]);
    const items = gildedRose.updateInventory();
    expect(items[0].name).to.equal("foo");
  });

  it("At the end of each day our system lowers both values for every item", function () {
    const gildedRose = new GildedRose([new Item("foo", 42, 31)]);
    const items = gildedRose.updateInventory();
    expect(items[0].sellIn).to.equal(41);
    expect(items[0].quality).to.equal(30);
  });

  it("Once the sell by date has passed, Quality degrades twice as fast", function () {
    const gildedRose = new GildedRose([new Item("foo", 1, 31)]);
    const items = gildedRose.updateInventory();
    expect(items[0].sellIn).to.equal(0);
    expect(items[0].quality).to.equal(30);

    gildedRose.updateInventory();
    expect(items[0].sellIn).to.equal(-1);
    expect(items[0].quality).to.equal(28);
  });

  it("The Quality of an item is never negative", function () {
    const gildedRose = new GildedRose([new Item("foo", 42, 0)]);
    const items = gildedRose.updateInventory();
    expect(items[0].sellIn).to.equal(41);
    expect(items[0].quality).to.equal(0);
  });

  it('"Aged Brie" actually increases in Quality the older it gets', function () {
    const gildedRose = new GildedRose([new Item("Aged Brie", 42, 31)]);
    const items = gildedRose.updateInventory();
    expect(items[0].sellIn).to.equal(41);
    expect(items[0].quality).to.equal(32);
  });

  it("The Quality of an item is never more than 50", function () {
    const gildedRose = new GildedRose([new Item("Aged Brie", 42, 49)]);
    const items = gildedRose.updateInventory();
    expect(items[0].sellIn).to.equal(41);
    expect(items[0].quality).to.equal(50);

    gildedRose.updateInventory();
    expect(items[0].sellIn).to.equal(40);
    expect(items[0].quality).to.equal(50);
  });

  it('"Sulfuras", being a legendary item, never has to be sold or decreases in Quality', function () {
    const gildedRose = new GildedRose([
      new Item("Sulfuras, Hand of Ragnaros", 42, 80),
    ]);
    const items = gildedRose.updateInventory();
    expect(items[0].sellIn).to.equal(42);
    expect(items[0].quality).to.equal(80);
  });

  it('"Backstage passes", like aged brie, increases in Quality as its SellIn value approaches', function () {
    const gildedRose = new GildedRose([
      new Item("Backstage passes to a TAFKAL80ETC concert", 42, 31),
    ]);
    const items = gildedRose.updateInventory();
    expect(items[0].sellIn).to.equal(41);
    expect(items[0].quality).to.equal(32);
  });

  it("Quality [of backstage passes] increases by 2 when there are 10 days or less", function () {
    const gildedRose = new GildedRose([
      new Item("Backstage passes to a TAFKAL80ETC concert", 10, 31),
    ]);
    const items = gildedRose.updateInventory();
    expect(items[0].sellIn).to.equal(9);
    expect(items[0].quality).to.equal(33);
  });
  it("Quality [of backstage passes] increases by 3 when there are 5 days or less", function () {
    const gildedRose = new GildedRose([
      new Item("Backstage passes to a TAFKAL80ETC concert", 5, 31),
    ]);
    const items = gildedRose.updateInventory();
    expect(items[0].sellIn).to.equal(4);
    expect(items[0].quality).to.equal(34);
  });

  it("Quality [of backstage passes] drops to 0 after the concert", function () {
    const gildedRose = new GildedRose([
      new Item("Backstage passes to a TAFKAL80ETC concert", 0, 31),
    ]);
    const items = gildedRose.updateInventory();
    expect(items[0].sellIn).to.equal(-1);
    expect(items[0].quality).to.equal(0);
  });

  it('"Aged Brie" goes up in quality all the way to 50', function () {
    const gildedRose = new GildedRose([new Item("Aged Brie", 0, 48)]);
    const items = gildedRose.updateInventory();
    expect(items[0].sellIn).to.equal(-1);
    expect(items[0].quality).to.equal(50);
  });
});
