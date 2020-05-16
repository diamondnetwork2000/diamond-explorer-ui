//Fix IE issue https://reactjs.org/docs/javascript-environment-requirements.html
import 'core-js/es/map';
import 'core-js/es/set';
import React from 'react';

import { Table, Divider, Tag } from 'antd';
import { Modal, Button } from 'antd';
import BlockDetail from './BlockDetail.js';
import mockAssetList from './mock/asset-list.js';
import dateFormat from 'dateformat';
import request from 'umi-request';
import serverUrl from './config.js';
import {wrap, formatQuantity,formatTime, formatFee,formatToken} from './util.js';
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
function format(timestamp) {
  var date = new Date(timestamp * 1000);
  return dateFormat(date, 'yyyy-mm-dd hh:MM:ss');
}

const columns = (props) => {
  const { setModal1Visible ,t} = props;
  return [
    {
      title: t('asset.name'),
      dataIndex: 'name',
      key: 'name',
      render: text => <Link to={`/assets/${text}`}>{(text)}</Link>,
    },
   
    {
      title: t('asset.height'),
      dataIndex: 'creationHeight',
      key: 'creationHeight',
      render: text => <span onClick={() => setModal1Visible(true)}>{text}</span>,
    },
    {
      title: t('dashboard.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',

      render: text => <span onClick={() => setModal1Visible(true)}>{(text)}</span>,
    },
    {
      title: t('asset.total'),
      dataIndex: 'totalSupply',

      render: text => <span>{formatToken(text)}</span>,
    },
    {
      title: t('asset.issuer'),
      key: 'issuer',
      dataIndex: 'issuer',
      render: text =><Link to={`/accounts/${text}`}>{wrap(text)}</Link>,

    }

  ]
};



class AssetTableList extends React.Component {
  state = {
    detailDialogShow: false,
    blockHeight: 100,
    blockList: []
  };

  setModal1Visible(detailDialogShow) {
    this.setState({ detailDialogShow });
  }


  detailTitle() {
    return "Block" + this.state.blockHeight;
  }

  componentDidMount() {
    const that = this;
    request.get(serverUrl + '/assets',{params:{pageNo:1, pageSize:50}})
      .then(function (response) {
        console.log(response);
        that.setState({ 'blockList': response.content });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  render() {
    const { t, i18n } = this.props;
    return (
      <div>
        <Table columns={columns({
          setModal1Visible: this.setModal1Visible.bind(this),
          t: t
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


export default withTranslation()(AssetTableList);