const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");
// const {getHashValue} = require('../zkStuff/hash')
const hashZk = require("../zkStuff/hash");
use(solidity);
const { initialize } = require("zokrates-js/node");

describe("My Dapp", function () {
  let myContract;

  describe("HealthZ", function () {
    it("Should deploy YourContract", async function () {
      // const [owner, addr1, addr2] = await ethers.getSigners();

      const YourContract = await ethers.getContractFactory("HealthZ");
      myContract = await YourContract.deploy();
      // await YourContract.transfer(addr1.address, 50);

      // console.log(owner)
      //   const ownerBalance = await myContract.balanceOf(owner.address);
      //   expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
      // console.log(ownerBalance)
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
            const infoId = res.id;
            const deposit = 10;
            const endTime = 5; //is day
            //console.log(res);
            await myContract.newItem(price, infoId, deposit, endTime);
          });
          //  expect().to.equal("newPurpose");
          //  console.log(a.data);

          //await myContract.infos().with
        });
      });
      describe("getItemByIndex()", function () {
        it("Should be able to get an  Item from last recently added item", async function () {
          await myContract.getItemByIndex(0).then(async (res) => {
            //is day
            console.log(res.buyer);
          });
          //  expect().to.equal("newPurpose");
          //  console.log(a.data);

          //await myContract.infos().with
        });
      });
      describe("buyerDeposit()", function () {
        it("Should be able  deposit in one item which has not before ", async function () {
          await myContract.getItemByIndex(0).then(async (res) => {
            //is day
            await myContract
              .buyerDeposit(res.id, { value: 10 })
              .then(async (res) => {
                console.log(res);
              });
          });

          //  expect().to.equal("newPurpose");
          //  console.log(a.data);

          //await myContract.infos().with
        });
      });
      describe("buyerConfirmation()", function () {
        it("Should be able  confirm the hash ", async function () {
          // await myContract.getItemByIndex(0).then(async (res) => {
          //  //is day
          //   await myContract.buyerDeposit(res.id,{value:10}).then(async (res) => {            console.log(res );
          //   })

          // });

          hashZk.getHashValue("sdfsdf", (hash) => {
            hashZk.verifycation(
              [
                "0x00000000",
                "0x00000001",
                "0x00000002",
                "0x00000003",
                "0x00000004",
                "0x00000005",
                "0x00000006",
                "0x00000007",
                "0x00000008",
                "0x00000009",
                "0x00000010",
                "0x00000011",
                "0x00000012",
                "0x00000013",
                "0x00000014",
                "0x00000015",
              ],
              JSON.parse(hash)[0],
              async (proof) => {
                await myContract.getItemByIndex(0).then(async (res) => {
                  //is day

                  await myContract
                    .buyerConfirmation(
                      res.id,
                      proof.proof.a,
                      proof.proof.b,
                      proof.proof.c,
                      proof.inputs
                    )
                    .then(async (res) => {
                      console.log("proof res:", res);
                    });
                });
              }
            );
          });
          // const source = "def main(private field a) -> field: return a * a";

          // // compilation
          // const artifacts = zokratesProvider.compile(source);

          // // computation
          // const {
          //   witness,
          //   output,
          // } = zokratesProvider.computeWitness(artifacts, ["2"]);

          // // run setup
          // const keypair = zokratesProvider.setup(artifacts.program);

          // // generate proof
          // const proof = zokratesProvider.generateProof(
          //   artifacts.program,
          //   witness,
          //   keypair.pk
          // );

          // // export solidity verifier
          // const verifier = zokratesProvider.exportSolidityVerifier(
          //   keypair.vk,
          //   "v1"
          // );

          //  expect().to.equal("newPurpose");
          //  console.log(a.data);

          //await myContract.infos().with
        });
      });
    });
  });
});
