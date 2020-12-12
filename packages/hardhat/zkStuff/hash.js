const { initialize } = require("zokrates-js/node");
const fs = require("fs");

const readZokFile = (name, calla) => {
  fs.readdirSync("./zkStuff").forEach((file) => {
    console.log(file);
    if (file.indexOf(".zok") >= 0) {
      const fileName = file.replace(".zok", "");
      // Add contract to list if publishing is successful
      // if (publishContract(contractName)) {
      //   finalContractList.push(contractName);
      // }

      if (fileName == name)
        calla(fs.readFileSync(`./zkStuff/${file}`).toString());
    }
  });
};

const getHashValue = (preImage, callb) => {
  initialize().then((zokratesProvider) => {
    readZokFile("zkhash", (source) => {
      // console.log(source);
      const artifacts = zokratesProvider.compile(source);
      const { witness, output } = zokratesProvider.computeWitness(artifacts, [
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
      ]);
      // console.log("this is witness", witness);
      callb(output);
    });
  });
};

const verifycation = (preImage, hash, callb) => {
  initialize().then((zokratesProvider) => {
    readZokFile("main", (source) => {
      // console.log(source);
      const artifacts = zokratesProvider.compile(source);
      const { witness, output } = zokratesProvider.computeWitness(artifacts, [
       preImage,
        hash,
      ]);
      const keypair = zokratesProvider.setup(artifacts.program);
      const proof = zokratesProvider.generateProof(artifacts.program, witness, keypair.pk);

      // console.log("this is witness", witness);
      callb(proof);
    });
  });
};

exports.getHashValue = getHashValue;
exports.verifycation = verifycation;
