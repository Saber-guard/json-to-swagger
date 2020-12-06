import React from 'react';
import ImportComponent from '../ImportComponent/ImportComponent';
import {Button, Row, Col } from 'antd';

class OperationComponent extends React.Component {

    // 构造函数
    constructor (props) {
        super(props);
        this.state = {
            dataDefault: props.data
        }
    }

    render () {
        return (
            <div className="OperationComponent" style={{'margin': '30px 0px'}}>
                <Row>
                    <Col style={{'padding':'5px'}}><Button type="primary" onClick={this.resetAllStatus.bind(this)} >重置</Button></Col>
                    <Col style={{'padding':'5px'}}><ImportComponent dataDefault={this.state.dataDefault} onStateChangeAll={this.props.onStateChangeAll}></ImportComponent></Col>
                </Row>
            </div>
        );
    }

    // 重置
    resetAllStatus () {
        this.props.onStateChangeAll(this.state.dataDefault);
    }

}

export default OperationComponent;