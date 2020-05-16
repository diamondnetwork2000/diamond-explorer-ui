//Fix IE issue https://reactjs.org/docs/javascript-environment-requirements.html
import 'core-js/es/map';
import 'core-js/es/set';
import React from 'react';
//import fetchMock from 'fetch-mock';
import { Table, Divider, Tag } from 'antd';
import { Modal, Button } from 'antd';
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
import {wrap, formatQuantity,formatTime} from './util.js';
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
      title: t('dashboard.reward'),
      dataIndex: 'reward',
      key: 'reward',
      render: text => <span>{formatQuantity(text) }</span>,
    },
    {
      title: t('dashboard.sent'),
      key: 'sent',
      dataIndex: 'sent',
      render: text => <span>{formatQuantity(text) }</span>,

    },
    {
      title: t('dashboard.txCounts'),
      key: 'txNum',
      dataIndex: 'txNum',
      render: (text, record) => (
        <span>
         {text}
        </span>
      ),
    },
    {
      title: t('block.generator'),
      key: 'generator',
      dataIndex: 'generator',
      render: (text, record) => (
        <span>
         <Link to={`/accounts/${text}`}>{wrap(text)}</Link>,
        </span>
      ),
    },
    {
      title: t('dashboard.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',

      render: text => <span onClick={() => setModal1Visible(true)}>{formatTime(text)}</span>,
    },
  ]
};

//fetchMock.get('/api/v1/xxx?id=1', mockBlockList);

class BlockTableList extends React.Component {
  state = {
    detailDialogShow: false,
    blockHeight: 100,
    blockList: [],
    total: 0
  };

  setModal1Visible(detailDialogShow) {
    this.setState({ detailDialogShow });
  }


  detailTitle() {
    return "Block" + this.state.blockHeight;
  }

  pageChange(page) {
    const that = this;
    console.log("page: ", page);
    request.get(serverUrl + '/dashboard/stats')
    .then(function (response) {
      console.log(response);
      request.get(serverUrl + '/blocks',{params : {startHeight:response.content.blockNumber, pageNo:page.current, pageSize:50}})
      .then(function (response) {
        console.log(response);
        that.setState({ 'blockList': response.content });
        that.setState({'total' :response.total});
      })
      .catch(function (error) {
        console.log(error);
      });
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  componentDidMount() {
    const that = this;

    request.get(serverUrl + '/dashboard/stats')
    .then(function (response) {
      console.log(response);
      request.get(serverUrl + '/blocks',{params : {startHeight:response.content.blockNumber, pageNo:1, pageSize:50}})
      .then(function (response) {
        console.log(response);
        that.setState({ 'blockList': response.content });
        that.setState({'total' :response.total});
      })
      .catch(function (error) {
        console.log(error);
      });
    })
    .catch(function (error) {
      console.log(error);
    });

  }
  render() {
    const { t, i18n } = this.props;
    return (
      <div>
        <Table pagination={{pageSize:50,total:this.state.total}} columns={columns({
          setModal1Visible: this.setModal1Visible.bind(this),
          t:t
        })} dataSource={this.state.blockList} onChange={this.pageChange.bind(this)}/>
        <Modal
          title={this.detailTitle()}
          style={{ top: 20 }}
          visible={this.state.detailDialogShow}
          onOk={() => this.setModal1Visible(false)}
          onCancel={() => this.setModal1Visible(false)}
        >
          <BlockDetail blockHeight={this.state.blockHeight} />
        </Modal>
      </div>

    );
  }
}


export default withTranslation()(BlockTableList);