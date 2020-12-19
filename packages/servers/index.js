const { initialize } = require("zokrates-js/node");

const express = require("express");
const app = express();
const port = 3030;
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var cors = require("cors");
app.use(cors());
app.post("/getHash", (req, res) => {
  getHashValue(req.body.preImageCreateHashText, (hash) => {
    res.send(JSON.stringify(hash));
  });
});
app.post("/getProof", (req, res) => {
  console.log("preimage for proof:", req.body.claimedPreImageText);

  verifycation(
    JSON.parse(req.body.claimedPreImageText),
    JSON.parse(req.body.hash),
    (proof) => {
      res.send(proof);
    }
  );
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

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
      const { witness, output } = zokratesProvider.computeWitness(
        artifacts,
        preImage
      );
      console.log("this is output", output);
      callb(JSON.stringify(output));
    });
  });
};

const verifycation = (preImage, hash, callb) => {
  console.log("preimage for proof in func:", preImage[0]);
  console.log("hash for proof in func:", hash);
  initialize().then((zokratesProvider) => {
    readZokFile("main", (source) => {
      // console.log(source);
      const artifacts = zokratesProvider.compile(source);
      const { witness, output } = zokratesProvider.computeWitness(artifacts, [
        preImage[0],
        hash[0],
      ]);
      const keypair = zokratesProvider.setup(artifacts.program);
      const proof = zokratesProvider.generateProof(
        artifacts.program,
        witness,
        keypair.pk
      );

       console.log("this is proof", proof);
      callb(proof);
    });
  });
};

exports.getHashValue = getHashValue;
exports.verifycation = verifycation;
