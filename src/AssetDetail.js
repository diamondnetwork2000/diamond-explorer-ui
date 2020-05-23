//fix IE issue https://reactjs.org/docs/javascript-environment-requirements.html
import 'core-js/es/map';
import 'core-js/es/set';
import React,{useState} from 'react';
import { Form, Table, Tabs, Input, Typography, List, Row, Col } from 'antd';
import {
  useParams,
  Link
} from "react-router-dom";
import dateFormat from 'dateformat';
import mockAssetDetail from "./mock/asset-detail.js"
import request from 'umi-request';
import serverUrl from './config.js';
import {wrap, formatQuantity,formatTime, formatFee,formatToken,txType2String} from './util.js';
import { useTranslation, withTranslation, Trans } from 'react-i18next'
function callback(key) {
  console.log(key);
}

function rowStyle(record, index) {
  return "row-style";
}
const { Paragraph } = Typography;
const { TabPane } = Tabs;

const columns = (props) => {
  const { setModal1Visible } = props;
  return [
    {
      title: 'Height',
      width: 100,
      dataIndex: 'name',
      key: 'name',
      render: text => (<span>{text}</span>),
    },
    {
      title: 'Created At',
      dataIndex: 'value',
      key: 'value',

      render: (text,record) => {
        if (record.element == undefined) {
          return <span onClick={() => setModal1Visible(true)}>{text}</span>;
        } else {
          return record.element;
        }
         
      }
    },

  ]
};

const accountColumns = (props) => {

    const { setModal1Visible,t } = props;
    return [
      {
        title: t('account.name'),
       
        dataIndex: 'accountRs',
        key: 'accountRs',
        render: text => (<Link to={`/accounts/${text}`}>{text}</Link>),
      },
     
     
      {
        title: t('asset.quantity'),
        dataIndex: 'quantity',
        key: 'quantity',
  
        render: text => <span >{formatToken(text)}</span>,
      },
      {
        title: t('account.frozen'),
        dataIndex: 'frozenQuantity',
        key: 'frozenQuantity',
  
        render: text => <span >{formatToken(text)}</span>,
      },
      {
        title: t('account.share'),
        dataIndex: 'share',
        key: 'share',
  
        render: text => <span onClick={() => setModal1Visible(true)}>{text}</span>,
      },
  
    ]
  };

function accountLink(account) {
  return  <Link to={`/accounts/${account}`}>{account}</Link>;
}
const txColumns = (props) => {
  const { setModal1Visible,t } = props;
  return [
    {
      title: 'ID',
      width: 100,
      dataIndex: 'id',
      key: 'id',
      render: text => (<span>{text}</span>),
    },
   
    {
      title: t('dashboard.sender'),
      dataIndex: 'sender',
      key: 'sender',

      render: text => <Link to={`/accounts/${text}`}>{text}</Link>,
    },
    {
      title: t('dashboard.recipient'),
      dataIndex: 'recipient',
      key: 'recipient',

      render: text => <Link to={`/accounts/${text}`}>{text}</Link>,
    },
    {
      title: t('asset.quantity'),
      dataIndex: 'amount',
      key: 'amount',

      render: text => <span >{formatToken(text)}</span>,
    },
    
    {
      title: t('dashboard.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',

      render: text => <span onClick={() => setModal1Visible(true)}>{(text)}</span>,
    },

  ]
};
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8 },
};
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 },
};


function AssetDetail() {
  let { assetId } = useParams();
  let {t} = useTranslation();

  const [data, setData] = useState([]);
  const [tx, setTx] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [totalTx, setTotalTx] = useState();
  const [totalAccount, setTotalAccount] = useState();

  function assetPageChange(assetId) {
    const change =  (page) => {
        
      request.get(serverUrl +'/assets/transfers',{params : {assetId: assetId,pageNo:page.current,pageSize:20}})
      .then(function (response) {
        console.log(response);
      //  that.setState({ 'blockList': response.content });
        var data = response.content;
        setTotalTx(response.total);
  
        setTx(data)
  
      })
      .catch(function (error) {
        console.log(error);
      });
    }

    return change;
};

function accountPageChange(assetId) {
  const change =  (page) => {
      
    request.get(serverUrl + '/assets/accounts',{params : {assetId: assetId,pageNo:page.current,pageSize:50}})
    .then(function (response) {
      console.log(response);
    //  that.setState({ 'blockList': response.content });
      var data = response.content;
     
      setTotalAccount(response.total);
      setAccounts(data)

    })
    .catch(function (error) {
      console.log(error);
    });
  }

  return change;
};
  React.useEffect(() => {
    console.log("block detail mounted: ", assetId);

    request.get(serverUrl + '/assets/detail',{params : {name: assetId}})
    .then(function (response) {
      console.log(response);
    //  that.setState({ 'blockList': response.content });
      var mockAssetDetail = response.content;
      let data = [];
  data.push({ 'name': 'ID', value: mockAssetDetail.id });
  data.push({ 'name': t('asset.name'), value: mockAssetDetail.name });
  data.push({ 'name': t('asset.description'), value: mockAssetDetail.description });
  data.push({ 'name': t('asset.height'), value: mockAssetDetail.creationHeight });
  data.push({ 'name': t('dashboard.createdAt'), value: (mockAssetDetail.createdAt) });
  data.push({ 'name': t('asset.issuer'), value: mockAssetDetail.issuer, element:accountLink(mockAssetDetail.issuer) });
  data.push({ 'name': t('asset.total'), value: mockAssetDetail.totalSupply  });
  data.push({ 'name': t('dashboard.txCounts'), value: mockAssetDetail.transferNum });
  data.push({ 'name': t('asset.holderNum'), value: mockAssetDetail.holderNum });

      setData(data)

    })
    .catch(function (error) {
      console.log(error);
    });

    request.get(serverUrl +'/assets/transfers',{params : {assetName: assetId,pageNo:1,pageSize:50}})
    .then(function (response) {
      console.log(response);
    //  that.setState({ 'blockList': response.content });
      var data = response.content;
     
      setTotalTx(response.total);
      setTx(data)

    })
    .catch(function (error) {
      console.log(error);
    });

    request.get(serverUrl + '/assets/accounts',{params : {assetName: assetId,pageNo:1,pageSize:50}})
    .then(function (response) {
      console.log(response);
    //  that.setState({ 'blockList': response.content });
      var data = response.content;
     
      setTotalAccount(response.total);
      setAccounts(data)

    })
    .catch(function (error) {
      console.log(error);
    });


  }, []);


  return (
    <div style={{ 'padding': '10px' }}>




      <Tabs defaultActiveKey="1" onChange={callback}>
        <TabPane tab={t('asset.info')} key="1">
          <Table showHeader={false} columns={columns({
                t:t
          })} dataSource={data} pagination={false} rowClassName={rowStyle}/>

        </TabPane>
        <TabPane tab={t('asset.tx')} key="2">
          <Table columns={txColumns({
              t:t
          })} dataSource={tx} pagination={{pageSize:50,total:totalTx}} onChange={assetPageChange(assetId)}/>

        </TabPane>

       {/*注释
        <TabPane tab={t('asset.account')} key="3">
          <Table columns={accountColumns({
             t:t
          })} dataSource={accounts} pagination={{pageSize:50,total:totalAccount}} onChange={accountPageChange}/>

        </TabPane>
        */}

      </Tabs>



    </div>
  );

}

export default AssetDetail;