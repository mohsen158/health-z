/* eslint-disable jsx-a11y/accessible-emoji */
import { Card, List, Typography, Divider, Col, Row, Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { Transactor } from "../helpers";
import React, { useMemo, useState } from "react";
import { formatEther } from "@ethersproject/units";
import { Address, AddressInput } from "../components";
import {
  useContractLoader,
  useContractExistsAtAddress,
  useEventListener,
  useGasPrice,
  useContractReader,
} from "../hooks";
const { Paragraph } = Typography;
export default function Hints({
  name,

  signer,
  provider,
  yourLocalBalance,
  blockExplorer,
  mainnetProvider,
  show,
  readContracts,
  price,
}) {
  const gasPrice = useGasPrice("fast");
  const tx = Transactor(provider, gasPrice);

  const contracts = useContractLoader(provider);
  const contract = contracts ? contracts[name] : "";
  const address = contract ? contract.address : "";
  const contractIsDeployed = useContractExistsAtAddress(provider, address);
  const purpose = useContractReader(readContracts, "HealthZ", "purpose");
  // const address = contract ? contract.address : "";
  const { Meta } = Card;
  console.log("🤗 purpose:", purpose);
  //📟 Listen for broadcast events
  const setPurposeEvents = useEventListener(readContracts, "HealthZ", "SetPurpose", provider, 1);
  const newInfoAddedEvent = useEventListener(readContracts, "HealthZ", "newInfoAddedEvent", provider, 1);
  console.log("📟 SetPurpose events:", setPurposeEvents);
  const [infoes, setInfoes] = useState([]);
  const [items, setItems] = useState([]);
  const displayedContractFunctions = useMemo(
    () =>
      contract
        ? Object.values(contract.interface.functions).filter(
            fn => fn.type === "function" && !(show && show.indexOf(fn.name) < 0),
          )
        : [],
    [contract, show],
  );
  return (
    <div className="site-card-wrapper">
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Infoes list" bordered={false}>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={async () => {
                try {
                  const infoSize = await contract["infoSize"]();
                  let getInfoByIndex = displayedContractFunctions.find(fn => fn.name === "getInfoByIndex");
                  setInfoes([]);

                  for (let i = 0; i < infoSize; i++) {
                    let info =[]
                    info = await tx(contract.connect(signer)[getInfoByIndex.name](i));
                    // console.log("this is info :", info);
                    setInfoes(old => [...old, info]);
                  }
                } catch (err) {
                  console.log(err);
                }
              }}
              size={"large"}
            >
              {console.log(displayedContractFunctions)}
              Get Infoes
            </Button>
            <List
              bordered
             
              dataSource={infoes}
              renderItem={item => (
                <List.Item key={item.id}>
                  <Card hoverable  style={{ width: '100%' }}>
                  <Paragraph  >
                      
                
                    <Meta title="id" description={item["id"]} />
                    <Meta title="creator" description={item["creator"]} />

                    </Paragraph>
                    <Meta title= {item["infoHash"][0]._hex} description="www.instagram.com" />
                  </Card>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col span={12}>
        <Card title="Item  list" bordered={false}>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={async () => {
                try {
                  // let testTr = displayedContractFunctions.find(fn => fn.name === "newInfo");
                  // const hashh = [
                    //   "0x6c00000000000000000000000000000000000000000000000000000000000000",
                  //   "0x6c00000000000000000000000000000000000000000000000000000000000000",
                  //   "0x6c00000000000000000000000000000000000000000000000000000000000000",
                  //   "0x6c00000000000000000000000000000000000000000000000000000000000000",
                  //   "0x6c00000000000000000000000000000000000000000000000000000000000000",
                  //   "0x6c00000000000000000000000000000000000000000000000000000000000000",
                  //   "0x6c00000000000000000000000000000000000000000000000000000000000000",
                  //   "0x6c00000000000000000000000000000000000000000000000000000000000000"
                  // ];
                  // const itemsId = await tx(contract.connect(signer)[testTr.name]("det",hashh));
                  
                  
                  
                  const itemSize = await contract["itemSize"]();
                  let getItemByIndex = displayedContractFunctions.find(fn => fn.name === "getItemByIndex");
                  setItems([])
                  for (let i = 0; i < itemSize; i++) {
                    const item = await tx(contract.connect(signer)[getItemByIndex.name](i));
                    console.log(item)
                    setItems(old => [...old, item]);
 
                  }
                } catch (err) {
                  console.log(err);
                }
              }}
              size={"large"}
            >
               Get Items
            </Button>
            <List
              bordered
              dataSource={items}
              renderItem={item => (
                <List.Item>
                  <Card hoverable  style={{ width: '100%' }}>
                  <Paragraph ellipsis={{ rows: 1, expandable: true, symbol: 'more' }}>
                    {/* <Typography.Text mark>[ITEM]</Typography.Text> {item} */}
                    
                  console.log(item)

                    </Paragraph>
                    <Meta title= "id" description= {item["id"]} />
                    <Meta title= "seller" description= {item["seller"]} />
                    <Meta title= "buyer" description= {item["buyer"]} />
                    <Meta title= "price" description= {item["price"]._hex} />
                    <Meta title= "sellerConfirmation" description= {item["sellerConfirmation"]? "True":"False"} />
                  </Card>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
