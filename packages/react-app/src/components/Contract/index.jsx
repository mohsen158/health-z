import React, { useMemo, useState } from "react";
import { Card, Typography, Row, Col, List, Empty, Input, Button,Divider } from "antd";

import { useContractLoader, useContractExistsAtAddress, useEventListener, useContractReader } from "../../hooks";
import Account from "../Account";
import DisplayVariable from "./DisplayVariable";
import FunctionForm from "./FunctionForm";
import { Address } from "../index";
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
            title="ZK tools"
            size="large"
            style={{ marginTop: 25, width: "100%" }}
            loading={contractDisplay && contractDisplay.length <= 0}
          >
            <Row>
              <Title level={4}> Create Hash </Title>
            </Row>
            <Row>
              <Col span={18}>
                <Input placeholder="Basic usage" />
              </Col>
              <Col span={6}>
                <Button type="primary">Primary</Button>
              </Col>
            </Row>
            <Row><Divider></Divider> </Row>
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
