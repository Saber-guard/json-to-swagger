import React from 'react';
import {Button, Modal, Input} from 'antd';
const { TextArea } = Input;

class ImportComponent extends React.Component {

    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            importModalVisible: false,
            swagger: '',
            dataDefault: props.dataDefault
        };
    }

    render() {
        return (
            <span className="ImportComponent">
                <Button type="primary" onClick={this.importSwagger.bind(this)}>导入swagger注释</Button>
                <Modal title="导入swagger注释" maskClosable={false} visible={this.state.importModalVisible} onOk={this.importModalOk.bind(this)} onCancel={this.importModalClose.bind(this)}>
                    <TextArea style={{'resize':'none', 'color':'#777', 'whiteSpace':'pre', 'overflow':'scroll'}} value={this.state.swagger} rows={30} onChange={this.handleChange.bind(this)}></TextArea>
                </Modal>
            </span>
        );
    }

    // 导入swagger注释
    importSwagger = () => {
        this.setState({importModalVisible: true});
    }
    // modal ok
    importModalOk() {
        this.genDataBySwagger(this.state.swagger);
        // this.importModalClose();
    }
    // modal close
    importModalClose() {
        this.setState({
            'importModalVisible': false,
            'swagger': '',
            'data': {}
        });
    }

    // 输入框改变事件
    handleChange (event) {
        this.setState({'swagger': event.target.value});
    }

    // 根据输入的swagger注释生成data
    genDataBySwagger (swagger) {
        var data = JSON.parse(JSON.stringify(this.state.dataDefault));
        var tmp;
        // return
        if (/@OA\\Response\(/.test(swagger)) {
            tmp = swagger.split(/@OA\\Response\(/);
            swagger = tmp[0];
            var returnStr = tmp[tmp.length-1];
            data.return = this.geneBody(returnStr);
        }

        // body
        if (/@OA\\RequestBody\(/.test(swagger)) {
            tmp = swagger.split(/@OA\\RequestBody\(/);
            swagger = tmp[0];
            var bodyStr = tmp[tmp.length-1];
            data.bodyParam = this.geneBody(bodyStr);
        }

        var swaggerArr = swagger.split("\n");
        var paramAttr = ['name', 'description', 'type', 'required'];
        var res;
        for (var i in swaggerArr) {
            // method
            res = /@OA\\((GET)|(POST)|(PUT)|(DELETE)|(PATCH))\(/i.exec(swaggerArr[i])
            if (res instanceof Array && typeof res[1] === 'string') {
                data.method = res[1].toUpperCase();
                continue;
            }
            // path
            res = /path="(.+)"/.exec(swaggerArr[i]);
            if (res instanceof Array && typeof res[1] === 'string') {
                data.path = res[1];
                continue;
            }
            // summary
            res = /summary="(.+)"/.exec(swaggerArr[i]);
            if (res instanceof Array && typeof res[1] === 'string') {
                data.summary = res[1];
                continue;
            }
            // tags
            res = /tags=\{"(.+)"\}/g.exec(swaggerArr[i]);
            if (res instanceof Array && typeof res[1] === 'string') {
                data.tags = res[1].split(/"\s*,\s*"/);
                continue;
            }
            // pathParam、 queryParam
            res = /@OA\\Parameter\((.*in="((path)|(query))".*)\)\s*,\s*$/.exec(swaggerArr[i]);
            if (res instanceof Array && typeof res[1] === 'string' && typeof res[2] === 'string') {
                var parameter = {'name': '', 'type': 'string', 'description': '', 'required': false};
                var attrRes;
                for (var j in paramAttr) {
                    attrRes = new RegExp(paramAttr[j] + '=(("[^"]+")|((true)|(false)))').exec(res[1]);
                    if (attrRes instanceof Array && typeof attrRes[1] === 'string') {
                        if (paramAttr[j] === 'required') {
                            parameter[paramAttr[j]] = attrRes[1] === 'true' ? true : false ;
                        } else {
                            parameter[paramAttr[j]] = attrRes[1].replace(/"/g,'');
                        }
                    }
                }

                // path还是query
                if (res[2] === 'path') {
                    data.pathParam.push(parameter);
                } else {
                    data.queryParam.push(parameter);
                }
                continue;
            }
        }

        this.props.onStateChangeAll(data);
        this.importModalClose();
    }

    geneBody (swagger) {
        var swaggerArr = swagger.split("\n");
        var stack = [];// 栈
        var paramAttr = ['property', 'description', 'type'];
        var bodyObj = this.state.dataDefault.bodyParam;

        for (var i in swaggerArr) {
            var parameter = {};
            var attrRes = [];
            // object
            if (
                /@OA\\Schema\(/.test(swaggerArr[i])
                || /@OA\\JsonContent\(/.test(swaggerArr[i])
                || /@OA\\Property\(.*type="object"/.test(swaggerArr[i])
                || /@OA\\Items\(((.*type="object")|(\s*\)?,?)$)/.test(swaggerArr[i])
            ) {
                parameter = {'property': 'root', 'type': 'object', 'description': '', 'child': []};
                attrRes = [];
                for (var j in paramAttr) {
                    attrRes = new RegExp(paramAttr[j] + '="([^"]+)"').exec(swaggerArr[i]);
                    if (attrRes instanceof Array && typeof attrRes[1] === 'string') {
                        parameter[paramAttr[j]] = attrRes[1];
                    }
                }

            // array
            } else if (/@OA\\((Property)|(Items))\(.*type="array"/.test(swaggerArr[i])) {
                parameter = {'property': 'root', 'type': 'array', 'description': '', 'child': {}};
                attrRes = [];
                for (var g in paramAttr) {
                    attrRes = new RegExp(paramAttr[g] + '="([^"]+)"').exec(swaggerArr[i]);
                    if (attrRes instanceof Array && typeof attrRes[1] === 'string') {
                        parameter[paramAttr[g]] = attrRes[1];
                    }
                }

            // 标量
            }else if (/@OA\\((Property)|(Items))\(.*type="((string)|(integer)|(boolean)|(float))"?/.test(swaggerArr[i])) {
                parameter = {'property': 'root', 'type': 'string', 'description': ''};
                attrRes = [];
                for (var k in paramAttr) {
                    attrRes = new RegExp(paramAttr[k] + '="([^"]+)"').exec(swaggerArr[i]);
                    if (attrRes instanceof Array && typeof attrRes[1] === 'string') {
                        parameter[paramAttr[k]] = attrRes[1];
                    }
                }
            }

            if (/\(/.test(swaggerArr[i])) {
                if (JSON.stringify(parameter) !== '{}') {
                    stack.push(parameter);// 塞入栈
                }
            }
            if (/\)/.test(swaggerArr[i])) {
                if (stack.length > 0) {
                    if (stack.length === 1) {
                        bodyObj = stack.pop();
                    } else {
                        var item = stack.pop();
                        for (var l = stack.length - 1; l >= 0; l--) {
                            if (stack[l].type === 'object') {
                                stack[l].child.push(item);
                                break;
                            } else if (stack[l].type === 'array') {
                                stack[l].child = item;
                                break;
                            } else {
                                continue;
                            }
                        }
                    }
                }
            }
        }

        return bodyObj;
    }
}

export default ImportComponent;