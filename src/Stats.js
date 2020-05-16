//Fix IE issues https://reactjs.org/docs/javascript-environment-requirements.html
import 'core-js/es/map';
import 'core-js/es/set';
import React from 'react';
//import fetchMock from 'fetch-mock';
import { Table, Divider, Tag } from 'antd';
import { Modal ,Button } from 'antd';
import { Row, Col } from 'antd';
import { Typography } from 'antd';


import BlockDetail from './BlockDetail.js';
import mockBlockList from './mock/block-list.js';
import dateFormat from 'dateformat';
import request from 'umi-request';
import serverUrl from './config.js'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import { useTranslation, withTranslation, Trans } from 'react-i18next';

const { Title } = Typography;
function format(timestamp) {
  var date = new Date(timestamp * 1000);
  return dateFormat(date, 'yyyy-mm-dd HH:MM:ss');
}

const columns = (props) => {
  const { setModal1Visible } = props;
  return [
    {
      title: 'Height',
      dataIndex: 'height',
      key: 'height',
      render: text => <Link to={`/blocks/height/${text}`}>{text}</Link>,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',

      render: text => <a onClick={() => setModal1Visible(true)}>{format(text)}</a>,
    },
    {
      title: 'Reward',
      dataIndex: 'reward',
      key: 'reward',
      render: text => <a>{parseFloat(parseInt(text) / 100000000).toFixed(2)}</a>,
    },
    {
      title: 'Sent',
      key: 'sent',
      dataIndex: 'sent',
      render: text => <a>{parseFloat(parseInt(text) / 100000000).toFixed(2)}</a>,

    },
    {
      title: 'TX',
      key: 'tx',
      dataIndex: 'tx',
      render: (text, record) => (
        <span>
          <a>{record.tx}</a>
        </span>
      ),
    },
    {
      title: 'Generator',
      key: 'generator',
      dataIndex: 'generator',
      render: (text, record) => (
        <span>
          <a href="#" >{record.generator}</a>
        </span>
      ),
    },
  ]
};

//fetchMock.get('/api/v1/xxx?id=1', mockBlockList);

class Stats extends React.Component {
  state = {
    detailDialogShow: false,
    blockHeight: 100,
    blockList: [],
    stats: {}
  };

  setModal1Visible(detailDialogShow) {
    this.setState({ detailDialogShow });
  }


  detailTitle() {
    return "Block" + this.state.blockHeight;
  }

