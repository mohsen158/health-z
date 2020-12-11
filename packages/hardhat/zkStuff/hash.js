const { initialize } = require('zokrates-js/node');


initialize().then((zokratesProvider) => {
    const source = "def main(private field a) -> field: return a * a";
  });