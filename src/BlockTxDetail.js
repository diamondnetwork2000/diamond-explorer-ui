//Fix IE issue https://reactjs.org/docs/javascript-environment-requirements.html
import 'core-js/es/map';
import 'core-js/es/set';
import React,{useState} from 'react';
import { Form, Table, Tabs, Input, Typography, List, Row, Col } from 'antd';
import {
  useParams,
  Link
} from "react-router-dom";
import dateFormat from 'dateformat';
import serverUrl from './config.js';
import request from 'umi-request';
import {wrap, formatQuantity,multiline, formatFee,formatToken,txType2String,formatPrice} from './util.js';
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import { tsExportAssignment } from '@babel/types';
const { Paragraph,Title } = Typography;
const { TabPane } = Tabs;
function callback(key) {
  console.log(key);
}
function accountLink(account) {
  return  <Link to={`/accounts/${account}`}>{account}</Link>;
}
function blockLink(account) {
  return  <Link to={`/blocks/height/${account}`}>{account}</Link>;
}

function textArea(account) {
  return  <Paragraph>{account}</Paragraph>;
}

function formatSide(t,side) {
  return  side === 1 ? t("transaction.bid") : t("transaction.ask");
}



function rowStyle(record, index) {
  return "row-style";
}
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
          return <span >{text}</span>;
        } else {
          return record.element;
        }
         
      }
    },

  ]
};
const txColumns = (props) => {
  const { setModal1Visible,t } = props;
  return [
    {
      title:  t('dashboard.type'),
      dataIndex: 'type',
      key: 'type',

      render: (text,record) => <span >{t(txType2String(text,record.subType))}</span>,
    },
    {
      title:  t('dashboard.sender'),
      dataIndex: 'sender',
      key: 'sender',

      render: text => <Link to={`/accounts/${text}`}>{text}</Link>,
    },
   
    {
      title:  t('block.fee'),
      dataIndex: 'fee',
      key: 'fee',

      render: text => <span >{formatFee(text)}</span>,
    },
    {
      title:  t('dashboard.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',

      render: text => <span>{(text)}</span>,
    },

  ]
};
const transferColumns  = (props) => {
  const { setModal1Visible,t } = props;
  return [
    {
      title: t("asset.name"),
     
      dataIndex: 'token',
      key: 'token',
      render: text => (<span>{text}</span>),
    },

    {
      title: t("dashboard.recipient"),
     
      dataIndex: 'recipient',
      key: 'recipient',
      render: text => <Link to={`/accounts/${text}`}>{text}</Link>,
    },
   
    {
      title: t("asset.quantity"),
      dataIndex: 'amount',
      key: 'amount',

      render: text => <span >{formatToken(text)}</span>,
    }
  
  ]
}
const issueColumns  = (props) => {
  const { setModal1Visible,t } = props;
  return [
    {
      title: t("asset.name"),
     
      dataIndex: 'name',
      key: 'name',
      render: text => (<span>{text}</span>),
    },
    {
      title: t("asset.description"),
     
      dataIndex: 'description',
      key: 'description',
      render: text => (<span>{text}</span>),
    },
    {
      title: t("asset.quantity"),
      dataIndex: 'quantityQNT',
      key: 'quantityQNT',

      render: text => <span >{formatToken(text)}</span>,
    }
  
  ]
}

const batchColumns  = (props) => {
  const { setModal1Visible,t } = props;
  return [
    {
      title: t("dashboard.recipient"),
      width: 160,
      dataIndex: 'recipientRS',
      key: 'recipientRS',
      render: text => <Link to={`/accounts/${text}`}>{text}</Link>,
    },
   
    {
      title: t("asset.quantity"),
      dataIndex: 'amountNQT',
      key: 'amountNQT',

      render: text => <span >{formatFee(text)}</span>,
    }
  
  ]
}


const orderColumns = (props) => {
  const { setModal1Visible,t } = props;
  return [
    {
      title:  t("transaction.market"),
     
      dataIndex: 'tradingPair',
      key: 'tradingPair',
      render: text => (<span>{text}</span>),
    },
    {
      title: t("transaction.price"),
    
      dataIndex: 'price',
      key: 'price',
      render: text => (<span>{formatPrice(text)}</span>),
    },
    {
      title: t("dashboard.quantity"),
     
      dataIndex: 'quantity',
      key: 'quantity',
      render: text => (<span>{text}</span>),
    },
    {
      title: 'Side',
      dataIndex: 'side',
      key: 'side',

      render: text => <span >{formatSide(t,text)}</span>,
    },
   

  ]
};

const messageColumns = (props) => {
  const { setModal1Visible,t } = props;
  return [
   
    {
      title: t("transaction.content"),
    
      dataIndex: 'jsonContent',
      key: 'jsonContent',
      render: text => (<span>{text}</span>),
    }
  
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


function BlockTxDetail() {
  let { txHash } = useParams();
  let {t} = useTranslation();
  const [data, setData] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [tx, setTx] = useState([]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);

  React.useEffect(() => {
    console.log("block detail mounted: ", txHash);

   
    
    request.get(serverUrl + '/tx/detail',{params : {txHash: txHash}})
    .then(function (response) {
      console.log(response);
    //  that.setState({ 'blockList': response.content });
      var mockBlockDetail = response.content;
      if (mockBlockDetail.attachment != null) {
        mockBlockDetail.orderAssetName = mockBlockDetail.attachment.assetName;
        mockBlockDetail.orderQuoteAssetName = mockBlockDetail.attachment.quoteAssetName;
        mockBlockDetail.orderQuantity = mockBlockDetail.attachment.quantityQNT;
        mockBlockDetail.orderPrice = mockBlockDetail.attachment.priceNQT;
      }
      var tx = [];
      tx.push(mockBlockDetail);
      setTx(tx)
      setOrders(mockBlockDetail.orders);
      setTransfers(mockBlockDetail.transfers);
      setMessages(mockBlockDetail.messages);

      var data = [];

      data.push({ 'name': t('dashboard.height'), value: mockBlockDetail.block.height,element: blockLink(mockBlockDetail.block.height) });
      data.push({ 'name': t('dashboard.txCounts'), value: mockBlockDetail.block.txNum });
      data.push({ 'name': t('dashboard.createdAt'), value: (mockBlockDetail.block.createdAt) });
      data.push({ 'name': t('dashboard.sent'), value: formatFee(mockBlockDetail.block.sent) });
      data.push({ 'name': t('dashboard.reward'), value: formatFee(mockBlockDetail.block.reward) });
      data.push({ 'name': t('block.sign'), value: mockBlockDetail.block.signature });
      data.push({ 'name': t('block.generator'), value: mockBlockDetail.block.generator,element: accountLink(mockBlockDetail.block.generator) });
      data.push({ 'name': t('block.version'), value: mockBlockDetail.block.version });
      data.push({ 'name': t('block.size'), value: mockBlockDetail.block.size });
      data.push({ 'name': t('dashboard.txHash'), value: multiline(txHash,2) });
      
      setData(data);
      

    })
    .catch(function (error) {
      console.log(error);
    });
  }, []);


  return (
    <div style={{ 'padding': '10px' }}>

      <Table showHeader={false} columns={columns({
        t:t
      })} dataSource={data} pagination={false} rowClassName={rowStyle}/>

      <br/>
     
      <Table columns={txColumns({
        t:t
      })} dataSource={tx} pagination={false}/>

   
        {
         transfers.length > 0 && 
         <div style={{marginTop:10}}>
           <div style={{display:'flex', marginBottom:10}}> <div>{t('transaction.transfer')}</div></div>
          
         <Table  columns={transferColumns({  t:t
        })} dataSource={transfers} pagination={false}/>
        </div>
      }

      {
         orders.length > 0 && 
         <div style={{marginTop:10}}>
           <div style={{display:'flex', marginBottom:10}}> <div>{t('transaction.transfer')}</div></div>
          
         <Table  columns={orderColumns({  t:t
        })} dataSource={orders} pagination={false}/>
        </div>
      }

      {
         messages.length > 0 && 
         <div style={{marginTop:10}}>
           <div style={{display:'flex', marginBottom:10}}> <div>{t('transaction.transfer')}</div></div>
          
         <Table  columns={messageColumns({  t:t
        })} dataSource={messages} pagination={false}/>
        </div>
      }

     
      
    </div>
  );

}

export default withTranslation()(BlockTxDetail);