// SPDX-License-Identifier: LGPL-3.0-only
// This file is LGPL3 Licensed

// This file is MIT Licensed.
//
// Copyright 2017 Christian Reitwiessner
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
pragma solidity ^0.6.1;

import  "./Pairing.sol";
contract zkVerifier {
    using Pairing for *;
    struct VerifyingKey {
        Pairing.G1Point alpha;
        Pairing.G2Point beta;
        Pairing.G2Point gamma;
        Pairing.G2Point delta;
        Pairing.G1Point[] gamma_abc;
    }
    struct Proof {
        Pairing.G1Point a;
        Pairing.G2Point b;
        Pairing.G1Point c;
    }
    function verifyingKey() pure internal returns (VerifyingKey memory vk) {
        vk.alpha = Pairing.G1Point(uint256(0x1936c240636390dc823e3a728e94b208eb53c6756d81da57ec3425e05d43ac10), uint256(0x2d70ff78e8216bf29d58923a686d9738278b8ce2fd822e197c85b09286d15566));
        vk.beta = Pairing.G2Point([uint256(0x29c13ecb6f33dbc4b3b8a02e2e255511ce4c26a8a2f299efcc94caf2de4fce00), uint256(0x2b4daf047abe2e7f0b311118c1b963b63695dc0d769cea78849604434de055bf)], [uint256(0x25ea0d7e2b29de431b86a943db30dbf4d98f68df9ca8a9628d14d1591e817d90), uint256(0x1da9020008df7f549751f8a251af3b2dc4a2ad3e0870de54acaedd9fc1b47e17)]);
        vk.gamma = Pairing.G2Point([uint256(0x00e83c788c2878d1d5eba3ed49b0d81e4c0487dedc3e4d1c2baab5833785b62f), uint256(0x011016e22ae045444f50fb80f246ec486c7e02af09132cd38c4fcf484983e4f2)], [uint256(0x132a90a3b0d369ccd66e2a5ba04a935e44d8ad5dca93a76bba592a578130a911), uint256(0x05eb89e741ed5b5d611cebf92d1ed02cd6f3311089f0d400df7d9ced5a48fd41)]);
        vk.delta = Pairing.G2Point([uint256(0x0c3b60f59d3bd50328a04c0ff6d979199685d0526f89f6ac29d6174ce24707a2), uint256(0x065f6a3323a2abffd621fc263f348eb914904b68d5897729ae34a6b9d33f0852)], [uint256(0x12e0f3721230a0f38f6c9913048d5230fd2615ef3ff7f6ee4b20dfe0bdea1a86), uint256(0x26e7ebce2b44efef6b6315938e33f0a8ecc82dbad635c9efa681ed85bbb59982)]);
        vk.gamma_abc = new Pairing.G1Point[](10);
        vk.gamma_abc[0] = Pairing.G1Point(uint256(0x1af1244d41d20462ebc2abf359b08ecbb9581d19934f11b3d21b50b9a4ee735a), uint256(0x1e53d09d972ee4550b3faadb206ed9302b20e5fc9a7c4728692983b3b865c2d9));
        vk.gamma_abc[1] = Pairing.G1Point(uint256(0x1420163847160f4c865aef7a1dc2b26e50a50c66025eba56cef08a7e47bff526), uint256(0x25d466727d345e200cf99058dd657191cd951e72c0f799765c1e49e18a570dbb));
        vk.gamma_abc[2] = Pairing.G1Point(uint256(0x17d9960ca66bd6d0532ad8d570d4e89cd3252010496e49854d232befd54505c8), uint256(0x14cea4cda661d50cc8cdae8936a8f1ae131e308ab690722c62eed55d81724964));
        vk.gamma_abc[3] = Pairing.G1Point(uint256(0x1f8970357524089109424766a1065b423a55aad40f6dd01853bfe2677b8e19fc), uint256(0x111085e9d8dcf044aefd43c64d14919e2042d25d1fe0f85b55484bd1288c70fa));
        vk.gamma_abc[4] = Pairing.G1Point(uint256(0x0ebbc5e758a6b690b67d32920fc7232fd42a560898ae5dcd48c9e6eeb1f1cfaf), uint256(0x13150b285e773466ac917290c40807f2a06bf8e5559a7bb17d7337849c485b21));
        vk.gamma_abc[5] = Pairing.G1Point(uint256(0x259bea7c0aec70b34f2cb93e50d5da2899cfedbd39b53e6bb3276880763ced32), uint256(0x13c040480a9a8dd1513f10efebb970f78fec8755be629c08ce0bf976c23e7695));
        vk.gamma_abc[6] = Pairing.G1Point(uint256(0x2f9fceed9ddd669a85dbba4889c12f73cb8725d655acdd6ead755ec65a0e3dd6), uint256(0x0037fbfb35c1853d27ea16368b2cd889b74bc5f1e8956fd3f88070e325eae770));
        vk.gamma_abc[7] = Pairing.G1Point(uint256(0x041fb38015b33fbc8cd22be7a562d95b2c66134e0755c25c7a7d6cccaea958c5), uint256(0x149ecba09cadd030c551e94d389952edfdd8ede21451309907403b1f7042970c));
        vk.gamma_abc[8] = Pairing.G1Point(uint256(0x0b93899fa6d41fa9c474edcde82e7c6a91d51b6e9a6e269257878cb5a9e36605), uint256(0x1f26d26d97f88ef89cdc05f4566eb8bb9938b0a033388eaf19ff2481df11f1cc));
        vk.gamma_abc[9] = Pairing.G1Point(uint256(0x274137f014d517ef173192869270c676b7563af1c22d08b6c2837945b7eda592), uint256(0x0830f2ae6a7090c3f85f5c9b555071b8b40b6e6f55004c2fe84757da92b69947));
    }
    function verify(uint[] memory input, Proof memory proof) internal view returns (uint) {
        uint256 snark_scalar_field = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
        VerifyingKey memory vk = verifyingKey();
        require(input.length + 1 == vk.gamma_abc.length);
        // Compute the linear combination vk_x
        Pairing.G1Point memory vk_x = Pairing.G1Point(0, 0);
        for (uint i = 0; i < input.length; i++) {
            require(input[i] < snark_scalar_field);
            vk_x = Pairing.addition(vk_x, Pairing.scalar_mul(vk.gamma_abc[i + 1], input[i]));
        }
        vk_x = Pairing.addition(vk_x, vk.gamma_abc[0]);
        if(!Pairing.pairingProd4(
             proof.a, proof.b,
             Pairing.negate(vk_x), vk.gamma,
             Pairing.negate(proof.c), vk.delta,
             Pairing.negate(vk.alpha), vk.beta)) return 1;
        return 0;
    }
    function verifyTx(
            uint[2] memory a,
            uint[2][2] memory b,
            uint[2] memory c, uint[9] memory input
        ) public view returns (bool r) {
        Proof memory proof;
        proof.a = Pairing.G1Point(a[0], a[1]);
        proof.b = Pairing.G2Point([b[0][0], b[0][1]], [b[1][0], b[1][1]]);
        proof.c = Pairing.G1Point(c[0], c[1]);
        uint[] memory inputValues = new uint[](9);
        
        for(uint i = 0; i < input.length; i++){
            inputValues[i] = input[i];
        }
        if (verify(inputValues, proof) == 0) {
            return true;
        } else {
            return false;
        }
    }
}
