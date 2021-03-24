pragma solidity >=0.6.0 <0.7.0;
//import "hardhat/console.sol";

import "./zkVerifier.sol";

//import "@openzeppelin/contracts/access/Ownable.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol
contract HealthZ is zkVerifier {
    // *** Structs ***

    struct Item {
        address payable buyer;
        address payable seller;
        uint256 price;
        uint16 infoId;
        uint16 id;
        uint256 deposit;
        uint256 sellerDeposit;
        uint256 buyerDeposit;
        bool sellerConfirmation;
        bool buyerConfirmation;
        uint256 endTime;
    }
    struct Info {
        address creator;
        uint16 id;
        // address owner;
        // address contractAddress;
        string detail;
        uint256[9] infoHash;
    }

    // *** Variable ***
    uint16 idMaterial = 0;
    string public purpose = "🛠 Programming Unstoppable Money";

    // *** Mapping ***
    uint16 public infoSize = 0;
    mapping(uint16 => Info) public infos;
    uint16[] public infosId;

    uint16 public itemSize = 0;
    mapping(uint16 => Item) public items;
    uint16[] public itemsId;

    // Modifiers
    modifier onlyHospital {
        //require(msg.sender == admin);
        _;
    }

    // Events
    event messageEvent(address sender, string msg);
    event SetPurpose(address sender, string purpose);
    event newInfoAddedEvent(
        address sender,
        string title,
        address creator,
        uint16 id,
        // address owner;
        // address contractAddress;
        string detail,
        uint256[9] infoHash
    );

    event newItemEvent();

    constructor() public {
        // uint id = getRandom();
        // what should we do on deploy?
    }

    function setPurpose(string memory newPurpose) public {
        //  console.log(randomId());
        // console.logBytes16(randomId());
        purpose = newPurpose;
        emit SetPurpose(msg.sender, purpose);
    }

    // *** Getter Methods ***
    function getInfoByIndex(uint256 i)
        public
        view
        returns (
            address creator,
            uint16 id,
            // address owner;
            // address contractAddress;
            string memory detail,
            uint256[9] memory infoHash
        )
    {
        uint16 infoId = infosId[i];
        return (
            infos[infoId].creator,
            infos[infoId].id,
            infos[infoId].detail,
            infos[infoId].infoHash
        );
    }

    function getItemByIndex(uint256 i)
        public
        view
        returns (
            address buyer,
            address seller,
            uint256 price,
            uint16 infoId,
            uint16 id,
            uint256 deposit,
            uint256 sellerDeposit,
            uint256 buyerDeposit,
            bool sellerConfirmation,
            bool buyerConfirmation,
            uint256 endTime
        )
    {
        uint16 itemId = itemsId[i];
        return (
            items[itemId].buyer,
            items[itemId].seller,
            items[itemId].price,
            items[itemId].infoId,
            items[itemId].id,
            items[itemId].deposit,
            items[itemId].sellerDeposit,
            items[itemId].buyerDeposit,
            items[itemId].sellerConfirmation,
            items[itemId].buyerConfirmation,
            items[itemId].endTime
        );
    }

    // *** Setter Methods ***

    function newInfo(string memory detail, uint256[8] memory hash)
        public
        returns (
            uint16 //TODO new modifier
        )
    {
        // Info storage  i = infos[infoId];
        uint16 infoId = randomId();
        // console.logBytes16(infoId);
        Info storage i = infos[infoId];
        i.detail = detail;
        i.id = infoId;
        i.creator = msg.sender;
        i.infoHash = hash;
        i.infoHash[8] = 1;
        infosId.push(infoId);
        // emit newInfoAddedEvent(msg.sender,"new Info added",i.creator,infoId,detail, i.infoHash);
        emit messageEvent(msg.sender, "New info added ");
        infoSize = infoSize + 1;
        return infoId;
    }

    function newItem(
        uint256 price,
        uint16 infoId,
        uint256 deposit,
        uint256 endTime // Seller must call this function
    )
        public
        returns (
            uint16 //TODO new modifier
        )
    {
        // Info storage  i = infos[infoId];
        uint16 itemId = randomId();
        // console.logBytes16(infoId);
        Item storage i = items[itemId];
        //i.detail=detail;
        i.id = itemId;
        // i.seller = msg.sender;
        i.price = price;
        i.infoId = infoId;
        i.deposit = deposit;
        i.endTime = now + endTime * 1 days;

        itemsId.push(itemId);
        itemSize = itemSize + 1;
        emit messageEvent(msg.sender, "New item added ");

        return itemId;
    }

    function buyerDeposit(uint16 itemId) public payable {
        require(items[itemId].buyer == address(0x0), "Another buyer accepted");
        items[itemId].buyer = msg.sender;
        require(
            items[itemId].deposit == msg.value,
            " Value is not equal with deposit"
        );
        items[itemId].buyerDeposit = msg.value;
        emit messageEvent(msg.sender, "Buyer deposited");
    }

    function sellerDeposit(uint16 itemId) public payable {
        require(items[itemId].seller == address(0), "Another seller accepted");

        require(
            items[itemId].deposit == msg.value,
            " Value is not equal with deposit"
        );

        items[itemId].seller = msg.sender;
        items[itemId].sellerDeposit = msg.value;
        emit messageEvent(msg.sender, "Seller deposited ");
    }

    function sellerConfirmation(uint16 itemId) public {
        require(items[itemId].seller == msg.sender, "Another seller accepted");

        require(
            items[itemId].deposit == items[itemId].sellerDeposit,
            " Value is not equal with deposit"
        );
        require(
            items[itemId].deposit == items[itemId].buyerDeposit,
            " Value is not equal with deposit"
        );
        items[itemId].sellerConfirmation = true;
        emit messageEvent(msg.sender, "Seller confirmation ");
    }

    function buyerConfirmation(
        uint16 itemId,
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c
    )
        public
        returns (
            // ,
            bool
        )
    {
        require(items[itemId].buyer == msg.sender, "Another buyer accepted");

        require(
            items[itemId].deposit == items[itemId].sellerDeposit,
            " Value is not equal with deposit(seller)"
        );
        require(
            items[itemId].deposit == items[itemId].buyerDeposit,
            " Value is not equal with deposit(buyer)"
        );
        // a = a;
        // ZK Snark Verification is here

        require(verifyTx(a, b, c, infos[items[itemId].infoId].infoHash));
        items[itemId].buyerConfirmation = true;
        emit messageEvent(msg.sender, "Buyer confirmation ");
        return true;
    }

    function donePhase(uint16 itemId) public {
        // require(items[itemId].endTime < now);
        if (
            items[itemId].sellerConfirmation && items[itemId].buyerConfirmation
        ) {
            items[itemId].buyer.transfer(items[itemId].deposit);
            items[itemId].seller.transfer(items[itemId].deposit);
        }
        emit messageEvent(msg.sender, "Done phases");
    }

    // *** Utility Functions ***
    function randomId() public returns (uint16) {
        // bytes16 rand = bytes16(
        //     keccak256(abi.encodePacked(msg.sender, incrementIdMaterial()))
        //     // abi.encodePacked(msg.sender, now, (block.number - 1))
        // );

        return incrementIdMaterial();
    }

    // * Increment and Get Id
    function incrementIdMaterial() internal returns (uint16) {
        idMaterial = idMaterial + 1;
        return idMaterial;
    }
}
