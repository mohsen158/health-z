const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("My Dapp", function () {
  let myContract;

  describe("HealthZ", function () {
    it("Should deploy YourContract", async function () {
      const YourContract = await ethers.getContractFactory("HealthZ");

      myContract = await YourContract.deploy();
    });

    describe("setPurpose()", function () {
      it("Should be able to set a new purpose", async function () {
        const newPurpose = "Test Purpose";

        await myContract.setPurpose(newPurpose);
        expect(await myContract.purpose()).to.equal(newPurpose);
      });
    });
    describe("randomId()", function () {
      it("Should be able to set a new Info", async function () {
        await myContract.randomId();
      });
    });
    describe("newInfo()", function () {
      it("Should be able to set a new Info", async function () {
        const detail = "Test detail";
        await myContract.newInfo(detail);
        // await myContract.test(0).then((res)=>{
        //   console.log(res)
        // })
        //  expect().to.equal("newPurpose");
        //  console.log(a.data);

        //await myContract.infos().with
      });
      describe("newItem()", function () {
        it("Should be able to set a new Item from last recently added info", async function () {
          await myContract.getInfoByIndex(0).then(async (res) => {
            const detail = "Test detail";
            const price = 100;
            const infoId = res[1];
            const deposit = 10;
            const endTime = 5; //is day
            await myContract.newItem(price, infoId, deposit, endTime);
          });
          //  expect().to.equal("newPurpose");
          //  console.log(a.data);

          //await myContract.infos().with
        });
      });
    });
  });
});
