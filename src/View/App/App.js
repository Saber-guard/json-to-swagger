import React from 'react';
import 'antd/dist/antd.css'
import './App.css';
import { Row, Col } from 'antd';
import PathComponent from '../../Component/PathComponent/PathComponent';
import PathInputComponent from '../../Component/PathInputComponent/PathInputComponent';
import QueryInputComponent from '../../Component/QueryInputComponent/QueryInputComponent';
import BodyInputComponent from '../../Component/BodyInputComponent/BodyInputComponent';
import ReturnInputComponent from '../../Component/ReturnInputComponent/ReturnInputComponent';
import OperationComponent from '../../Component/OperationComponent/OperationComponent';
import OutputComponent from '../../Component/OutputComponent/OutputComponent';

class App extends React.Component {

  // 构造函数
  constructor (props) {
    super(props);
    document.title="json-to-swagger";
    this.state = {
      'path': '/',
      'method': 'GET',
      'tags': ['默认分组'],
      'summary': '',
      'header': {},
      'pathParam': [],
      'queryParam': [],
      'bodyParam': {'property': 'root', 'type': 'object', 'child': [], 'description': ''},
      'return': {'property': 'root', 'type': 'object', 'child': [], 'description': ''},
      'bodyExample': '',
      'returnExample': '',
    };
  }

  render() {
    return (
      <div className="App">
        <Row>
          <Col span="12" id="left">
            <PathComponent
              path={this.state.path}
              method={this.state.method}
              tags={this.state.tags}
              summary={this.state.summary}
              onStateChange={this.onStateChange.bind(this)}
              ></PathComponent>
            <PathInputComponent pathParam={this.state.pathParam} onStateChange={this.onStateChange.bind(this)} ></PathInputComponent>
            <QueryInputComponent queryParam={this.state.queryParam} onStateChange={this.onStateChange.bind(this)} ></QueryInputComponent>
            <BodyInputComponent bodyParam={this.state.bodyParam} json={''} onStateChange={this.onStateChange.bind(this)} onRef={this.onRef.bind(this, 'BodyInputComponent')} ></BodyInputComponent>
            <ReturnInputComponent bodyParam={this.state.return} json={''} onStateChange={this.onStateChange.bind(this)} onRef={this.onRef.bind(this, 'ReturnInputComponent')} ></ReturnInputComponent>
            <OperationComponent data={this.state} onStateChangeAll={this.onStateChangeAll.bind(this)} ></OperationComponent>
          </Col>
          <Col span="12" id="right">
            <OutputComponent data={this.state}></OutputComponent>
          </Col>
        </Row>
      </div>
    );
  }

  //state部分改变
  onStateChange (key ,value) {
    const param = {};
    param[key] = value;
    this.setState(param);
  }

  //state全部改变
  onStateChangeAll (state) {
    this.setState(state);
    this.BodyInputComponent.clearArea();
    this.ReturnInputComponent.clearArea();
  }

  // 绑定子组件
  onRef (childName, ref) {
    this[childName] = ref;
  }

}


export default App;