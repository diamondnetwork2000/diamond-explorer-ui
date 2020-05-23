//Fix IE issue https://reactjs.org/docs/javascript-environment-requirements.html
import 'core-js/es/map';
import 'core-js/es/set';
import React from 'react';
//import fetchMock from 'fetch-mock';
import { Table, Divider, Tag } from 'antd';
import { Modal, Button } from 'antd';
import { Row, Col } from 'antd';
import BlockDetail from './BlockDetail.js';
import Stats from './Stats.js';

import request from 'umi-request';
import serverUrl from './config.js';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import {wrap, formatQuantity,formatTime,txType2String} from './util.js';
import { useTranslation, withTranslation, Trans } from 'react-i18next';




const columns = (props) => {
  const { setModal1Visible,t } = props;
  return [
    {
      title: t('dashboard.height'),
      dataIndex: 'height',
      key: 'height',
     
      render: text => <Link to={`/blocks/height/${text}`}>{text}</Link>,
    },
   
    {
      title: t('block.generator'),
      dataIndex: 'generator',
      key: 'generator',
      render: text => <Link to={`/accounts/${text}`}>{(text)}</Link>,
    },
    {
      title: t('dashboard.txCounts'),
      key: 'txNum',
      dataIndex: 'txNum',
      render: (text, record) => (
        <span>
          <span>{text}</span>
        </span>
      ),
    },
    {
      title: t('dashboard.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',

      render: text => <span>{(text)}</span>,
    },
   
  ]
};

const txColumns = (props) => {
  const { setModal1Visible,t } = props;
  return [
    {
      title: t('dashboard.txHash'),
      width: 100,
      dataIndex: 'hash',
      key: 'hash',
      render: text =>  <Link to={`/blocks/transaction/${text}`}>{wrap(text)}</Link>,
  },
      {
          title: t('dashboard.type'),
          dataIndex: 'type',
          key: 'type',

          render: (text,record) => <span>{t(txType2String(text,record.subType))}</span>,
      },
      {
          title: t('dashboard.sender'),
          dataIndex: 'sender',
          key: 'sender',
          
          render: text => <Link to={`/accounts/${text}`}><span  style={{ wordBreak: 'break-all'}} >{wrap(text)}</span ></Link>,
      },
      /*{
          title: t('dashboard.recipient'),
          dataIndex: 'recipient',
          key: 'recipient',

          render: text => <Link to={`/accounts/${text}`}><span  style={{ wordBreak: 'break-all'}} >{wrap(text)}</span></Link>,
      },
      {
          title: t('dashboard.quantity'),
          dataIndex: 'quantity',
          key: 'quantity',

          render: text => <span>{formatQuantity(text)}</span>,
      },*/
      {
        title: t('dashboard.height'),
        dataIndex: 'height',
        key: 'height',
       
        render: text => <Link to={`/blocks/height/${text}`}>{text}</Link>,
      },
     
      {
          title: t('dashboard.createdAt'),
          dataIndex: 'createdAt',
          key: 'createdAt',

          render: text => <span>{formatTime(text)}</span>,
      },

  ]
};

//fetchMock.get('/api/v1/xxx?id=1', mockBlockList);

class Home extends React.Component {
  state = {
    detailDialogShow: false,
    blockHeight: 100,
    blockList: [],
    totalBlock: 0,
    txList: [],
    totalTx:0
  };
  
  setModal1Visible(detailDialogShow) {
    this.setState({ detailDialogShow });
  }


  detailTitle() {
    return "Block" + this.state.blockHeight;
  }


  txPageChange(page) {
    const that = this;
    console.log("page: ", page);
    request.get(serverUrl + '/tx/latest',{params : {pageNo:page.current, pageSize:20}})
    .then(function (response) {
     
        that.setState({ 'txList': response.content });
        that.setState({'totalTx' :response.total});
     
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  blockPageChange(page) {
    const that = this;
    console.log("page: ", page);
    request.get(serverUrl + '/blocks',{params : {startHeight:this.state.totalBlock,pageNo:page.current, pageSize:20}})
    .then(function (response) {
     
        that.setState({ 'blockList': response.content });
       
     
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  componentDidMount() {
    const { t, i18n } = this.props;
    
    const that = this;
    request.get(serverUrl + '/dashboard/stats')
    .then(function (response) {
      console.log(response);
      that.setState({ 'totalBlock': response.content.blockNumber });

      request.get(serverUrl + '/blocks',{params : {startHeight:response.content.blockNumber, pageNo:1, pageSize:20}})
      .then(function (response) {
        console.log(response);
        that.setState({ 'blockList': response.content });
       
      })
      .catch(function (error) {
        console.log(error);
      });
    })
    .catch(function (error) {
      console.log(error);
    });

    

      request.get( serverUrl + '/tx/latest',{params : { pageNo:1, pageSize:20}})
      .then(function (response) {
        console.log(response);
        that.setState({ 'txList': response.content });
        that.setState({ 'totalTx': response.total });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  render() {
   
    const { t, i18n } = this.props;
    return (
      <div>
         
        <Stats></Stats>
        
        <div style={{background:'white',marginTop:20}}>
     
      <h4 style={{textAlign: 'left', fontSize: 16, padding:5}}>{t('dashboard.latestBlock')}</h4>
      <Table ordered columns={columns({
          setModal1Visible: this.setModal1Visible.bind(this),
          t:t
        })} dataSource={this.state.blockList} pagination={{pageSize:20,total:this.state.totalBlock}}
        onChange={this.blockPageChange.bind(this)}/>
     
     
      </div>

        <div gutter={16} style={{background:'white',marginTop:20}}>
       
      <h4  style={{textAlign: 'left', fontSize: 16,padding:5}}>{t('dashboard.latestTx')}</h4>
      <Table pagination={{pageSize:20,total:this.state.totalTx}} columns={txColumns({
          setModal1Visible: this.setModal1Visible.bind(this),
          t: t
        })} dataSource={this.state.txList} onChange={this.txPageChange.bind(this)}/>
      
        </div>
    
       
      </div>

    );
  }
}

export default withTranslation()(Home);