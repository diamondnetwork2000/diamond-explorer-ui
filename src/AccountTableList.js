import 'core-js/es/map';
import 'core-js/es/set';
import React from 'react';

import { Table, Divider, Tag } from 'antd';
import { Modal, Button } from 'antd';
import BlockDetail from './BlockDetail.js';
import mockAccountList from './mock/account-list.js';
import dateFormat from 'dateformat';
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
import {wrap, formatQuantity,formatTime} from './util.js';
import { useTranslation, withTranslation, Trans } from 'react-i18next';
function showTotal(total) {
  return `Total ${total} items`;
}
const columns = (props) => {
  const { setModal1Visible ,t} = props;
  return [
    {
      title: t('account.name'),
      dataIndex: 'address',
      key: 'address',
      render: text => <Link to={`/accounts/${text}`}>{wrap(text)}</Link>,
    },
  
    {
      title: t('account.balance'),
      dataIndex: 'balance',
      key: 'balance',
      render: text => <span>{formatQuantity(text)}</span>,
    },
   
   
    {
      title: t('account.assetCounts'),
      dataIndex: 'assetNum',

      render: text => (<span>{text}</span>),
    },
    {
      title: t('dashboard.height'),
      dataIndex: 'creationHeight',
      key: 'creationHeight',

      render: text => <span>{text}</span>,
    },
    {
      title: t('dashboard.createdAt'),
      dataIndex: 'createdAt',

    render: text => (<span>{text}</span>),
    }

  ]
};


class AccountTableList extends React.Component {
  state = {
    detailDialogShow: false,
    blockHeight: 100,
    blockList: [],
    total: 50
  };

  setModal1Visible(detailDialogShow) {
    this.setState({ detailDialogShow });
  }


  detailTitle() {
    return "Block" + this.state.blockHeight;
  }

  

  componentDidMount() {
    const that = this;
    request.get(serverUrl + '/accounts',{params : {startHeight:200000, pageNo:1, pageSize:50}})
    .then(function (response) {
      console.log(response);
      that.setState({ 'blockList': response.content });
      that.setState({ 'total': response.total });
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  render() {
    const { t, i18n } = this.props;
    return (
      <div>
        <Table pagination={{pageSize:50,total:this.state.total}} total={555} showTotal={showTotal} columns={columns({
          setModal1Visible: this.setModal1Visible.bind(this),
          t:t
        })} dataSource={this.state.blockList} />
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


export default withTranslation()(AccountTableList);