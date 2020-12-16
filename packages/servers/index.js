const { initialize } = require('zokrates-js/node');

const express = require('express')
const app = express()
const port = 3030
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var cors = require('cors')
app.use(cors())
app.post('/getHash', (req, res) => {
  initialize().then(async (zokratesProvider) => {


    await getHashValue(req.body.preImageCreateHashText,(hash)=>{
      res.send(hash)
    });
    const source = "def main(private field a) -> field: return a * a";

    // compilation
    const artifacts = zokratesProvider.compile(source);

    // computation
    const { witness, output } = zokratesProvider.computeWitness(artifacts, ["2"]);

    // run setup
    const keypair = zokratesProvider.setup(artifacts.program);

    // generate proof
    const proof = zokratesProvider.generateProof(artifacts.program, witness, keypair.pk);

    // export solidity verifier
    const verifier = zokratesProvider.exportSolidityVerifier(keypair.vk, "v1");
    // console.log(req.body)
    // res.send(req.body)
});
  
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


const fs = require("fs");

const readZokFile = (name, calla) => {
  fs.readdirSync("./zkFiles").forEach((file) => {
    console.log(file);
    if (file.indexOf(".zok") >= 0) {
      const fileName = file.replace(".zok", "");
      // Add contract to list if publishing is successful
      // if (publishContract(contractName)) {
      //   finalContractList.push(contractName);
      // }

      if (fileName == name)
        calla(fs.readFileSync(`./zkFiles/${file}`).toString());
    }
  });
};

const getHashValue = (preImage, callb) => {
  initialize().then((zokratesProvider) => {
    readZokFile("zkhash", (source) => {
      // console.log(source);
      const artifacts = zokratesProvider.compile(source);
      const { witness, output } = zokratesProvider.computeWitness(artifacts,  preImage);
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
