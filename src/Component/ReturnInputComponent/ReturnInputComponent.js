import React from 'react';
import {Input, Row, Col, message } from 'antd';
const { TextArea } = Input;

class ReturnInputComponent extends React.Component {

    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            json: props.json
        }
    }

    // 绑定到父组件上
    componentDidMount () {
        this.props.onRef(this)
    }

    render () {
        return (
            <div className="ReturnInputComponent">
                <Row style={{'margin': '5px'}} ><Col span="24"><h2>返回值example</h2><hr></hr></Col></Row>
                <Row><Col span="24">
                    <TextArea rows={10} value={this.state.json} placeholder="JSON格式example" onChange={this.handleChange.bind(this)} onBlur={this.onBlur.bind(this)} ></TextArea>
                </Col></Row>
            </div>
        );
    }

    // 失去焦点
    onBlur(event) {
        var exampleObject;
        try {
            exampleObject = JSON.parse(event.target.value);
        } catch (err) {
            console.log(err);
        }

        if (typeof exampleObject != 'object' || exampleObject instanceof Array) {
            if (event.target.value !== '') {
                message.error('返回值example解析错误，不是json格式');
                event.preventDefault();
            }
            this.props.onStateChange('return', {'property': 'root', 'type': 'object', 'child': [], 'description': ''});
            this.props.onStateChange('returnExample', '');
            return false;
        }

        this.props.onStateChange('return', this.convObject('root', exampleObject));
        var exampleString = JSON.stringify(exampleObject);
        exampleString = exampleString.replace(/\[/g, '{');
        exampleString = exampleString.replace(/\]/g, '}');
        this.props.onStateChange('returnExample', exampleString);
    }

    // 表单值变化
    handleChange(event) {
        this.setState({json: event.target.value})
    }

    // 对象
    convObject (key, data) {
        var child = [];
        for (var i in data) {
            if (data[i] instanceof Array) {
                child.push(this.convArray(i, data[i]));
            } else if (typeof data[i] == 'object') {
                if (data[i] === null) {
                    child.push(this.convScalar(i, data[i]));
                } else {
                    child.push(this.convObject(i, data[i]));
                }
            } else {
                child.push(this.convScalar(i, data[i]));
            }
        }
        return {
            property: key,
            type: 'object',
            child: child,
            description: '',
        };
    }

    // 数组
    convArray (key, data) {
        var child;
        if (data.length !== 0) {
            if (data[0] instanceof Array) {
                child = this.convArray(0, data[0]);
            } else if (typeof data[0] == 'object') {
                if (data[0] === null) {
                    child = this.convScalar(0 ,data[0]);
                } else {
                    child = this.convObject(0 ,data[0]);
                }
            } else {
                child = this.convScalar(0 ,data[0]);
            }
        } else {
            child = this.convScalar(0 ,null);
        }
        return {
            property: key,
            type: 'array',
            child: child,
            description: '',
        };
    }

    // 标量
    convScalar (key, data) {
        var type;
        switch (typeof data) {
            case 'number':
                type = 'integer';
                break;
            case 'boolean':
                type = 'boolean';
                break;
            case 'float':
                type = 'float';
                break;
            default:
                type = 'string';
                break;
        }
        return {
            property: key,
            type: type,
            description: '',
        };
    }

    // 清空表单
    clearArea () {
        this.setState({'json': ''});
    }

}

export default ReturnInputComponent;