  componentDidMount() {
    const that = this;
    const { t, i18n } = this.props;

      request.get(serverUrl + '/dashboard/stats',{params : {startHeight:200000, pageNo:1, pageSize:30}})
      .then(function (response) {
        console.log(response);
        that.setState({ 'stats': response.content });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  render() {
    const { t, i18n } = this.props;
    return (
      <div>
         
         
        
        
         <div className="mobile">
         <Row  type="flex" justify="center" align="middle">
         <Col md={6} style={{ borderRadius: 0, backgroundImage: "url('block-background.png')", height: 187,width:287}} >
         <div>
          <div style={{height:78}}>
          <Title level={3} style={{color:'#42FCA7', paddingTop:18 ,paddingLeft:20,position: 'relative',float:'left',fontSize:24}}>{this.state.stats.blockNumber}</Title>
           
           
            </div>
          <div style={{height:18,color:'white'}}>
          <Title level={3} style={{color:'white', paddingLeft:20,position: 'relative',float:'left',fontSize:18}}>{t('dashboard.blockHeight')}</Title>
          
            </div>
            </div>
      </Col>
      <Col md={6} style={{ backgroundImage: "url('tx-background.png')", height: 187,width:287}} >
          

          <div>
          <div style={{height:78}}>
          <Title level={3} style={{color:'#42FCA7', paddingTop:18 ,paddingLeft:20,position: 'relative',float:'left',fontSize:24}}>{this.state.stats.txNumber}</Title>
           
           
            </div>
          <div style={{height:18,color:'white'}}>
          <Title level={3} style={{color:'white', paddingLeft:20,position: 'relative',float:'left',fontSize:18}}>{t('dashboard.totalTx')}</Title>
          
            </div>
            </div>
      </Col>
      <Col md={6}  style={{ backgroundImage: "url('account-background.png')", height: 187,width:287}}> 
        
           <div>
          <div style={{height:78}}>
          <Title level={3} style={{color:'#42FCA7', paddingTop:18 ,paddingLeft:20,position: 'relative',float:'left',fontSize:24}}>{this.state.stats.accountNumber}</Title>
           
           
            </div>
          <div style={{height:18,color:'white'}}>
          <Title level={3} style={{color:'white', paddingLeft:20,position: 'relative',float:'left',fontSize:18}}>{t('dashboard.totalAccount')}</Title>
          
            </div>
            </div>
      </Col>
      <Col md={6} style={{ backgroundImage: "url('asset-background.png')",height: 187,width:287}}> 
        
           <div>
          <div style={{height:78}}>
          <Title level={3} style={{color:'#42FCA7', paddingTop:18 ,paddingLeft:20,position: 'relative',float:'left',fontSize:24}}>{this.state.stats.assetNumber}</Title>
           
           
            </div>
          <div style={{height:18,color:'white'}}>
          <Title level={3} style={{color:'white', paddingLeft:20,position: 'relative',float:'left',fontSize:18}}>{t('dashboard.totalAsset')}</Title>
          
            </div>
            </div>
      </Col>
    </Row>
    </div>

<div className="pc">
     <Row  type="flex" justify="space-between" align="middle">
      <Col md={6} style={{ borderRadius: 0, backgroundImage: "url('block-background.png')", height: 187,width:287}} >
         <div>
          <div style={{height:78}}>
          <Title level={3} style={{color:'#42FCA7', paddingTop:18 ,paddingLeft:20,position: 'relative',float:'left',fontSize:24}}>{this.state.stats.blockNumber}</Title>
           
           
            </div>
          <div style={{height:18,color:'white'}}>
          <Title level={3} style={{color:'white', paddingLeft:20,position: 'relative',float:'left',fontSize:18}}>{t('dashboard.blockHeight')}</Title>
          
            </div>
            </div>
      </Col>
      <Col md={6} style={{ backgroundImage: "url('tx-background.png')", height: 187,width:287}} >
          

          <div>
          <div style={{height:78}}>
          <Title level={3} style={{color:'#42FCA7', paddingTop:18 ,paddingLeft:20,position: 'relative',float:'left',fontSize:24}}>{this.state.stats.txNumber}</Title>
           
           
            </div>
          <div style={{height:18,color:'white'}}>
          <Title level={3} style={{color:'white', paddingLeft:20,position: 'relative',float:'left',fontSize:18}}>{t('dashboard.totalTx')}</Title>
          
            </div>
            </div>
      </Col>
      <Col md={6}  style={{ backgroundImage: "url('account-background.png')", height: 187,width:287}}> 
        
           <div>
          <div style={{height:78}}>
          <Title level={3} style={{color:'#42FCA7', paddingTop:18 ,paddingLeft:20,position: 'relative',float:'left',fontSize:24}}>{this.state.stats.accountNumber}</Title>
           
           
            </div>
          <div style={{height:18,color:'white'}}>
          <Title level={3} style={{color:'white', paddingLeft:20,position: 'relative',float:'left',fontSize:18}}>{t('dashboard.totalAccount')}</Title>
          
            </div>
            </div>
      </Col>
      <Col md={6} style={{ backgroundImage: "url('asset-background.png')",height: 187,width:287}}> 
        
           <div>
          <div style={{height:78}}>
          <Title level={3} style={{color:'#42FCA7', paddingTop:18 ,paddingLeft:20,position: 'relative',float:'left',fontSize:24}}>{this.state.stats.assetNumber}</Title>
           
           
            </div>
          <div style={{height:18,color:'white'}}>
          <Title level={3} style={{color:'white', paddingLeft:20,position: 'relative',float:'left',fontSize:18}}>{t('dashboard.totalAsset')}</Title>
          
            </div>
            </div>
      </Col>
    </Row>
    </div>
      </div>

    );
  }
}


export default withTranslation()(Stats);