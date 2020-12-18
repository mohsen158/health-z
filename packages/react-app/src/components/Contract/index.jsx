import React, { useMemo, useState } from "react";
import { Card, Typography, Row, Col, List, Empty, Input, Button, Divider, Modal } from "antd";
import axios from "axios";
import { useContractLoader, useContractExistsAtAddress, useEventListener, useContractReader } from "../../hooks";
import Account from "../Account";
import DisplayVariable from "./DisplayVariable";
import FunctionForm from "./FunctionForm";
import { Address } from "../index";
// import { getHashValue} from "../../zkFiles/hash";
// import { getHashValue} from "";
//  import { initialize } from 'zokrates-js';
//const { initialize } = require('zokrates-js/node');

const { Title, Paragraph, Text, Link } = Typography;
let renderCount = 0;
const noContractDisplay = (
  <div>
    Loading...{" "}
    <div style={{ padding: 32 }}>
      You need to run{" "}
      <span style={{ marginLeft: 4, backgroundColor: "#f1f1f1", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
        yarn run chain
      </span>{" "}
      and{" "}
      <span style={{ marginLeft: 4, backgroundColor: "#f1f1f1", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
        yarn run deploy
      </span>{" "}
      to see your contract here.
    </div>
    <div style={{ padding: 32 }}>
      <span style={{ marginRight: 4 }} role="img" aria-label="warning">
        ☢️
      </span>
      Warning: You might need to run
      <span style={{ marginLeft: 4, backgroundColor: "#f1f1f1", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
        yarn run deploy
      </span>{" "}
      <i>again</i> after the frontend comes up!
    </div>
  </div>
);

const isQueryable = fn => (fn.stateMutability === "view" || fn.stateMutability === "pure") && fn.inputs.length === 0;

export default function Contract({
  account,
  gasPrice,
  signer,
  provider,
  name,
  show,
  price,
  mainnetProvider,
  blockExplorer,
  readContracts,
}) {
  const contracts = useContractLoader(provider);
  const contract = contracts ? contracts[name] : "";
  const address = contract ? contract.address : "";
  const contractIsDeployed = useContractExistsAtAddress(provider, address);
  const purpose = useContractReader(readContracts, "HealthZ", "purpose");
  console.log("🤗 purpose:", purpose);

  //📟 Listen for broadcast events
  const setPurposeEvents = useEventListener(readContracts, "HealthZ", "SetPurpose", provider, 1);
  console.log("📟 SetPurpose events:", setPurposeEvents);
  const displayedContractFunctions = useMemo(
    () =>
      contract
        ? Object.values(contract.interface.functions).filter(
            fn => fn.type === "function" && !(show && show.indexOf(fn.name) < 0),
          )
        : [],
    [contract, show],
  );

  const styles = {
    rootContainer: {
      backgroundColor: "#1A1A1D",
      height: "100%",
    },
    content: {
      height: "65%",
      padding: "1%",
    },
    header: {
      height: "30%",
      backgroundColor: "transparent",
      marginTop: "5%",
    },
    card: {
      maxHeight: "100%",
      padding: "0 24px",
    },
    cardBody: {
      maxHeight: 500,
      overflow: "auto",
    },
  };

  const [refreshRequired, triggerRefresh] = useState(false);
  const [preImageCreateHashText, setPreImageCreateHashText] = useState();
  const [claimedPreImageText, setClaimedPreImageText] = useState();
  const [hash, setHash] = useState();
  // const [top, setTop] = useState(10);
  const contractDisplay = displayedContractFunctions.map(fn => {
    if (isQueryable(fn)) {
      // If there are no inputs, just display return value
      return (
        <DisplayVariable
          key={fn.name}
          contractFunction={contract[fn.name]}
          functionInfo={fn}
          refreshRequired={refreshRequired}
          triggerRefresh={triggerRefresh}
        />
      );
    }
    // If there are inputs, display a form to allow users to provide these
    return (
      <FunctionForm
        key={"FF" + fn.name}
        contractFunction={contract.connect(signer)[fn.name]}
        functionInfo={fn}
        provider={provider}
        gasPrice={gasPrice}
        triggerRefresh={triggerRefresh}
      />
    );
  });

  return (
    <div className="site-card-border-less-wrapper">
      <Row>
        <Col span={6} style={{ padding: "0 24px" }}>
          <Card
            style={styles.card}
            bodyStyle={styles.cardBody}
            title="ZK tools : Create hash from preImage string"
            size="large"
            style={{ marginTop: 25, width: "100%" }}
            loading={contractDisplay && contractDisplay.length <= 0}
          >
            <Row>
              <Title level={5}> PreImage: </Title>
            </Row>
            <Row>
              <Col span={18}>
                <Input
                  placeholder="Basic usage"
                  value={preImageCreateHashText}
                  onChange={e => setPreImageCreateHashText(e.target.value)}
                />
              </Col>
              <Col span={6}>
                <Button
                  onClick={async () => {
                    var def = [
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
                    ];
                    axios
                      .post(`http://localhost:3030/getHash`, {
                        preImageCreateHashText: def,
                      })
                      .then(res => {
                        var message = "Hash is : ";
                        info(message, res.data);
                        console.log("res", res);
                        console.log("res data:", res.data);
                      });
                  }}
                  type="primary"
                >
                  Run
                </Button>
              </Col>
            </Row>
            {/* <Row>
              <Divider></Divider>{" "}
            </Row> */}
          </Card>{" "}
          <Card
            style={styles.card}
            bodyStyle={styles.cardBody}
            title="ZK tools: create proof from preImage and hash"
            size="large"
            style={{ marginTop: 25, width: "100%" }}
            loading={contractDisplay && contractDisplay.length <= 0}
          >
            <Row>
              <Title level={5}> PreImage and Hash: </Title>
            </Row>
            <Row>
              <Col span={18}>
                <Input
                  placeholder="Claimed PreImage"
                  value={claimedPreImageText}
                  onChange={e => setClaimedPreImageText(e.target.value)}
                />
              </Col>
            </Row>
            <Row style={{ marginTop: 10 }}>
              <Col span={18}>
                <Input placeholder=" Hash" value={hash} onChange={e => setHash(e.target.value)} />
              </Col>
              <Col span={6}>
                <Button
                  onClick={async () => {
                    var def = [
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
                        "0x00000015"
                      ]
                    ];
                    axios
                      .post(`http://localhost:3030/getProof`, {
                        claimedPreImageText,
                        hash:JSON.parse(hash) 
                      })
                      .then(res => {
                        var message = "Proof is : ";
                        info(message, res.data);
                        console.log("res", res);
                        console.log("res data:", res.data);
                      });
                  }}
                  type="primary"
                >
                  Run
                </Button>
              </Col>
            </Row>
            {/* <Row>
              <Divider></Divider>{" "}
            </Row> */}
          </Card>
        </Col>
        <Col span={12}>
          <Card
            style={styles.card}
            bodyStyle={styles.cardBody}
            title={
              <div>
                {name}
                <div style={{ float: "left" }}>
                  <Account
                    address={address}
                    localProvider={provider}
                    injectedProvider={provider}
                    mainnetProvider={provider}
                    price={price}
                    blockExplorer={blockExplorer}
                  />
                  {account}
                </div>
              </div>
            }
            size="large"
            style={{ marginTop: 25, width: "100%" }}
            loading={contractDisplay && contractDisplay.length <= 0}
          >
            {contractIsDeployed ? contractDisplay : noContractDisplay}
          </Card>
        </Col>

        <Col span={6} style={{ marginTop: 25, padding: "0 24px" }}>
          <Card title="Events">
            {" "}
            {setPurposeEvents ? (
              <List
                bordered
                dataSource={setPurposeEvents}
                renderItem={item => {
                  return (
                    <List.Item key={item.blockNumber + "_" + item.sender + "_" + item.purpose}>
                      <Address value={item[0]} ensProvider={mainnetProvider} fontSize={16} /> =>
                      {item[1]}
                    </List.Item>
                  );
                }}
              />
            ) : (
              <Empty />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
// Modal
function info(message, value) {
  Modal.info({
    title: message,
    content: (
      <div>
        <p>{value}</p>
      </div>
    ),
    onOk() {
      var dummy = document.createElement("textarea");
      // to avoid breaking orgain page when copying more words
      // cant copy when adding below this code
      // dummy.style.display = 'none'
      document.body.appendChild(dummy);
      //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
      dummy.value = value;
      dummy.select();
      document.execCommand("copy");
    },
  });
}
function success() {
  Modal.success({
    content: "some messages...some messages...",
  });
}

function error() {
  Modal.error({
    title: "This is an error message",
    content: "some messages...some messages...",
  });
}

function warning() {
  Modal.warning({
    title: "This is a warning message",
    content: "some messages...some messages...",
  });
}
