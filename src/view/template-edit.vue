<template>
    <div class="box" ref="box" @contextmenu.prevent>
        <div class="editor">
            <div class="toolbars">
                <b>修改模式：</b>
                <button v-on:click="changeMode('DESIGN')">
                    设置为设计模式
                </button>
                <button v-on:click="changeMode('EDITOR')">
                    设置为编辑模式
                </button>
                <button v-on:click="changeMode('STRICT')">
                    设置为严格（表单）模式
                </button>
                <button v-on:click="changeMode('READONLY')">
                    设置为只读模式
                </button>
                <button v-on:click="getMode()">获取当前模式</button>
                <br />
                <b>内部方法：</b>
                <button v-on:click="saveTemplate()">保存当前模板</button>
                ><input
                    type="text"
                    v-model="templateTypeToSave"
                    placeholder="请输入模板名称"
                />
                <button v-on:click="getTemplate()">加载模板</button>
                ><input
                    type="text"
                    v-model="templateTypeToGet"
                    placeholder="请输入模板名称"
                />
                <button v-on:click="getHTML()">获取编辑器内容</button>
                <br />
            </div>
            <div style="margin: 0 auto">
                <sde-editor ref="sdeEditor"></sde-editor>
            </div>
        </div>
    </div>
</template>
<script>
import sdeEditor from "../components/sdeEditor";
import axios from "axios";
var config = require("../../config/api-config");
export default {
    components: {
        sdeEditor,
    },
    data() {
        return {
            templateTypeToSave: "",
            templateTypeToGet: "",
        };
    },
    mounted() {},
    created() {},
    methods: {
        execCommand(cmd) {
            this.$refs.sdeEditor.execCommand(cmd);
        },
        changeMode(mode) {
            this.$refs.sdeEditor.mode(mode);
        },
        getMode() {
            alert(this.$refs.sdeEditor.mode());
        },
        getHTML() {
            console.log(this.$refs.sdeEditor.getHTML());
        },
        setHTML() {
            this.$refs.sdeEditor.setHTML(this.txthtml);
            console.log(11111)
            console.log(this.$refs.sdeEditor.sde
                            .getControlById("zhusu-section"))
        },
        importXML() {
            const xml = `<?xml version="1.0" encoding="UTF-8"?><xml><controls><id /><type>label</type><value>&lt;span class=&quot;sde-ctrl sde-label&quot; id=&quot;&quot; sde-type=&quot;label&quot; title=&quot;&quot;&gt;基本信息&lt;/span&gt;</value></controls><controls><id /><type>label</type><value>基本信息</value></controls><controls><id>1</id><type>label</type><value>编号：</value></controls><controls><id>patient-id</id><type>text</type><value /></controls><controls><id /><type>label</type><value>姓名：&lt;span class=&quot;sde-ctrl&quot; contenteditable=&quot;false&quot; id=&quot;patient-name&quot; sde-type=&quot;text&quot; sde-right=&quot;.&quot; sde-model=&quot;%7B%22desc%22%3A%22%E7%97%85%E4%BA%BA%E5%A7%93%E5%90%8D%22%2C%22required%22%3A1%2C%22strictverify%22%3A1%2C%22notdel%22%3A1%2C%22verify%22%3A%22%5C%5CS%22%2C%22mode%22%3A%22EDITOR%22%7D&quot; sde-isloadasyncdata=&quot;false&quot;&gt;&lt;span class=&quot;sde-value&quot; contenteditable=&quot;true&quot; sde-left=&quot;[&quot; sde-right=&quot;]&quot; title=&quot;病人姓名&quot; _backups=&quot;&quot;&gt;病人姓名&lt;/span&gt;&lt;/span&gt;</value></controls><controls><id>patient-name</id><type>text</type><value /></controls><html>%3Cp%20style%3D%22text-align%3A%20center%3B%22%3E%3Cspan%20class%3D%22sde-ctrl%20sde-label%22%20sde-type%3D%22label%22%20title%3D%22%E7%BC%96%E5%8F%B7%22%20sde-model%3D%22%257B%2522desc%2522%253A%2522%25E7%25BC%2596%25E5%258F%25B7%2522%257D%22%20contenteditable%3D%22true%22%20sde-isloadasyncdata%3D%22false%22%3E%3Cspan%20class%3D%22sde-ctrl%20sde-label%22%20id%3D%22%22%20sde-type%3D%22label%22%20title%3D%22%22%3E%E5%9F%BA%E6%9C%AC%E4%BF%A1%E6%81%AF%3C%2Fspan%3E%3C%2Fspan%3E%3C%2Fp%3E%3Cp%3E%3Cspan%20class%3D%22sde-ctrl%20sde-label%22%20id%3D%221%22%20sde-type%3D%22label%22%20title%3D%22%E7%BC%96%E5%8F%B7%22%20sde-model%3D%22%257B%2522desc%2522%253A%2522%25E7%25BC%2596%25E5%258F%25B7%2522%257D%22%20contenteditable%3D%22true%22%20sde-isloadasyncdata%3D%22false%22%3E%E7%BC%96%E5%8F%B7%EF%BC%9A%3C%2Fspan%3E%26nbsp%3B%3Cspan%20class%3D%22sde-ctrl%22%20contenteditable%3D%22false%22%20id%3D%22patient-id%22%20sde-type%3D%22text%22%20sde-right%3D%22.%22%20sde-model%3D%22%257B%2522desc%2522%253A%2522%25E7%2597%2585%25E4%25BA%25BA%25E7%25BC%2596%25E5%258F%25B7%2522%252C%2522required%2522%253A1%252C%2522strictverify%2522%253A1%252C%2522notdel%2522%253A1%252C%2522verify%2522%253A%2522%255E%255B0-9%255D*%2524%2522%252C%2522mode%2522%253A%2522EDITOR%2522%257D%22%20sde-isloadasyncdata%3D%22false%22%3E%3Cspan%20class%3D%22sde-value%22%20contenteditable%3D%22true%22%20sde-left%3D%22%5B%22%20sde-right%3D%22%5D%22%20title%3D%22%E7%97%85%E4%BA%BA%E7%BC%96%E5%8F%B7%22%20_backups%3D%22%22%3E%E7%97%85%E4%BA%BA%E7%BC%96%E5%8F%B7%3C%2Fspan%3E%3C%2Fspan%3E%26nbsp%3B%26nbsp%3B%3C%2Fp%3E%3Cp%3E%3Cspan%20class%3D%22sde-ctrl%20sde-label%22%20id%3D%22%22%20sde-type%3D%22label%22%20title%3D%22%22%20contenteditable%3D%22true%22%20sde-isloadasyncdata%3D%22false%22%3E%E5%A7%93%E5%90%8D%EF%BC%9A%3Cspan%20class%3D%22sde-ctrl%22%20contenteditable%3D%22false%22%20id%3D%22patient-name%22%20sde-type%3D%22text%22%20sde-right%3D%22.%22%20sde-model%3D%22%257B%2522desc%2522%253A%2522%25E7%2597%2585%25E4%25BA%25BA%25E5%25A7%2593%25E5%2590%258D%2522%252C%2522required%2522%253A1%252C%2522strictverify%2522%253A1%252C%2522notdel%2522%253A1%252C%2522verify%2522%253A%2522%255C%255CS%2522%252C%2522mode%2522%253A%2522EDITOR%2522%257D%22%20sde-isloadasyncdata%3D%22false%22%3E%3Cspan%20class%3D%22sde-value%22%20contenteditable%3D%22true%22%20sde-left%3D%22%5B%22%20sde-right%3D%22%5D%22%20title%3D%22%E7%97%85%E4%BA%BA%E5%A7%93%E5%90%8D%22%20_backups%3D%22%22%3E%E7%97%85%E4%BA%BA%E5%A7%93%E5%90%8D%3C%2Fspan%3E%3C%2Fspan%3E%3C%2Fspan%3E%3C%2Fp%3E%3Cp%3E%3C%2Fp%3E</html></xml>`;
            this.$refs.sdeEditor.sde.importXML(xml);
        },
        import(xml) {
            // const xml = `<?xml version="1.0" encoding="UTF-8"?><xml><controls><id /><type>label</type><value>&lt;span class=&quot;sde-ctrl sde-label&quot; id=&quot;&quot; sde-type=&quot;label&quot; title=&quot;&quot;&gt;基本信息&lt;/span&gt;</value></controls><controls><id /><type>label</type><value>基本信息</value></controls><controls><id>1</id><type>label</type><value>编号：</value></controls><controls><id>patient-id</id><type>text</type><value /></controls><controls><id /><type>label</type><value>姓名：&lt;span class=&quot;sde-ctrl&quot; contenteditable=&quot;false&quot; id=&quot;patient-name&quot; sde-type=&quot;text&quot; sde-right=&quot;.&quot; sde-model=&quot;%7B%22desc%22%3A%22%E7%97%85%E4%BA%BA%E5%A7%93%E5%90%8D%22%2C%22required%22%3A1%2C%22strictverify%22%3A1%2C%22notdel%22%3A1%2C%22verify%22%3A%22%5C%5CS%22%2C%22mode%22%3A%22EDITOR%22%7D&quot; sde-isloadasyncdata=&quot;false&quot;&gt;&lt;span class=&quot;sde-value&quot; contenteditable=&quot;true&quot; sde-left=&quot;[&quot; sde-right=&quot;]&quot; title=&quot;病人姓名&quot; _backups=&quot;&quot;&gt;病人姓名&lt;/span&gt;&lt;/span&gt;</value></controls><controls><id>patient-name</id><type>text</type><value /></controls><html>%3Cp%20style%3D%22text-align%3A%20center%3B%22%3E%3Cspan%20class%3D%22sde-ctrl%20sde-label%22%20sde-type%3D%22label%22%20title%3D%22%E7%BC%96%E5%8F%B7%22%20sde-model%3D%22%257B%2522desc%2522%253A%2522%25E7%25BC%2596%25E5%258F%25B7%2522%257D%22%20contenteditable%3D%22true%22%20sde-isloadasyncdata%3D%22false%22%3E%3Cspan%20class%3D%22sde-ctrl%20sde-label%22%20id%3D%22%22%20sde-type%3D%22label%22%20title%3D%22%22%3E%E5%9F%BA%E6%9C%AC%E4%BF%A1%E6%81%AF%3C%2Fspan%3E%3C%2Fspan%3E%3C%2Fp%3E%3Cp%3E%3Cspan%20class%3D%22sde-ctrl%20sde-label%22%20id%3D%221%22%20sde-type%3D%22label%22%20title%3D%22%E7%BC%96%E5%8F%B7%22%20sde-model%3D%22%257B%2522desc%2522%253A%2522%25E7%25BC%2596%25E5%258F%25B7%2522%257D%22%20contenteditable%3D%22true%22%20sde-isloadasyncdata%3D%22false%22%3E%E7%BC%96%E5%8F%B7%EF%BC%9A%3C%2Fspan%3E%26nbsp%3B%3Cspan%20class%3D%22sde-ctrl%22%20contenteditable%3D%22false%22%20id%3D%22patient-id%22%20sde-type%3D%22text%22%20sde-right%3D%22.%22%20sde-model%3D%22%257B%2522desc%2522%253A%2522%25E7%2597%2585%25E4%25BA%25BA%25E7%25BC%2596%25E5%258F%25B7%2522%252C%2522required%2522%253A1%252C%2522strictverify%2522%253A1%252C%2522notdel%2522%253A1%252C%2522verify%2522%253A%2522%255E%255B0-9%255D*%2524%2522%252C%2522mode%2522%253A%2522EDITOR%2522%257D%22%20sde-isloadasyncdata%3D%22false%22%3E%3Cspan%20class%3D%22sde-value%22%20contenteditable%3D%22true%22%20sde-left%3D%22%5B%22%20sde-right%3D%22%5D%22%20title%3D%22%E7%97%85%E4%BA%BA%E7%BC%96%E5%8F%B7%22%20_backups%3D%22%22%3E%E7%97%85%E4%BA%BA%E7%BC%96%E5%8F%B7%3C%2Fspan%3E%3C%2Fspan%3E%26nbsp%3B%26nbsp%3B%3C%2Fp%3E%3Cp%3E%3Cspan%20class%3D%22sde-ctrl%20sde-label%22%20id%3D%22%22%20sde-type%3D%22label%22%20title%3D%22%22%20contenteditable%3D%22true%22%20sde-isloadasyncdata%3D%22false%22%3E%E5%A7%93%E5%90%8D%EF%BC%9A%3Cspan%20class%3D%22sde-ctrl%22%20contenteditable%3D%22false%22%20id%3D%22patient-name%22%20sde-type%3D%22text%22%20sde-right%3D%22.%22%20sde-model%3D%22%257B%2522desc%2522%253A%2522%25E7%2597%2585%25E4%25BA%25BA%25E5%25A7%2593%25E5%2590%258D%2522%252C%2522required%2522%253A1%252C%2522strictverify%2522%253A1%252C%2522notdel%2522%253A1%252C%2522verify%2522%253A%2522%255C%255CS%2522%252C%2522mode%2522%253A%2522EDITOR%2522%257D%22%20sde-isloadasyncdata%3D%22false%22%3E%3Cspan%20class%3D%22sde-value%22%20contenteditable%3D%22true%22%20sde-left%3D%22%5B%22%20sde-right%3D%22%5D%22%20title%3D%22%E7%97%85%E4%BA%BA%E5%A7%93%E5%90%8D%22%20_backups%3D%22%22%3E%E7%97%85%E4%BA%BA%E5%A7%93%E5%90%8D%3C%2Fspan%3E%3C%2Fspan%3E%3C%2Fspan%3E%3C%2Fp%3E%3Cp%3E%3C%2Fp%3E</html></xml>`;
            this.$refs.sdeEditor.sde.importXML(xml);
        },
        exportXML() {
            alert(this.$refs.sdeEditor.sde.exportXML());
        },
        downloadXML() {
            this.$refs.sdeEditor.sde.downloadXML();
        },
        saveTemplate() {
            const xml = this.$refs.sdeEditor.sde.exportXML();
            console.log(xml);
            let that = this;

            axios
                .post(config.url + "/record-template", {
                    recordType: that.templateTypeToSave,
                    template: xml,
                })
                .then(function (response) {
                    console.log(response);
                });
        },
        getTemplate() {
            let that = this;
            console.log(that.templateTypeToGet);
            axios
                .get(
                    config.url +
                        "/record-template?recordType=" +
                        that.templateTypeToGet
                )
                .then(function (response) {
                    console.log(response.data);

                    if (response.data.ok) {
                        that.$refs.sdeEditor.sde.importXML(
                            response.data.template
                        );
                    }
                });
        },
    },
};
</script>
<style scoped>
.box {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    overflow: hidden;
    background: #ffffff;
}

/*右侧div'样式*/
.editor {
    float: left;
    width: 100%; /*右侧初始化宽度*/
    height: 100%;
    background: #fff;
}
.toolbars {
    line-height: 30px;
    margin-bottom: 20px;
}
.toolbars button {
    margin-left: 10px;
}
.dragstart {
    margin-left: 15px;
    cursor: move;
}
.dragstart:hover {
    border: 1px solid rgb(142, 243, 182);
}
</style>

