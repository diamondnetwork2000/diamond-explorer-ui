//解决IE里因为缺少Map而无法打开的问题 https://reactjs.org/docs/javascript-environment-requirements.html
import 'core-js/es/map';
import 'core-js/es/set';
import React,{ useState } from 'react';
import { Form, Table, Tabs, Input, Typography, List, Row, Col } from 'antd';
import {
    useParams,
   
    Link
} from "react-router-dom";
import dateFormat from 'dateformat';
import request from 'umi-request';
import serverUrl from './config.js';
import {wrap, formatQuantity,formatTime,formatFee,txType2String} from './util.js';
import { useTranslation, withTranslation, Trans } from 'react-i18next';

const { Paragraph } = Typography;
const { TabPane } = Tabs;
function callback(key) {
    console.log(key);
}


const columns = (props) => {
    const { setModal1Visible } = props;
    return [
        {
            title: '高度',
            width: 100,
            dataIndex: 'name',
            key: 'name',
            render: text => (<span>{text}</span>),
        },
        {
            title: '创建时间',
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

function accountLink(account) {
    return  <Link to={`/accounts/${account}`}>{account}</Link>;
  }

  function paragraph(account) {
    return  <span  style={{ wordBreak: 'break-all'}} >{account}</span >;
  }
const txColumns = (props) => {
    const { setModal1Visible,t } = props;
    return [
        {
            title: t('dashboard.txHash'),
            width: 100,
            dataIndex: 'hash',
            key: 'hash',
            render: text => (<span>{text}</span>),
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

            render: text => <a onClick={() => setModal1Visible(true)}>{text}</a>,
        },
        {
            title: t('dashboard.recipient'),
            dataIndex: 'recipient',
            key: 'recipient',

            render: text => <a onClick={() => setModal1Visible(true)}>{text}</a>,
        },
        {
            title: t('dashboard.quantity'),
            dataIndex: 'quantity',
            key: 'quantity',

            render: text => <span>{formatQuantity(text)}</span>,
        },
        {
            title: t('block.fee'),
            dataIndex: 'fee',
            key: 'fee',

            render: text => <span>{formatFee(text)}</span>,
        },
        {
            title: t('dashboard.createdAt'),
            dataIndex: 'createdAt',
            key: 'createdAt',

            render: text => <span>{formatTime(text)}</span>,
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

function rowStyle(record, index) {
    return "row-style";
}




function BlockDetail() {
    //只能在函数用
    let { height } = useParams();
    let {t} = useTranslation();

    
    const [data, setData] = useState([]);
    const [tx, setTx] = useState([]);
    const [total,setTotal] = useState([]);


    function pageChange(height) {
        const change =  (page) => {
            
            request.get(serverUrl + '/tx',{params : {height: height,pageNo:page.current,pageSize:50}})
            .then(function (response) {
              console.log(response);
            //  that.setState({ 'blockList': response.content });
              var data = response.content;
              setTotal(response.total);
        
              setTx(data)
        
            })
            .catch(function (error) {
              console.log(error);
            });
        }
    
        return change;
    };
  

    React.useEffect(() => {

        console.log("block detail mounted: ", height);
        request.get( serverUrl + '/blocks/height',{params : {height: height}})
      .then(function (response) {
        console.log(response);
      //  that.setState({ 'blockList': response.content });
        var mockBlockDetail = response.content;
        var data = [];
        data.push({ 'name': t('dashboard.height'), value: mockBlockDetail.height });
        data.push({ 'name': t('dashboard.txCounts'), value: mockBlockDetail.txNum });
        data.push({ 'name': t('dashboard.createdAt'), value: (mockBlockDetail.createdAt) });
        data.push({ 'name': t('dashboard.sent'), value: formatFee(mockBlockDetail.sent) });
        data.push({ 'name': t('dashboard.reward'), value: formatFee(mockBlockDetail.reward) });
        data.push({ 'name': t('block.sign'), value: mockBlockDetail.signaturek,element:paragraph(mockBlockDetail.signature) });
        data.push({ 'name': t('block.generator'), value: mockBlockDetail.generator,element:accountLink(mockBlockDetail.generator) });
        data.push({ 'name': t('block.version'), value: mockBlockDetail.version });
        data.push({ 'name': t('block.size'), value: mockBlockDetail.size });

        setData(data)

      })
      .catch(function (error) {
        console.log(error);
      });

      request.get(serverUrl + '/tx',{params : {height: height,pageNo:1,pageSize:50}})
      .then(function (response) {
        console.log(response);
      //  that.setState({ 'blockList': response.content });
        var data = response.content;
        setTotal(response.total);

        setTx(data)

      })
      .catch(function (error) {
        console.log(error);
      });
    }, []);


    return (
        <div style={{ 'padding': 0 }}>


            <Tabs defaultActiveKey="1" onChange={callback}>
                <TabPane tab={t('block.blockInfo')} key="1">
                    <Table showHeader={false} columns={columns({
                       
                    })} dataSource={data} pagination={false} rowClassName={rowStyle}/>
                </TabPane>
                <TabPane tab={t('block.txInfo')} key="2">
                <Table pagination={{pageSize:50,total:total}} columns={txColumns({
                t:t
})} dataSource={tx} onChange={pageChange(height)}/>

                </TabPane>

            </Tabs>

        </div>
    );

}

export default withTranslation()(BlockDetail);