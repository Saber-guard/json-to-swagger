import React from 'react';
import { Input, Select, Button, Row, Col } from 'antd';
import { DeleteOutlined } from '@ant-design/icons'
const { Option } = Select;

class PathInputComponent extends React.Component {

  // 构造函数
  constructor (props) {
    super(props);
  }

  render() {
    const constpathList = this.props.pathParam.map((param, index) => {
      return (
          <Input.Group compact key={index} style={{'margin': '10px 0px'}} >
            <Input style={{ width: '20%' }} placeholder="键名" value={param.name} onChange={this.handleChange.bind(this, index, 'name')} />
            <Select value={param.type} onChange={this.handleSelect.bind(this, index, 'type')}>
              <Option value="string">string</Option>
              <Option value="integer">integer</Option>
              <Option value="boolean">boolean</Option>
              <Option value="float">float</Option>
            </Select>
            <Input style={{ width: '50%' }} placeholder="备注" value={param.description} onChange={this.handleChange.bind(this, index, 'description')} />
            <DeleteOutlined onClick={this.delPath.bind(this, index)} style={{'margin': '10px'}} />
          </Input.Group>
      );
    });

    return (
      <div className="PathInputComponent">
        <Row style={{'margin': '5px'}} ><Col span="24"><h2>path参数</h2><hr></hr></Col></Row>
        <Row style={{'margin': '5px'}} ><Col span="24"><Button type="primary" onClick={this.addPath.bind(this)} >添加path</Button></Col></Row>
        <Row><Col span="24">{constpathList}</Col></Row>
      </div>
    );
  }

  // 表单值变化
  handleChange(index, key, event) {
    const pathParam = this.props.pathParam;
    pathParam[index][key] = event.target.value;
    this.props.onStateChange('pathParam',pathParam);
  }

  // select值变化
  handleSelect(index, key, value) {
    const pathParam = this.props.pathParam;
    pathParam[index][key] = value;
    this.props.onStateChange('pathParam',pathParam);
  }

  // 添加path参数
  addPath() {
    const pathParam = this.props.pathParam;
    pathParam.push({'name': '', 'type': 'string', 'description': ''});
    this.props.onStateChange('pathParam',pathParam);
  }

  //删除path参数
  delPath(index) {
    const pathParam = this.props.pathParam;
    pathParam.splice(index, 1);
    this.props.onStateChange('pathParam',pathParam);
  }
}

export default PathInputComponent;