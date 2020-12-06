import React from 'react';
import { Input, Select, Button, Row, Col } from 'antd';
import { DeleteOutlined } from '@ant-design/icons'
const { Option } = Select;

class QueryInputComponent extends React.Component {

  // 构造函数
  constructor(props) {
    super(props);
  }

  render() {
    const qurtyList = this.props.queryParam.map((param, index) => {
      return (
          <Input.Group compact key={index} style={{'margin': '10px 0px'}} >
            <Input style={{ width: '20%' }} placeholder="键名" value={param.name} onChange={this.handleChange.bind(this, index, 'name')} />
            <Select value={param.required ? true : false} onChange={this.handleSelect.bind(this, index, 'required')}>
              <Option value={true}>必填</Option>
              <Option value={false}>选填</Option>
            </Select>
            <Select value={param.type} onChange={this.handleSelect.bind(this, index, 'type')}>
              <Option value="string">string</Option>
              <Option value="integer">integer</Option>
              <Option value="boolean">boolean</Option>
              <Option value="float">float</Option>
            </Select>
            <Input style={{ width: '40%' }} placeholder="备注" value={param.description} onChange={this.handleChange.bind(this, index, 'description')} />
            <DeleteOutlined onClick={this.delQuery.bind(this, index)} style={{'margin': '10px'}} />
          </Input.Group>
      );
    });

    return (
      <div className="QueryInputComponent">
        <Row style={{'margin': '5px'}} ><Col span="24"><h2>query参数</h2><hr></hr></Col></Row>
        <Row style={{'margin': '5px'}} ><Col span="24"><Button type="primary" onClick={this.addQuery.bind(this)} >添加query</Button></Col></Row>
        <Row><Col span="24">{qurtyList}</Col></Row>
      </div>
    );
  }

  // input值变化
  handleChange(index, key, event) {
    const queryParam = this.props.queryParam;
    queryParam[index][key] = event.target.value;
    this.props.onStateChange('queryParam',queryParam);
  }

// select值变化
  handleSelect(index, key, value) {
    const queryParam = this.props.queryParam;
    queryParam[index][key] = value;
    this.props.onStateChange('queryParam',queryParam);
  }

  // 添加query参数
  addQuery() {
    const queryParam = this.props.queryParam;
    queryParam.push({'name': '', 'required': true, 'type': 'string', 'description': ''});
    this.props.onStateChange('queryParam',queryParam);
  }

  //删除query参数
  delQuery(index) {
    const queryParam = this.props.queryParam;
    queryParam.splice(index, 1);
    this.props.onStateChange('queryParam',queryParam);
  }
}

export default QueryInputComponent;