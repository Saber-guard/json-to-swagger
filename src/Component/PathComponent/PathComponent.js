import React from 'react';
import { Form, Input, Select, Row, Col } from 'antd';
const { Option } = Select;

class PathComponent extends React.Component {

    // 构造函数
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="PathComponent">
                <Form labelCol={ {span: 3} }>
                <Row style={{'margin': '5px'}} ><Col span="24"><h2>基本信息</h2><hr></hr></Col></Row>
                    <Form.Item label="接口名称">
                        <Input value={this.props.summary} onChange={this.handleChange.bind(this, 'summary')} />
                    </Form.Item>
                    <Form.Item label="path">
                        <Input placeholder="path" value={this.props.path} onChange={this.handleChange.bind(this, 'path')} />
                    </Form.Item>
                    <Form.Item label="method">
                        <Select style={{ width: '100px' }} value={this.props.method} onChange={this.handleSelect.bind(this, 'method')}>
                            <Option value="GET">GET</Option>
                            <Option value="POST">POST</Option>
                            <Option value="PUT">PUT</Option>
                            <Option value="DELETE">DELETE</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="tags">
                        <Select mode="tags" value={this.props.tags} onChange={this.handleSelect.bind(this, 'tags')}>
                        </Select>
                    </Form.Item>
                </Form>
            </div>
        );
    }

    // 表单值变化
    handleChange(key, event) {
        this.props.onStateChange(key, event.target.value);
    }

    // select值变化
    handleSelect(key, value) {
        this.props.onStateChange(key ,value);
    }
}

export default PathComponent;