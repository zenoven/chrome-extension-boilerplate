import React, {useRef} from 'react';
import Page from '../component/page';
import Loading from '../component/loading';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Readhub from './readhub';

const tabItemHeight = 40;
const tabItemBorderSize = 2;
const activeColor = '#175ae2';
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
  const onLoad = () => {
    props.onLoad();
    if (props.forceMobile) {
      console.log('force')
      console.log(iframeRef.current)
      window.iframeRef = iframeRef.current;
      // useMobileUA(iframeRef.current.contentWindow); // not working, iframeRef.current.contentWindow has no navigator prop
      // console.log(iframeRef.current.contentWindow.userAgent.navigator)
    }
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
    url: 'https://cnbeta.leanapp.cn',
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
    forceMobile: true,
  },
  {
    key: 'google',
    text: 'Google',
    component: StyledIframe,
    url: 'https://www.google.com.hk/m',
    forceMobile: true,
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
              onLoad: () => props.dispatch({ type: 'popup/markTabLoaded', payload: tab.key }),
              forceMobile: tab.forceMobile,
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