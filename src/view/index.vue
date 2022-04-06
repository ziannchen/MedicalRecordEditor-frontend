<template>
    <div class="box" ref="box" @contextmenu.prevent>
        <div class="menu" id="app" ref="left" @contextmenu.prevent>
            <leftMenu
                v-if="treeData.length != 0"
                v-bind:menuData="treeData"
                @contextmenu.prevent
            >
            </leftMenu>
        </div>
        <div class="resize" title="收缩侧边栏" ref="resize"></div>
        <div class="editor">
            <h1>example for SDE v4</h1>
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
                <button v-on:click="postTemplate()">上传模板</button>
                <button v-on:click="saveRecord()">保存当前病历</button>
                <button v-on:click="importXML()">导入xml</button>
                <button v-on:click="exportXML()">导出xml</button>
                <button v-on:click="downloadXML()">下载xml</button>
                <button v-on:click="getHTML()">获取编辑器内容</button>
                <button v-on:click="setHTML()">设置编辑器内容</button
                ><input
                    type="text"
                    v-model="txthtml"
                    placeholder="请输入html内容"
                />
                <br />
            </div>
            <div style="margin: 0 auto">
                <sde-editor ref="sdeEditor"></sde-editor>
            </div>
        </div>
    </div>
</template>
<script>
import leftMenu from "../components/leftMenu.vue";
import sdeEditor from "../components/sdeEditor";
import axios from "axios";
import { EventBus } from "../event-bus.js";
var config = require("../../config/api-config");
export default {
    components: {
        sdeEditor,
        leftMenu,
    },
    data() {
        return {
            txthtml: "",
            treeData: [],
            currId: -1,
            currType: "",
        };
    },
    mounted() {
        this.dragControllerDiv();
        EventBus.$on("note-a", ({ id, name }) => {
            console.log("receive:" + id, name);
            this.currId = id;
            this.currType = "A";
            // this.importXML(xml);
            this.loadRecord(id, "A", name);
        });
    },
    created() {
        let that = this;
        axios.get(config.url + "/departments").then(function (response) {
            var jsonData = response.data.departments;
            console.log("get json");
            console.log(jsonData);
            let myMap = new Map();
            for (var i = 0; i < jsonData.length; i++) {
                if (!myMap.has(jsonData[i].First)) {
                    myMap.set(jsonData[i].First, new Map());
                }

                if (!myMap.get(jsonData[i].First).has(jsonData[i].Second)) {
                    myMap
                        .get(jsonData[i].First)
                        .set(jsonData[i].Second, new Array());
                }

                myMap
                    .get(jsonData[i].First)
                    .get(jsonData[i].Second)
                    .push([jsonData[i].Name, jsonData[i].Id]);
            }
            var result = [];
            for (const First of myMap.keys()) {
                var currentFirst = {};
                currentFirst.title = First;
                currentFirst.expand = false;

                currentFirst.children = [];
                var internalMap = myMap.get(First);
                for (const Second of internalMap.keys()) {
                    var currentSecond = {};
                    currentSecond.title = Second;
                    currentSecond.expand = false;
                    currentSecond.children = [];
                    var nameList = internalMap.get(Second);
                    for (const name of nameList) {
                        var currentName = {};
                        currentName.title = name[0];
                        currentName.id = name[1];
                        currentName.expand = false;
                        currentName.contextmenu = true;
                        currentSecond.children.push(currentName);
                    }
                    currentFirst.children.push(currentSecond);
                }
                result.push(currentFirst);
            }
            that.treeData = result;
            console.log(that.treeData);
        });
    },
    methods: {
        dragControllerDiv() {
            var resize = document.getElementsByClassName("resize");
            var menu = document.getElementsByClassName("menu");
            var editor = document.getElementsByClassName("editor");
            var box = document.getElementsByClassName("box");

            for (let i = 0; i < resize.length; i++) {
                // 鼠标按下事件
                resize[i].onmousedown = function (e) {
                    //颜色改变提醒
                    resize[i].style.background = "#818181";
                    var startX = e.clientX;
                    resize[i].left = resize[i].offsetLeft;
                    // 鼠标拖动事件
                    document.onmousemove = function (e) {
                        var endX = e.clientX;
                        var moveLen = resize[i].left + (endX - startX); // （endx-startx）=移动的距离。resize[i].left+移动的距离=左边区域最后的宽度
                        var maxT = box[i].clientWidth - resize[i].offsetWidth; // 容器宽度 - 左边区域的宽度 = 右边区域的宽度

                        if (moveLen < 32) moveLen = 32; // 左边区域的最小宽度为32px
                        if (moveLen > maxT - 150) moveLen = maxT - 150; //右边区域最小宽度为150px

                        resize[i].style.left = moveLen; // 设置左侧区域的宽度

                        for (let j = 0; j < menu.length; j++) {
                            menu[j].style.width = moveLen + "px";
                        }

                        for (let j = 0; j < editor.length; j++) {
                            editor[j].style.width =
                                box[i].clientWidth - moveLen - 10 + "px";
                        }
                    };
                    // 鼠标松开事件
                    document.onmouseup = function () {
                        //颜色恢复
                        resize[i].style.background = "#d6d6d6";
                        document.onmousemove = null;
                        document.onmouseup = null;
                        resize[i].releaseCapture && resize[i].releaseCapture(); //当你不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
                    };
                    resize[i].setCapture && resize[i].setCapture(); //该函数在属于当前线程的指定窗口里设置鼠标捕获
                    return false;
                };
            }
        },
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
            alert(this.$refs.sdeEditor.getHTML());
        },
        setHTML() {
            this.$refs.sdeEditor.setHTML(this.txthtml);
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
        postTemplate() {
            const xml = `<?xml version="1.0" encoding="UTF-8"?><xml><controls><id /><type>label</type><value>&lt;span class=&quot;sde-ctrl sde-label&quot; id=&quot;&quot; sde-type=&quot;label&quot; title=&quot;&quot;&gt;基本信息&lt;/span&gt;</value></controls><controls><id /><type>label</type><value>基本信息</value></controls><controls><id>1</id><type>label</type><value>编号：</value></controls><controls><id>patient-id</id><type>text</type><value /></controls><controls><id /><type>label</type><value>姓名：&lt;span class=&quot;sde-ctrl&quot; contenteditable=&quot;false&quot; id=&quot;patient-name&quot; sde-type=&quot;text&quot; sde-right=&quot;.&quot; sde-model=&quot;%7B%22desc%22%3A%22%E7%97%85%E4%BA%BA%E5%A7%93%E5%90%8D%22%2C%22required%22%3A1%2C%22strictverify%22%3A1%2C%22notdel%22%3A1%2C%22verify%22%3A%22%5C%5CS%22%2C%22mode%22%3A%22EDITOR%22%7D&quot; sde-isloadasyncdata=&quot;false&quot;&gt;&lt;span class=&quot;sde-value&quot; contenteditable=&quot;true&quot; sde-left=&quot;[&quot; sde-right=&quot;]&quot; title=&quot;病人姓名&quot; _backups=&quot;&quot;&gt;病人姓名&lt;/span&gt;&lt;/span&gt;</value></controls><controls><id>patient-name</id><type>text</type><value /></controls><html>%3Cp%20style%3D%22text-align%3A%20center%3B%22%3E%3Cspan%20class%3D%22sde-ctrl%20sde-label%22%20sde-type%3D%22label%22%20title%3D%22%E7%BC%96%E5%8F%B7%22%20sde-model%3D%22%257B%2522desc%2522%253A%2522%25E7%25BC%2596%25E5%258F%25B7%2522%257D%22%20contenteditable%3D%22true%22%20sde-isloadasyncdata%3D%22false%22%3E%3Cspan%20class%3D%22sde-ctrl%20sde-label%22%20id%3D%22%22%20sde-type%3D%22label%22%20title%3D%22%22%3E%E5%9F%BA%E6%9C%AC%E4%BF%A1%E6%81%AF%3C%2Fspan%3E%3C%2Fspan%3E%3C%2Fp%3E%3Cp%3E%3Cspan%20class%3D%22sde-ctrl%20sde-label%22%20id%3D%221%22%20sde-type%3D%22label%22%20title%3D%22%E7%BC%96%E5%8F%B7%22%20sde-model%3D%22%257B%2522desc%2522%253A%2522%25E7%25BC%2596%25E5%258F%25B7%2522%257D%22%20contenteditable%3D%22true%22%20sde-isloadasyncdata%3D%22false%22%3E%E7%BC%96%E5%8F%B7%EF%BC%9A%3C%2Fspan%3E%26nbsp%3B%3Cspan%20class%3D%22sde-ctrl%22%20contenteditable%3D%22false%22%20id%3D%22patient-id%22%20sde-type%3D%22text%22%20sde-right%3D%22.%22%20sde-model%3D%22%257B%2522desc%2522%253A%2522%25E7%2597%2585%25E4%25BA%25BA%25E7%25BC%2596%25E5%258F%25B7%2522%252C%2522required%2522%253A1%252C%2522strictverify%2522%253A1%252C%2522notdel%2522%253A1%252C%2522verify%2522%253A%2522%255E%255B0-9%255D*%2524%2522%252C%2522mode%2522%253A%2522EDITOR%2522%257D%22%20sde-isloadasyncdata%3D%22false%22%3E%3Cspan%20class%3D%22sde-value%22%20contenteditable%3D%22true%22%20sde-left%3D%22%5B%22%20sde-right%3D%22%5D%22%20title%3D%22%E7%97%85%E4%BA%BA%E7%BC%96%E5%8F%B7%22%20_backups%3D%22%22%3E%E7%97%85%E4%BA%BA%E7%BC%96%E5%8F%B7%3C%2Fspan%3E%3C%2Fspan%3E%26nbsp%3B%26nbsp%3B%3C%2Fp%3E%3Cp%3E%3Cspan%20class%3D%22sde-ctrl%20sde-label%22%20id%3D%22%22%20sde-type%3D%22label%22%20title%3D%22%22%20contenteditable%3D%22true%22%20sde-isloadasyncdata%3D%22false%22%3E%E5%A7%93%E5%90%8D%EF%BC%9A%3Cspan%20class%3D%22sde-ctrl%22%20contenteditable%3D%22false%22%20id%3D%22patient-name%22%20sde-type%3D%22text%22%20sde-right%3D%22.%22%20sde-model%3D%22%257B%2522desc%2522%253A%2522%25E7%2597%2585%25E4%25BA%25BA%25E5%25A7%2593%25E5%2590%258D%2522%252C%2522required%2522%253A1%252C%2522strictverify%2522%253A1%252C%2522notdel%2522%253A1%252C%2522verify%2522%253A%2522%255C%255CS%2522%252C%2522mode%2522%253A%2522EDITOR%2522%257D%22%20sde-isloadasyncdata%3D%22false%22%3E%3Cspan%20class%3D%22sde-value%22%20contenteditable%3D%22true%22%20sde-left%3D%22%5B%22%20sde-right%3D%22%5D%22%20title%3D%22%E7%97%85%E4%BA%BA%E5%A7%93%E5%90%8D%22%20_backups%3D%22%22%3E%E7%97%85%E4%BA%BA%E5%A7%93%E5%90%8D%3C%2Fspan%3E%3C%2Fspan%3E%3C%2Fspan%3E%3C%2Fp%3E%3Cp%3E%3C%2Fp%3E</html></xml>`;
            axios
                .post(config.url + "/record-template", {
                    noteType: "1",
                    template: xml,
                })
                .then(function (response) {
                    console.log(response);
                });
        },
        saveRecord() {
            const xml = this.$refs.sdeEditor.sde.exportXML();
            axios
                .post(config.url + "/medical-record", {
                    patientId: this.currId,
                    recordType: this.currType,
                    record: xml,
                })
                .then(function (response) {
                    console.log(response);
                });
        },
        loadRecord(id, type, name) {
            let that = this;
            axios
                .get(
                    config.url +
                        "/medical-record?patientId=" +
                        id +
                        "&recordType=" +
                        type
                )
                .then(function (response) {
                    console.log(response.data);
                    that.$refs.sdeEditor.sde.importXML(response.data.record);
                    if (!response.data.isRecord) {
                        that.$refs.sdeEditor.sde
                            .getControlById("patient-id")
                            .setValue(id);
                        that.$refs.sdeEditor.sde
                            .getControlById("patient-name")
                            .setValue(name);
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
/*左侧div样式*/
.menu {
    width: calc(20% - 3px); /*左侧初始化宽度*/
    height: 100%;
    float: left;
    background-color: #f0eded;
    user-select: none;
    overflow-y: scroll;
}
/*拖拽区div样式*/
.resize {
    cursor: col-resize;
    float: left;
    position: relative;
    top: 0;
    background-color: #868686;
    width: 3px;
    height: 100%;
    background-size: cover;
    background-position: center;
    /*z-index: 99999;*/
    color: white;
}
/*拖拽区鼠标悬停样式*/
.resize:hover {
    color: #444444;
}
/*右侧div'样式*/
.editor {
    float: left;
    width: 80%; /*右侧初始化宽度*/
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

