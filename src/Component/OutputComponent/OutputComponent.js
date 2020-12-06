import React from 'react';
import {Input} from 'antd';
const { TextArea } = Input;

class OutputComponent extends React.Component {

    // 构造函数
    constructor(props) {
        super(props);
    }

    render() {
        const swagger = this.genSwagger(this.props.data);
        return (
        <div className="OutputComponent">
            <TextArea style={{'resize':'none', 'border':'none', 'boxShadow':'none', 'color':'#777', 'whiteSpace':'pre', 'overflow':'scroll'}} readOnly rows={80} value={swagger}  >
            </TextArea>
        </div>
        );
    }

    // 生成swagger注释
    genSwagger(data) {
        const prefix = '*  ';
        var swagger = prefix + '@OA\\' + data.method + '(' + "\n";
        swagger += prefix + this.indent(4) +'path="' +data.path +'",' +"\n";
        if (data.tags.length > 0) {
            swagger += prefix + this.indent(4) +'tags={"' +data.tags.join('", "') +'"},' +"\n";
        }
        swagger += prefix + this.indent(4) +'summary="' +data.summary +'",' +"\n";
        if (data.pathParam.length > 0) {
            for (var i in data.pathParam) {
                swagger += prefix + this.indent(4) + '@OA\\Parameter(name="'
                + data.pathParam[i].name + '", in="path", description="'
                + data.pathParam[i].description + '", @OA\\Schema(type="'
                + data.pathParam[i].type + '")),' +"\n";
            }
        }
        if (data.queryParam.length > 0) {
            for (var j in data.queryParam) {
                swagger += prefix + this.indent(4) + '@OA\\Parameter(name="'
                + data.queryParam[j].name + '", in="query", description="'
                + data.queryParam[j].description + '", required='
                + (data.queryParam[j].required ? 'true' : 'false') + ', @OA\\Schema(type="'
                + data.queryParam[j].type + '")),' +"\n";
            }
        }
        // body
        if (data.bodyParam.child instanceof Array && data.bodyParam.child.length > 0) {
            swagger += prefix + this.indent(4) +'@OA\\RequestBody(@OA\\JsonContent(' +"\n";
            swagger += this.genObject(data.bodyParam, 1, prefix);
            swagger += prefix + this.indent(8) + 'example=' + data.bodyExample +"\n";
            swagger += prefix + this.indent(4) + ')),' +"\n";
        }
        // return
        if (data.return.child instanceof Array && data.return.child.length > 0) {
            swagger += prefix + this.indent(4) +'@OA\\Response(' +"\n";
            swagger += prefix + this.indent(8) +'response=200,' +"\n";
            swagger += prefix + this.indent(8) +'description="SUCCESS/成功",' +"\n";
            swagger += prefix + this.indent(8) +'@OA\\MediaType(' +"\n";
            swagger += prefix + this.indent(12) +'mediaType="application/json",' +"\n";
            swagger += prefix + this.indent(12) +'@OA\\Schema(' +"\n";
            swagger += this.genObject(data.return, 1, prefix + this.indent(8));
            swagger += prefix + this.indent(12) +'),' +"\n";
            swagger += prefix + this.indent(12) +'example=' + data.returnExample +"\n";
            swagger += prefix + this.indent(8) +'),' +"\n";
            swagger += prefix + this.indent(4) +'),' +"\n";
        }
        swagger += prefix + ')' + "\n";

        return swagger;
    }

    // 缩进空格
    indent(num) {
        var str = '';
        while (true) {
            if (num <= 0) {
                break;
            }
            str += ' ';
            num--;
        }
        return str;
    }

    // 根据object转换
    genObject (data, level, prefix, parentType = null) {
        var swagger = '';
        if (level !== 1) {
            if (parentType === 'array') {
                swagger += prefix + this.indent(4*level) + '@OA\\Items(type="' + data.type + '",' + "\n";
            } else {
                swagger += prefix + this.indent(4*level) + '@OA\\Property(property="' + data.property + '", type="' + data.type + '", description="' + data.description + '",' + "\n";
            }
        }
        swagger += prefix + this.indent(4*(level+1)) + 'required={},' + "\n";
        if (data.child instanceof Array && data.child.length > 0) {
            for (var i in data.child) {
                switch (data.child[i].type) {
                    case 'object':
                        swagger += this.genObject(data.child[i], level+1, prefix, data.type);break;
                    case 'array':
                        swagger += this.genArray(data.child[i], level+1, prefix, data.type);break;
                    default:
                        swagger += prefix + this.indent(4*(level+1)) + '@OA\\Property(property="' + data.child[i].property + '", type="' + data.child[i].type + '", description="' + data.child[i].description + '"),' + "\n";
                        break;
                }
            }
        }

        if (level !== 1) {
            swagger += prefix + this.indent(4*level) + '),' + "\n";
        }

        return swagger;
    }

    // 根据array转换
    genArray(data, level, prefix, parentType = null) {
        var swagger = '';
        if (parentType === 'array') {
            swagger += prefix + this.indent(4*level) + '@OA\\Items(type="' + data.type + '",' + "\n";
        } else {
            swagger += prefix + this.indent(4*level) + '@OA\\Property(property="' + data.property + '", type="' + data.type + '", description="' + data.description + '",' + "\n";
        }
        if (data.child !== null && typeof data.child == 'object') {
            switch (data.child.type) {
                case 'object':
                    swagger += this.genObject(data.child, level+1, prefix, data.type);break;
                case 'array':
                    swagger += this.genArray(data.child, level+1, prefix, data.type);break;
                default:
                    swagger += prefix +this.indent(4*(level+1)) + '@OA\\Items(type="' + data.child.type + '"),' + "\n";
                    break;
            }
        }
        swagger += prefix + this.indent(4*level) + '),' + "\n";

        return swagger;
    }
}

export default OutputComponent;