//解决IE里因为缺少Map而无法打开的问题 https://reactjs.org/docs/javascript-environment-requirements.html
import 'core-js/es/map';
import 'core-js/es/set';
import React, { Component,Suspense } from 'react';
import ReactDOM from 'react-dom'
import logo from './logo.svg';
import Button from 'antd/es/button';
import { Layout, Menu, Breadcrumb ,Select} from 'antd';
import { Row, Col } from 'antd';
import { Input } from 'antd';
import './App.css';
import BlockTableList from './BlockTableList.js'
import AssetTableList from './AssetTableList.js'
import AccountTableList from './AccountTableList.js'
import Home from './Home.js'

import {
  BrowserRouter as Router,
  Switch,
  withRouter,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import BlockDetail from './BlockDetail.js';
import AssetDetail from './AssetDetail.js';
import AccountDetail from './AccountDetail.js';
import BlockTxDetail from './BlockTxDetail.js';
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const { Header, Content, Footer } = Layout;
const { Search } = Input;
const {Option} = Select;
const { SubMenu } = Menu;

class App extends React.Component {
  state = {
    currentTab: 'block',
    language: 'en_US',
  };

  constructor(props) {
    super(props);
  }
  componentDidMount() {
    console.log("this", this.props);
  }

  search(value) {
    if (value.startsWith("1x")) {
      //账号, 直接用createBrowserHistory构建出来的history和Router没有关联，调用push后地址栏变了，但是页面不会跳转
      //必须是在外面传进来的history上操作才会跳转
      //使用hisotry.push的时候，如果当前页面已经在accounts上，那么页面不会刷新，
     // this.props.history.push("/accounts/" + value);
      window.location = "/accounts/" + value;
    } else if (value.length <= "1000000000".length) {
      //区块 -- 假设高度不会超过一亿
     // this.props.history.push("/blocks/height/" + value);
      window.location = "/blocks/height/" + value;
    } else if (value.length == "c115ce9edb59064d0200e61ecf4f0473c5ccc123a4863caae9065b4de885c731".length) {
       //交易
       window.location = "/blocks/transaction/" + value;
       //this.props.history.push("/blocks/transaction/" + value);
    } 
  }

  languageChange(locale) {
    const { t, i18n } = this.props;

    if (this.state.language === 'zh_CN') {
      this.setState({'language': 'en_US'})
      i18n.changeLanguage('en_US');
    } else {
      this.setState({'language': 'zh_CN'})
      i18n.changeLanguage('zh_CN');
    }

   
    
  }

  render() {
    const { currentTab } = this.state;
    const { t, i18n } = this.props;
    return (

      <div className="App">
        <Layout className="layout">
          <div className="content-padding" style={{background:'#1E2033',paddingTop:18, paddingBottom:18}}>
           
          <div className="mobile">
            <Row >
              <Col  sm={6} theme="dark" >
              <div style={{display:'flex',alignItems: 'flex-start',justifyContent:'center',marginLeft:10 }}>
                <img src="/LOGO.png" style={{height: '30px',  marginRight: '10px'}}/>
                <Link to="/"><span style={{ color: 'white', fontSize: 17 }}>{t("app_title")}</span></Link>
                </div>
             </Col>
             <Col sm={6} theme="dark" style={{ horizontalAlign: 'left', morginRight:10, paddingTop:10 }}>
                <div>  <Search theme="dark"
                  placeholder={t('search.placeholder')}
                  
                 
                  onSearch={value => this.search(value)}
                />
                
                
                </div>

              </Col>
              <Col sm={12} style={{ horizontalAlign: 'left', morginRight:10, paddingTop:10 }}>

                <div style={{display:'flex',alignItems: 'flex-start',justifyContent:'center',marginRight:10 }}>
                
                <Menu
                  theme="dark"
                  mode="horizontal"

                  defaultSelectedKeys={currentTab}
                  style={{ background:'#1E2033',height:30}}
                >
                  <Menu.Item key="blocks"> <Link to="/blocks">{t("title.block")}</Link></Menu.Item>
                  <Menu.Item key="accounts"><Link to="/accounts">{t("title.account")}</Link></Menu.Item>
                  <Menu.Item key="assets"><Link to="/assets">{t("title.asset")}</Link></Menu.Item>
                  <Menu.Item key="dashboard"><Link to="/dashboard">{t("title.dashboard")}</Link></Menu.Item>
                
              </Menu>
              <img src="/language.png" onClick={this.languageChange.bind(this)} style={{height: '22px', cursor: 'pointer',marginTop:4}}/>

                </div>
               
              </Col>

              

             
            </Row>
           </div>

            <div className="pc">
           <Row >
             <Col  sm={6} theme="dark" >
             <div style={{display:'flex',alignItems: 'flex-start',justifyContent:'flex-start',marginLeft:10 }}>
               <img src="/LOGO.png" style={{height: '30px',  marginRight: '10px'}}/>
               <Link to="/"><span style={{ color: 'white', fontSize: 17 }}>{t("app_title")}</span></Link>
               </div>
            </Col>
            <Col sm={6} theme="dark" >
               <div>  <Search theme="dark"
                 placeholder={t('search.placeholder')}
                 
                
                 onSearch={value => this.search(value)}
               />
               
               
               </div>

             </Col>
             <Col sm={12} style={{ horizontalAlign: 'left', morginRight:10 }}>

               <div style={{display:'flex',alignItems: 'flex-start',justifyContent:'flex-end',marginRight:10 }}>
               
               <Menu
                 theme="dark"
                 mode="horizontal"

                 defaultSelectedKeys={currentTab}
                 style={{ background:'#1E2033',height:30}}
               >
                 <Menu.Item key="blocks"> <Link to="/blocks">{t("title.block")}</Link></Menu.Item>
                 <Menu.Item key="accounts"><Link to="/accounts">{t("title.account")}</Link></Menu.Item>
                 <Menu.Item key="assets"><Link to="/assets">{t("title.asset")}</Link></Menu.Item>
                 <Menu.Item key="dashboard"><Link to="/dashboard">{t("title.dashboard")}</Link></Menu.Item>
               
             </Menu>
             <img src="/language.png" onClick={this.languageChange.bind(this)} style={{height: '22px', cursor: 'pointer',marginTop:4}}/>

               </div>
              
             </Col>

             

            
           </Row>
           </div>

          </div>

        
          


          <Content className="content-padding" style={{ paddingTop: 20, fontSize:12 }}>


            <Switch>
              <Route path="/assets/:assetId">
                <div> <AssetDetail /></div>
              </Route>
              <Route path="/assets">
                <div> <AssetTableList /></div>
              </Route>
              <Route path="/accounts/:accountId">
                <div> <AccountDetail /></div>
              </Route>
              <Route path="/accounts">
                <div> <AccountTableList /></div>
              </Route>
              <Route path="/blocks/height/:height">
                <div> <BlockDetail /></div>
              </Route>
              <Route path="/blocks/transaction/:txHash">
                <div> <BlockTxDetail /></div>
              </Route>
              <Route path="/blocks">
                <div> <BlockTableList /></div>
              </Route>

              <Route path="/">
                <div> <Home /></div>
              </Route>

            </Switch>

          </Content>

          <Footer style={{ textAlign: 'center' ,color:'#838398',background: '#18192B', height:40 }}>
          
          <div style={{ textAlign: 'center' ,color:'#838398',background: '#18192B', paddingTop:10 }}>{t('app_title')} ©2020 {t('corp')} </div>
          
          
          </Footer>
        </Layout>
      </div>

    );
  }
}

const Loader = () => (
  < >
   
  </>
);

//必须大写开头
//必须withRouter，然后this.props才有history属性
//必须把withRouter写在最里面，否则拿不到history
const TransApp =withTranslation()(withRouter(App));
//必须套一层Suspense, 不然i18n组件出错
const b = function () {
  return (
    <Suspense fallback={<Loader />}>
      <TransApp />
    </Suspense>
  );
}

export default b;