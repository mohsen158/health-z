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
        // const hashh = [
        //   "0x6c00000000000000000000000000000000000000000000000000000000000000",
        //   "0x6c00000000000000000000000000000000000000000000000000000000000000",
        //   "0x6c00000000000000000000000000000000000000000000000000000000000000",
        //   "0x6c00000000000000000000000000000000000000000000000000000000000000",
        //   "0x6c00000000000000000000000000000000000000000000000000000000000000",
        //   "0x6c00000000000000000000000000000000000000000000000000000000000000",
        //   "0x6c00000000000000000000000000000000000000000000000000000000000000",
        //   "0x6c00000000000000000000000000000000000000000000000000000000000000",
        // ];
        const hashh = [
          "0x9ba99edb",
          "0xaf002e05",
          "0xf7660405",
          "0x5a8a0c72",
          "0x2352d8e2",
          "0x857af4cf",
          "0xdb178144",
          "0xc49d722e",
        ];

        await myContract.newInfo(detail, hashh).then(async (res) => {
          // console.log(res);
        });
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
            // console.log(res.buyer);
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
                // console.log(res);
              });
          });
        });
      });
      describe("sellerDeposit()", function () {
        it("Should be able  deposit in one item which has not before  for seller", async function () {
          const accounts = await ethers.getSigners();
        
        let acc2 = accounts[2];
          await myContract.getItemByIndex(0).then(async (res) => {
            //is day
            await myContract.connect(acc2)
              .sellerDeposit(res.id, { value: 10 })
              .then(async (res) => {
                // console.log(res);
              });
          });
        });
      });
      describe("buyerConfirmation()", function () {
        it("Should be able  confirm the hash ", async function () {
          // await myContract.getItemByIndex(0).then(async (res) => {
          //  //is day
          //   await myContract.buyerDeposit(res.id,{value:10}).then(async (res) => {            console.log(res );
          //   })

          // });

          await myContract.getItemByIndex(0).then(async (res) => {
            //is day
            console.log("this is res:", res);
          });

          // id = 3
          await myContract
            .buyerConfirmation(
              3,
              [
                "0x1a8bc8a5aec1b51608b1a382126852e8f52bf4d75acd94e17c4fecb9a0f5f406",
                "0x0e01d1b9e87b6065c325fe69139de5fb8238df9ae3d5538bff180b5ee1c8f8ac",
              ],
              [
                [
                  "0x1a479f6d05c6b64a1b080fdf6401e5e37310eadfefd0de42678b0c15e8a65209",
                  "0x0800e68c2944151a19024185d8020d4eeef9599e33fa99906ea22f57126019b6",
                ],
                [
                  "0x0d467d4e37fec22d61c61daf78fe0b568d50fa961d88eaf7fe523a91645ffd84",
                  "0x26d4e31a5cfdcb8ac92db789cb9845b19a03ca859c39612defeb4d28d46fbf80",
                ],
              ],
              [
                "0x17abf98e187239d31f3fa17465df06c29c8d9e5ee77415403919e31e7e2d858a",
                "0x07dd07828cec6cafd475f3cc0dcc15c2ea0e08743561d1a3af5d2b460de02c0b",
              ]
            )
            .then(async (res) => {
              console.log("proof res:", res);
            });

          // hashZk.getHashValue("sdfsdf", (hash) => {
          //   hashZk.verifycation(
          //     [
          //       "0x00000000",
          //       "0x00000001",
          //       "0x00000002",
          //       "0x00000003",
          //       "0x00000004",
          //       "0x00000005",
          //       "0x00000006",
          //       "0x00000007",
          //       "0x00000008",
          //       "0x00000009",
          //       "0x00000010",
          //       "0x00000011",
          //       "0x00000012",
          //       "0x00000013",
          //       "0x00000014",
          //       "0x00000015",
          //     ],
          //     JSON.parse(hash)[0],
          //     async (proof) => {
          //       console.log("this is proof:", proof.proof);
          //       await myContract.getItemByIndex(0).then(async (res) => {
          //         //is day
          //         await myContract
          //           .buyerConfirmation(
          //             res.id,
          //             proof.proof.a,
          //             proof.proof.b,
          //             proof.proof.c,
          //             proof.inputs,
          //             proof.inputs
          //           )
          //           .then(async (res) => {
          //             console.log("proof res:", res);
          //           });
          //       });
          //     }
          //   );
          // });
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
