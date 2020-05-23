//fix the issue in IE https://reactjs.org/docs/javascript-environment-requirements.html
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
import {wrap, formatQuantity,formatTime, formatFee,formatToken,txType2String} from './util.js';
import { useTranslation, withTranslation, Trans } from 'react-i18next'
const { Paragraph } = Typography;
const { TabPane } = Tabs;
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
          return <span onClick={() => setModal1Visible(true)}>{text}</span>;
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
      title: t('dashboard.txHash'),
      width: 100,
      dataIndex: 'txHash',
      key: 'txHash',
      render: text =>  <Link to={`/blocks/transaction/${text}`}>{wrap(text)}</Link>,
    },
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

      render: text => <Link to={`/accounts/${text}`}>{wrap(text)}</Link>,
    },
    {
      title:  t('dashboard.recipient'),
      dataIndex: 'recipient',
      key: 'recipient',

      render: text => <Link to={`/accounts/${text}`}>{wrap(text)}</Link>,
    },
    {
      title:  t('dashboard.quantity'),
      dataIndex: 'amount',
      key: 'amount',

      render: text => <span onClick={() => setModal1Visible(true)}>{formatQuantity(text)}</span>,
    },
    {
      title:  t('asset.name'),
      dataIndex: 'token',
      key: 'token',

      render: text => <span onClick={() => setModal1Visible(true)}>{(text)}</span>,
    },
    {
      title:  t('dashboard.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',

      render: text => <span onClick={() => setModal1Visible(true)}>{formatTime(text)}</span>,
    },

  ]
};


const assetColumns = (props) => {
  const { setModal1Visible,t } = props;
  return [
   
    {
      title:t('asset.name'),
      dataIndex: 'assetName',
      key: 'assetName',

      render: (text,record) =>  {
        return <Link to={`/assets/${record.assetName}`}>{text}</Link>
      }
    },
   
    {
      title: t('account.balance'),
      dataIndex: 'quantity',
      key: 'quantity',

      render: text => <span onClick={() => setModal1Visible(true)}>{formatToken(text)}</span>,
    },
    {
      title: t('account.frozen'),
      dataIndex: 'frozenQuantity',
      key: 'frozenQuantity',

      render: text => <span onClick={() => setModal1Visible(true)}>{formatToken(text)}</span>,
    },
    {
      title: t('account.share'),
      dataIndex: 'share',
      key: 'share',

      render: text => <span onClick={() => setModal1Visible(true)}>{text}</span>,
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

function format(timestamp) {
  var date = new Date(timestamp * 1000);
  return dateFormat(date, 'yyyy-mm-dd hh:MM:ss');
}
function callback(key) {
  console.log(key);
}
function accountLink(account) {
  return  <Link to={`/accounts/${account}`}>{account}</Link>;
}

function AccountDetail() {
  let { accountId } = useParams();
  let {t} = useTranslation();

  const [data, setData] = useState([]);
  const [tx, setTx] = useState([]);
  const [assets, setAssets] = useState([]);
  const [totalTx,setTotalTx] = useState();
 
  function txPageChange(accountId) {
    const change =  (page) => {
        
      request.get(serverUrl + '/tx/account',{params : {accountId: accountId,pageNo:page.current,pageSize:50}})
      .then(function (response) {
        console.log(response);
      //  that.setState({ 'blockList': response.content });
        var data = response.content;
       
  
        setTx(data)
        setTotalTx(response.total);
      })
      .catch(function (error) {
        console.log(error);
      });
    }

    return change;
};


  React.useEffect(() => {
    console.log("block detail mounted: ", accountId);
    request.get(serverUrl + '/accounts/detail',{params : {address: accountId}})
    .then(function (response) {
      console.log(response);
    //  that.setState({ 'blockList': response.content });
      var mockAccountDetail = response.content;
      var data = [];
    
  data.push({ 'name': t('account.name'), value: mockAccountDetail.rs });
 
  data.push({ 'name': t('account.balance'), value: formatQuantity(mockAccountDetail.balance) });
  data.push({ 'name': t('account.received'), value: mockAccountDetail.receive });
  data.push({ 'name': t('account.sent'), value: mockAccountDetail.sent });
  data.push({ 'name': t('account.assetCounts'), value: mockAccountDetail.assetNum });
  data.push({ 'name': t('dashboard.txCounts'), value: mockAccountDetail.txNum });
  data.push({ 'name': t('block.fee'), value: mockAccountDetail.fee });

      setData(data)
     
     

    })
    .catch(function (error) {
      console.log(error);
    });

    request.get(serverUrl + '/tx/account',{params : {address: accountId,pageNo:1,pageSize:50}})
    .then(function (response) {
      console.log(response);
    //  that.setState({ 'blockList': response.content });
      var data = response.content;
     

      setTx(data)
      setTotalTx(response.total);
    })
    .catch(function (error) {
      console.log(error);
    });

    request.get(serverUrl + '/accounts/assets',{params : {address: accountId,pageNo:1,pageSize:50}})
    .then(function (response) {
      console.log(response);
    //  that.setState({ 'blockList': response.content });
      var data = response.content;
     

      setAssets(data)

    })
    .catch(function (error) {
      console.log(error);
    });

  }, []);


  return (
    <div style={{ 'padding': '10px' }}>
      <Tabs defaultActiveKey="1" onChange={callback}>
        <TabPane tab={t('account.info')} key="1">
          <Table showHeader={false} columns={columns({
            t:t

          })} dataSource={data} pagination={false} rowClassName={rowStyle}/>
        </TabPane>
        <TabPane tab={t('account.tx')}  key="2">
          <Table columns={txColumns({
           t:t
          })} dataSource={tx} pagination={{pageSize:50,total:totalTx}} onChange={txPageChange(accountId)} />

        </TabPane>
        <TabPane tab={t('account.asset')}  key="3">
          <Table columns={assetColumns({
               t:t
          })} dataSource={assets} />
        </TabPane>
      </Tabs>






    </div>
  );

}

export default AccountDetail;