import React, {useRef, useEffect} from 'react';
import Page from '../component/page';
import Loading from '../component/loading';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Readhub from './readhub';
import { isValidLastSavedTime } from '../lib/util';

const backgroundPage = chrome.extension.getBackgroundPage();
const tabItemHeight = 40;
const tabItemBorderSize = 2;
const activeColor = '#175ae2';
const Toolbar = styled.div`
  z-index: 2;
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: ${tabItemHeight}px;
  line-height: ${tabItemHeight}px;
  transform: translate(0, -100%);
  overflow: hidden;
  transition: all .25s ease-in-out;
  background: #fff;
  ${props => props.active && (`
    transform: translate(0, 0);
  `)}
`;
const NavButton = styled.button`
  position: relative;
  width: 40px;
  background: none;
  border: none;
  cursor: pointer;
  &:before,
  &:after {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 0;
    height: 0;
    content: '';
    border: 0 solid transparent;
    border-width: 10px 12px 10px 0;
    border-right-color: #ccc;
    transform: translate(-50%, -50%);
  }
  &:after {
    z-index: 1;
    border-right-color: #fff;
    margin-left: 2px;
  }
  ${props => props.forward && (`
    &:before,
    &:after {
      border-width: 10px 0 10px 12px;
      border-left-color: #ccc;
    }
    &:after {
      border-left-color: #fff;
      margin-left: -2px;
    }
  `)}
  ${props => props.disabled && (`
    cursor: not-allowed;
    &:before {
      opacity: .3;
    }
  `)}
`
const AddressBar = styled.div`
  flex: 1;
  padding: 3px 10px 5px;
`
AddressBar.Content = styled.input`
  box-sizing: border-box;
  width: 100%;
  display: block;
  appearance: none;
  border: none;
  border-bottom: 1px solid transparent;
  height: ${tabItemHeight - 8}px;
  line-height: ${tabItemHeight - 8}px;
  outline: none;
  &:focus,
  &:active {
    border-color: ${activeColor};
  }
`
const TabsWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
`

const TabList = styled.ul`
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: #fff;
  margin: 0;
  padding: 0;
  box-shadow: 0 5px 10px rgba(0, 0, 0, .1);
  z-index: 1;
  font-size: 14px;
  &:after {
    transition: left .3s;
    content: '';
    position: absolute;
    bottom: 0;
    width: ${props => (100 / props.tabsCount).toFixed(3)}%;
    left: ${props => (100 * props.activeIndex / props.tabsCount).toFixed(3)}%;
    height: ${tabItemBorderSize}px;
    background: ${activeColor};
  }
`
const TabItem = styled.li`
  padding: 0;
  flex: 1;
  border-bottom: 1px solid #ccc;
  list-style: none;
  height: ${tabItemHeight}px;
  line-height: ${tabItemHeight}px;
  text-align: center;
  cursor: pointer;
  user-select: none;
  ${props => props.active && (`
    color: ${activeColor};
  `)}
`;

const TabContent = styled.div`
position: absolute;
  top: ${tabItemHeight + tabItemBorderSize}px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
  overflow-x: hidden;
  transition: all .3s;
`;
const IFrame = (props) => {
  let { active, loaded } = props;
  if (!active && !loaded) return null;
  const iframeRef = useRef(null);
  const onLoad = (event) => {
    props.onLoad(iframeRef, event);
  }

  return <>
    <iframe
      ref={iframeRef}
      className={props.className || ''}
      src={props.src}
      frameBorder={0}
      onLoad={onLoad}
    />
    {!loaded && <Loading hideMask />}
  </>;
}
const StyledIframe = styled(IFrame)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
  width: 100%;
  height: 100%;
  border: none;
`;
const tabs = [
  {
    key: 'readhub',
    text: 'Readhub',
    component: Readhub,
  },
  {
    key: 'cnBeta',
    text: 'cnBeta',
    component: StyledIframe,
    url: 'https://m.cnbeta.com',
  },
  {
    key: 'weibo',
    text: '微博',
    component: StyledIframe,
    url: 'https://m.weibo.cn',
  },
  {
    key: 'v2ex',
    text: 'V2EX',
    component: StyledIframe,
    url: 'https://www.v2ex.com',
  },
  {
    key: 'tmioe',
    text: 'tmioe',
    component: StyledIframe,
    url: 'https://tmioe.com/',
  },
  {
    key: 'google',
    text: 'Google',
    component: StyledIframe,
    url: 'https://www.google.com.hk',
  },
];
const Popup = (props) => {
  const names = [props.className, 'tabs'].filter(x => x).join(' ');
  const {
    popup: {
      activeKey,
      loadedKeys,
    }
  } = props;
  const activeIndex = tabs.findIndex(x => x.key === activeKey);
  const activeTab = tabs[activeIndex];
  useEffect(() => {

    window.addEventListener('load', () => {
      // 从 backgroundPage 恢复上次保存的 lastPopupBody
      let lastSavedTime = backgroundPage.lastSavedTime;
      backgroundPage.console.log('lastSavedTime:', lastSavedTime, 'backgroundPage:', backgroundPage)
      if (isValidLastSavedTime(lastSavedTime) && backgroundPage && backgroundPage.lastPopupBody) {
        backgroundPage.console.log('do restore')
        // document.body.parentElement.replaceChild(document.importNode(backgroundPage.lastPopupBody, true), document.body);
      }
    });

    window.addEventListener('unload', () => {
      backgroundPage.lastPopupBody = document.body;
      backgroundPage.lastSavedTime = Date.now();
      backgroundPage.console.log('unload, backgroundPage.lastPopupBody', backgroundPage.lastPopupBody, 'backgroundPage.lastSavedTime', backgroundPage.lastSavedTime);
    });

  })
  return (
    <TabsWrapper className={names}>
      <TabList tabsCount={tabs.length} activeIndex={activeIndex}>
        {
          tabs.map((tab) => {
            return (
              <TabItem
                key={tab.key}
                active={tab === activeTab}
                onClick={() => props.dispatch({type: 'popup/updateActiveKey', payload: tab.key})}
              >
                <span>{tab.text}</span>
              </TabItem>
            )
          })
        }
      </TabList>
      <Toolbar active={false}>
        <NavButton disabled></NavButton>
        <NavButton forward></NavButton>
        <AddressBar>
          <AddressBar.Content type='text'></AddressBar.Content>
        </AddressBar>
      </Toolbar>
      {
        tabs.map((tab, index) => {
          let ContentComponent = tab.component;
          let tabLoaded = loadedKeys.includes(tab.key);
          let contentComponentProps = {
            active: activeTab === tab,
            loaded: tabLoaded,
          };
          if (tab.url) {
            contentComponentProps = {
              ...contentComponentProps,
              src: tab.url,
              onLoad: (iframe, event) => {
                if (!tabLoaded) {
                  props.dispatch({ type: 'popup/markTabLoaded', payload: tab.key })
                }
                console.log(iframe, event);;
                // props.dispatch({ type: 'popup/updateTabURL', payload: iframe })
              },
            }
          }

          return (
            <TabContent key={tab.key} style={{transform: `translateX(${(index - activeIndex) * 100}%)`}}>
              <ContentComponent {...contentComponentProps} />
            </TabContent>
          )
        })
      }

    </TabsWrapper>
  );
};

export default connect(({ popup }) => ({
  popup,
}))(Popup);