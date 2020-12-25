import React, { useMemo, useState } from "react";
import { Card, Spin, Typography, Row, message, Col, List, Empty, Input, Button, Divider, Modal } from "antd";
import axios from "axios";
import { useContractLoader, useContractExistsAtAddress, useEventListener, useContractReader } from "../../hooks";
import Account from "../Account";
import DisplayVariable from "./DisplayVariable";
import BigNumber from "bignumber.js";

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
  const newInfoAddedEvent = useEventListener(readContracts, "HealthZ", "newInfoAddedEvent", provider, 1);
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
  const [loadingHash, setLoadingHash] = useState(false);
  const [loadingProof, setLoadingProof] = useState(false);

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
          <Spin spinning={loadingHash} tip="Loading...">
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
                    placeholder="Hash me (u32[16])"
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
                      setLoadingHash(true);
                      axios
                        .post(`http://localhost:3030/getHash`, {
                          preImageCreateHashText,
                        })
                        .then(res => {
                          setLoadingHash(false);
                          message.success("Hash created");
                          var msg = "Hash is : ";
                          info(msg, JSON.parse(res.data));
                          console.log("res", res);
                          console.log("res data:", res.data);
                        })
                        .catch(function (error) {
                          setLoadingHash(false);

                          if (error.response) {
                            // The request was made and the server responded with a status code
                            // that falls out of the range of 2xx
                            console.log("err1", error.response.data);
                            console.log("err2", error.response.status);
                            console.log("err3", error.response.headers);
                            message.error("Type is not correct");
                          } else if (error.request) {
                            // The request was made but no response was received
                            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                            // http.ClientRequest in node.js
                            console.log("err4", error.request);
                            message.error("Hash server not connected");
                          } else {
                            // Something happened in setting up the request that triggered an Error
                            console.log("Error", error.message);
                          }
                          console.log("err5", error.config);
                        });
                    }}
                    type="primary"
                  >
                    Run
                  </Button>
                </Col>
              </Row>
              <Row style={{ marginTop: 10 }}>
                <Button
                  type="dashed"
                  onClick={async () => {
                    setPreImageCreateHashText(
                      JSON.stringify([
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
                      ]),
                    );
                  }}
                >
                  {" "}
                  Set Sample Data{" "}
                </Button>
              </Row>
              {/* <Row>
              <Divider></Divider>{" "}
            </Row> */}
            </Card>
          </Spin>
          <Spin spinning={loadingProof} tip="Loading...">
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
                    placeholder="Claimed PreImage ( u32[16])"
                    value={claimedPreImageText}
                    onChange={e => setClaimedPreImageText(e.target.value)}
                  />
                </Col>
              </Row>
              <Row style={{ marginTop: 10 }}>
                <Col span={18}>
                  <Input placeholder=" Hash (u32[8])" value={hash} onChange={e => setHash(e.target.value)} />
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
                      setLoadingProof(true);
                      message.info("Generating proof has started");
                      axios
                        .post(`http://localhost:3030/getProof`, {
                          claimedPreImageText,
                          hash,
                        })
                        .then(res => {
                          message.success("Proof created");
                          setLoadingProof(false);

                          var msg = "Proof is : ";
                          info(msg, JSON.stringify(res.data));
                          console.log("res", res);
                          console.log("res data:", res.data);
                        })
                        .catch(function (error) {
                          setLoadingProof(false);

                          if (error.response) {
                            // The request was made and the server responded with a status code
                            // that falls out of the range of 2xx
                            console.log("err1", error.response.data);
                            console.log("err2", error.response.status);
                            console.log("err3", error.response.headers);
                            message.error("Type is not correct");
                          } else if (error.request) {
                            // The request was made but no response was received
                            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                            // http.ClientRequest in node.js
                            console.log("err4", error.request);
                            message.error("Proof server not connected");
                          } else {
                            // Something happened in setting up the request that triggered an Error
                            console.log("Error", error.message);
                          }
                          console.log("err5", error.config);
                        });
                    }}
                    type="primary"
                  >
                    Run
                  </Button>
                </Col>
              </Row>
              <Row style={{ marginTop: 10 }}>
                <Button
                  type="dashed"
                  onClick={async () => {
                    setHash(
                      JSON.stringify([
                        [
                          "0x9ba99edb",
                          "0xaf002e05",
                          "0xf7660405",
                          "0x5a8a0c72",
                          "0x2352d8e2",
                          "0x857af4cf",
                          "0xdb178144",
                          "0xc49d722e",
                        ],
                      ]),
                    );
                    setClaimedPreImageText(
                      JSON.stringify([
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
                      ]),
                    );
                  }}
                >
                  {" "}
                  Set Sample Data{" "}
                </Button>
              </Row>
              {/* <Row>
              <Divider></Divider>{" "}
            </Row> */}
            </Card>
          </Spin>
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
            {  setPurposeEvents  || newInfoAddedEvent   ? (
              <List
              bordered
              dataSource={[...setPurposeEvents,...newInfoAddedEvent]}
              renderItem={item => {
                return (
                  <List.Item key={item.blockNumber + "_" + item.sender + "_" + item.purpose}>
                    <Address value={item[0]} ensProvider={mainnetProvider} fontSize={16} /> =>
                    {item[5][1]._hex }
                      {console.log("items:",item[5][1]._hex)}
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
  function info(message, value) {
    Modal.info({
      title: message,
      content: (
        <div>
          <p>{value}</p>
        </div>
      ),
      onOk() {
        if (message == "Hash is : ") {
          setHash(value);
        }
        var dummy = document.createElement("textarea");
        // to avoid breaking orgain page when copying more words
        // cant copy when adding below this code
        // dummy.style.display = 'none'
        document.body.appendChild(dummy);
        //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
        dummy.value = value;
        dummy.select();
        document.execCommand("copy");
        dummy.style.display = "none";
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
}
// Modal
