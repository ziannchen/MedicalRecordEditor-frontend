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

                ><input
                    type="text"
                    v-model="templateNo"
                    placeholder="请输入模板编号"
                />
                ><input
                    type="text"
                    v-model="department"
                    placeholder="请输入模板科室"
                />
                ><input type="text" v-model="usageType" placeholder="类别" />
                ><input type="text" v-model="creater" placeholder="制作人" />
                ><input
                    type="text"
                    v-model="creationTime"
                    placeholder="制作日期"
                />
                ><input type="text" v-model="luruma" placeholder="录入码" />
                ><input type="text" v-model="status" placeholder="状态" />
                ><input type="text" v-model="comment" placeholder="说明" />

                <button v-on:click="getTemplate()">加载模板</button>
                ><input
                    type="text"
                    v-model="templateTypeToGet"
                    placeholder="请输入模板名称"
                />
                <br />
            </div>
            <div style="margin: 0 auto">
                <sde-editor
                    ref="sdeEditor"
                    :defaultToolbars="templateEditToolbars"
                ></sde-editor>
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
            templateNo: "",
            department: "",
            creater: "",
            usageType: "",
            creationTime: "",
            luruma: "",
            status: "",
            comment: "",
            templateEditToolbars: [
                {
                    name: "sde-toolbar-file",
                    title: "文件",
                    items: [
                        {
                            name: "sde-toolbar-file-file",
                            title: "文件管理",
                            items: [
                                {
                                    name: "openxml",
                                    title: "打开XML",
                                },
                                {
                                    name: "importxml",
                                    title: "下载XML",
                                },
                            ],
                        },
                        {
                            name: "test",
                            title: "测试扩展",
                            items: [
                                {
                                    name: "tt",
                                    title: "字符扩展", //这里是扩展toolbar，扩展有两种方式：方式一：
                                    render: function () {
                                        return `<div class="panel-content-ctrl" title="字符扩展"  onclick="alert('字符扩展')">
    <div class="sde-icon sde-icon-openxml" style="width: 40px; height: 32px; float: none;"></div>
    <div style="text-align: center;">字符扩展</div>
  </div>`;
                                    },
                                },
                                {
                                    name: "tt2",
                                    title: "对象扩展", //方式二：（推荐）
                                    render: function () {
                                        let div = document.createElement("div");
                                        div.innerHTML = `<div class="panel-content-ctrl" title="对象扩展" >
    <div class="sde-icon sde-icon-openxml" style="width: 40px; height: 32px; float: none;"></div>
    <div style="text-align: center;">对象扩展</div>
  </div>`;
                                        div = div.firstElementChild;
                                        div.addEventListener(
                                            "click",
                                            function () {
                                                alert("对象扩展");
                                            }
                                        );
                                        return div;
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    name: "sde-toolbar-editor",
                    title: "编辑",
                    items: [
                        {
                            name: "sde-toolbar-editor-history",
                            title: "历史记录",
                            items: [
                                {
                                    name: "drafts",
                                    title: "草稿箱",
                                },
                                {
                                    name: "undo",
                                    title: "撤销",
                                },
                                "|",
                                {
                                    name: "redo",
                                    title: "恢复",
                                },
                            ],
                        },
                        {
                            name: "sde-toolbar-editor-clipboard",
                            title: "剪切板",
                            items: [
                                {
                                    name: "paste",
                                    title: "粘贴",
                                },
                                {
                                    name: "copy",
                                    title: "复制",
                                },
                                "|",
                                {
                                    name: "cut",
                                    title: "剪切",
                                },
                            ],
                        },
                        {
                            name: "sde-toolbar-editor-fonts",
                            title: "字体",
                            items: [
                                {
                                    name: "fontfamily",
                                    title: "字体",
                                },
                                {
                                    name: "removeformat",
                                    title: "清除格式",
                                },
                                {
                                    name: "autotypeset",
                                    title: "自动格式化",
                                },
                                {
                                    name: "formatmatch",
                                    title: "格式刷",
                                },
                                "|",
                                {
                                    name: "fontsize",
                                    title: "字号",
                                },
                                {
                                    name: "upsize",
                                    title: "增大字体",
                                },
                                {
                                    name: "downsize",
                                    title: "缩小字体",
                                },
                                {
                                    name: "subscript",
                                    title: "上标",
                                },
                                {
                                    name: "superscript",
                                    title: "下标",
                                },
                                {
                                    name: "bold",
                                    title: "加粗",
                                },
                                {
                                    name: "italic",
                                    title: "倾斜",
                                },
                                {
                                    name: "underline",
                                    title: "下划线",
                                },
                                {
                                    name: "strikethrough",
                                    title: "删除线",
                                },
                                {
                                    name: "forecolor",
                                    title: "文字颜色",
                                },
                                {
                                    name: "backcolor",
                                    title: "背景颜色",
                                },
                            ],
                        },
                        {
                            name: "sde-toolbar-editor-paragraphs",
                            title: "段落",
                            items: [
                                {
                                    name: "justifyleft",
                                    title: "向左对齐",
                                },
                                {
                                    name: "justifycenter",
                                    title: "居中对齐",
                                },
                                {
                                    name: "justifyright",
                                    title: "向右对齐",
                                },
                                {
                                    name: "justifyjustify",
                                    title: "两端对齐",
                                },
                                {
                                    name: "blockquote",
                                    title: "引用",
                                },
                                {
                                    name: "blockindent",
                                    title: "增加缩进",
                                },
                                {
                                    name: "blockoutdent",
                                    title: "减小缩进",
                                },
                                "|",
                                {
                                    name: "unorderedlist",
                                    title: "无序编号",
                                },
                                {
                                    name: "orderedlist",
                                    title: "有序编号",
                                },
                                {
                                    name: "rowspacingtop",
                                    title: "段前距",
                                },
                                {
                                    name: "rowspacingbottom",
                                    title: "段后距",
                                },
                                {
                                    name: "lineheight",
                                    title: "行高",
                                },
                            ],
                        },
                    ],
                },
                {
                    name: "sde-toolbar-insert",
                    title: "插入",
                    items: [
                        {
                            name: "sde-toolbar-insert-pagebreak",
                            title: "分页符",
                            items: [
                                {
                                    name: "pagebreak",
                                    title: "分页符",
                                },
                            ],
                        },
                        {
                            name: "sde-toolbar-insert-spechars",
                            title: "字符",
                            items: [
                                {
                                    name: "spechars",
                                    title: "字符",
                                },
                            ],
                        },
                        {
                            name: "sde-toolbar-insert-links",
                            title: "链接",
                            items: [
                                {
                                    name: "insertlink",
                                    title: "添加链接",
                                },
                                "|",
                                {
                                    name: "unlink",
                                    title: "取消链接",
                                },
                            ],
                        },
                        {
                            name: "sde-toolbar-insert-images",
                            title: "图片",
                            items: [
                                {
                                    name: "insertimage",
                                    title: "图片管理",
                                },
                                {
                                    name: "simpleupload",
                                    title: "插入",
                                },
                                {
                                    name: "emotion",
                                    title: "表情",
                                },
                                {
                                    name: "vectordiagram",
                                    title: "矢量图",
                                },
                                "|",
                                {
                                    name: "snapscreen",
                                    title: "截屏",
                                },
                                {
                                    name: "scrawl",
                                    title: "涂鸦",
                                },
                            ],
                        },
                        {
                            name: "sde-toolbar-insert-map",
                            title: "地图",
                            items: [
                                {
                                    name: "map",
                                    title: "地图",
                                },
                            ],
                        },
                        {
                            name: "sde-toolbar-insert-insertcode",
                            title: "代码",
                            items: [
                                {
                                    name: "insertcode",
                                    title: "代码",
                                },
                            ],
                        },
                        {
                            name: "sde-toolbar-insert-table",
                            title: "表格",
                            items: [
                                {
                                    name: "inserttable",
                                    title: "表格",
                                },
                            ],
                        },
                        {
                            name: "sde-toolbar-insert-kityformula",
                            title: "公式",
                            items: [
                                {
                                    name: "kityformula",
                                    title: "公式",
                                },
                            ],
                        },
                        {
                            name: "sde-toolbar-insert-blockcomment",
                            title: "批注",
                            items: [
                                {
                                    name: "blockcomment",
                                    title: "批注",
                                },
                            ],
                        },
                    ],
                },
                {
                    name: "sde-toolbar-table",
                    title: "表格",
                    items: [
                        {
                            name: "sde-toolbar-table-table",
                            title: "表格",
                            items: [
                                {
                                    name: "inserttable",
                                    title: "插入表格",
                                },
                                {
                                    name: "deletetable",
                                    title: "删除表格",
                                },
                                {
                                    name: "insertrow",
                                    title: "插入行",
                                },
                                {
                                    name: "insertcol",
                                    title: "插入列",
                                },
                                "|",
                                {
                                    name: "deleterow",
                                    title: "删除行",
                                },
                                {
                                    name: "deletecol",
                                    title: "删除列",
                                },
                            ],
                        },
                        {
                            name: "sde-toolbar-table-merge",
                            title: "合并单元格",
                            items: [
                                {
                                    name: "mergecells",
                                    title: "合并单元格",
                                },
                                {
                                    name: "mergedown",
                                    title: "向下合并单元格",
                                },
                                {
                                    name: "mergeright",
                                    title: "向右合并单元格",
                                },
                                "|",
                                {
                                    name: "splittocells",
                                    title: "拆分单元格",
                                },
                                {
                                    name: "splittocols",
                                    title: "单元格拆分成列",
                                },
                                {
                                    name: "splittorows",
                                    title: "单元格拆分成行",
                                },
                            ],
                        },
                        {
                            name: "sde-toolbar-table-alignmerge",
                            title: "对齐方向",
                            items: [
                                {
                                    name: "valign-top",
                                    title: "顶端对齐",
                                },
                                {
                                    name: "valign-middle",
                                    title: "垂直居中",
                                },
                                {
                                    name: "valign-bottom",
                                    title: "底端对齐",
                                },
                                "|",
                                {
                                    name: "align-left",
                                    title: "左对齐",
                                },
                                {
                                    name: "align-center",
                                    title: "居中",
                                },
                                {
                                    name: "align-right",
                                    title: "右对齐",
                                },
                            ],
                        },
                        {
                            name: "sde-toolbar-table-style",
                            title: "表格线样式",
                            items: [
                                {
                                    name: "tablestyle",
                                    title: "表格样式",
                                    items: [
                                        {
                                            title: "隐藏表格线",
                                            name: "tb-hide", //这里是具体的样式
                                        },
                                        {
                                            title: "设为实线",
                                            name: "tb-solid",
                                        },
                                        {
                                            title: "设为虚线",
                                            name: "tb-dotted",
                                        },
                                    ],
                                },
                                {
                                    name: "tablelowerframeline",
                                    title: "下框线",
                                },
                                {
                                    name: "tableupperframeline",
                                    title: "上框线",
                                },
                                {
                                    name: "tableleftframeline",
                                    title: "左框线",
                                },
                                {
                                    name: "tablerightframeline",
                                    title: "右框线",
                                },
                                {
                                    name: "tablenoborder",
                                    title: "无框线",
                                },
                                "|",
                                {
                                    name: "tableinternaltransverseline",
                                    title: "内部横线",
                                },
                                {
                                    name: "tableinternalverticalline",
                                    title: "内部竖线",
                                },
                                {
                                    name: "tableinsideborder",
                                    title: "内部框线",
                                },
                                {
                                    name: "tablelateralframeline",
                                    title: "外侧框线",
                                },
                                {
                                    name: "tableallframelines",
                                    title: "所有框线",
                                },
                            ],
                        },
                    ],
                },
                {
                    name: "sde-toolbar-views",
                    title: "视图",
                    items: [
                        {
                            name: "sde-toolbar-views-directory",
                            title: "目录",
                            items: [
                                {
                                    name: "directory",
                                    title: "显示目录",
                                },
                            ],
                        },
                        {
                            name: "sde-toolbar-views-comment",
                            title: "批注",
                            items: [
                                {
                                    name: "showcomment",
                                    title: "显示批注",
                                },
                            ],
                        },
                        {
                            name: "sde-toolbar-views-revise",
                            title: "修订",
                            items: [
                                {
                                    name: "revise",
                                    title: "修订",
                                },
                            ],
                        },
                        {
                            name: "sde-toolbar-views-preview",
                            title: "预览文档",
                            items: [
                                {
                                    name: "preview",
                                    title: "预览文档",
                                },
                            ],
                        },
                    ],
                },
                {
                    name: "sde-toolbar-tools",
                    title: "工具",
                    items: [
                        {
                            name: "sde-toolbar-tools-drafts",
                            title: "草稿箱",
                            items: [
                                {
                                    name: "drafts",
                                    title: "草稿箱",
                                },
                            ],
                        },
                        {
                            name: "sde-toolbar-tools-print",
                            title: "打印",
                            items: [
                                {
                                    name: "print",
                                    title: "普通打印",
                                },
                                {
                                    name: "seniorprint",
                                    title: "高级打印",
                                },
                            ],
                        },
                        {
                            name: "sde-toolbar-tools-search",
                            title: "搜索",
                            items: [
                                {
                                    name: "searchreplace",
                                    title: "查找替换",
                                },
                            ],
                        },
                        {
                            name: "sde-toolbar-tools-wordcount",
                            title: "字数统计",
                            items: [
                                {
                                    name: "wordcount",
                                    title: "字数统计",
                                },
                            ],
                        },
                    ],
                },
                {
                    name: "sde-toolbar-controls",
                    title: "病历控件",
                    items: [
                        {
                            name: "sde-toolbar-controls-sdetemplate",
                            title: "控件库",
                            items: [
                                {
                                    name: "sdetemplate",
                                    title: "控件库",
                                },
                            ],
                        },
                        {
                            name: "sde-toolbar-controls-controls",
                            title: "新增控件",
                            items: [
                                {
                                    name: "sdectrllabel",
                                    title: "标签控件",
                                },
                                {
                                    name: "sdectrltext",
                                    title: "单行文本",
                                },
                                {
                                    name: "sdectrlsection",
                                    title: "文档段",
                                },
                                {
                                    name: "sdectrlsummary",
                                    title: "文档节",
                                },
                                "|",
                                {
                                    name: "sdectrlselect",
                                    title: "下拉选择",
                                },
                                {
                                    name: "sdectrldate",
                                    title: "日期控件",
                                },
                                {
                                    name: "sdectrlradio",
                                    title: "单选框",
                                },
                                {
                                    name: "sdectrlcbx",
                                    title: "复选框",
                                },
                            ],
                        },
                        {
                            name: "sde-toolbar-controls-sdemode",
                            title: "模式设置",
                            items: [
                                {
                                    name: "sdemode",
                                    title: "模式设置",
                                },
                            ],
                        },
                    ],
                },
            ],
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
            console.log(11111);
            console.log(
                this.$refs.sdeEditor.sde.getControlById("zhusu-section")
            );
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
            const xml =
                '<?xml version="1.0" encoding="UTF-8"?><xml><controls><id>title-label</id><type>label</type><value>xxx医院</value></controls><controls><id>recordType-text</id><type>label</type><value>门诊复诊病历</value></controls><controls><id>name-label</id><type>label</type><value>姓名：</value></controls><controls><id>name-text</id><type>text</type><value /></controls><controls><id>ID-label</id><type>label</type><value>身份证号：</value></controls><controls><id>ID-text</id><type>text</type><value /></controls><controls><id>patientId-label</id><type>label</type><value>病人编号：</value></controls><controls><id>patientId-text</id><type>text</type><value /></controls><controls><id>visitTime-label</id><type>label</type><value>就诊时间：</value></controls><controls><id>visit-time</id><type>text</type><value /></controls><controls><id>category-label</id><type>label</type><value>科别：</value></controls><controls><id>department</id><type>text</type><value /></controls><controls><id>temperature-labell</id><type>label</type><value>体温：</value></controls><controls><id>temperature</id><type>text</type><value /></controls><controls><id>centigrade-label</id><type>label</type><value>℃</value></controls><controls><id>breaths-label</id><type>label</type><value>呼吸：</value></controls><controls><id>breaths</id><type>text</type><value /></controls><controls><id>huxi但未-label</id><type>label</type><value>次/min</value></controls><controls><id>maibo-text</id><type>label</type><value>脉搏：</value></controls><controls><id>pulse</id><type>text</type><value /></controls><controls><id>maibodanwei-text</id><type>label</type><value>次/min</value></controls><controls><id>xueya-text</id><type>label</type><value>血压：</value></controls><controls><id>blood-pressure</id><type>text</type><value /></controls><controls><id>xueyadanwei-label</id><type>label</type><value>mmHg</value></controls><controls><id>zs-text</id><type>label</type><value>主诉：</value></controls><controls><id>zhusu</id><type>text</type><value /></controls><controls><id>现病史-label</id><type>label</type><value>&lt;span class=&quot;sde-ctrl sde-label&quot; id=&quot;xbs-label&quot; sde-type=&quot;label&quot; title=&quot;&quot; contenteditable=&quot;true&quot; sde-isloadasyncdata=&quot;false&quot;&gt;&lt;span class=&quot;sde-ctrl sde-label&quot; id=&quot;xbs-label&quot; sde-type=&quot;label&quot; title=&quot;&quot; contenteditable=&quot;true&quot; sde-isloadasyncdata=&quot;false&quot;&gt;现病史：&lt;/span&gt;&amp;nbsp;&lt;/span&gt;&amp;nbsp;&lt;span class=&quot;sde-ctrl&quot; contenteditable=&quot;false&quot; id=&quot;xbs-text&quot; sde-type=&quot;text&quot; sde-right=&quot;.&quot; sde-model=&quot;%7B%22desc%22%3A%22%22%2C%22required%22%3A0%2C%22strictverify%22%3A0%2C%22notdel%22%3A0%2C%22verify%22%3A%22%22%2C%22mode%22%3A%22EDITOR%22%7D&quot; sde-isloadasyncdata=&quot;false&quot;&gt;&lt;span class=&quot;sde-value&quot; contenteditable=&quot;true&quot; sde-left=&quot;[&quot; sde-right=&quot;]&quot;&gt;&lt;/span&gt;&lt;/span&gt;</value></controls><controls><id>xbs-label</id><type>label</type><value>&lt;span class=&quot;sde-ctrl sde-label&quot; id=&quot;xbs-label&quot; sde-type=&quot;label&quot; title=&quot;&quot; contenteditable=&quot;true&quot; sde-isloadasyncdata=&quot;false&quot;&gt;现病史：&lt;/span&gt;&amp;nbsp;</value></controls><controls><id>xbs-label</id><type>label</type><value>现病史：</value></controls><controls><id>xbs-text</id><type>text</type><value /></controls><controls><id>jws-label</id><type>label</type><value>既往史：</value></controls><controls><id>既往史</id><type>text</type><value /></controls><controls><id>ct-label</id><type>label</type><value>查体：</value></controls><controls><id>查体</id><type>text</type><value /></controls><controls><id>zkqk-label</id><type>label</type><value>专科情况：</value></controls><controls><id>专科情况</id><type>text</type><value /></controls><controls><id>fzjc-label</id><type>label</type><value>辅助检查：</value></controls><controls><id>辅助检查</id><type>text</type><value /></controls><controls><id>cbpd-label</id><type>label</type><value>初步诊断：</value></controls><controls><id>初步诊断</id><type>text</type><value /></controls><controls><id>cl-label</id><type>label</type><value>处理：</value></controls><controls><id>处理</id><type>text</type><value /></controls><controls><id>ysqm</id><type>label</type><value>医生签名：</value></controls><controls><id>医生签名</id><type>text</type><value /></controls><html>%3Cp%20style%3D%22white-space%3A%20normal%3B%20text-align%3A%20center%3B%22%3E%3Cspan%20style%3D%22font-size%3A%2020px%3B%22%3E%3Cspan%20class%3D%22sde-ctrl%20sde-label%22%20id%3D%22title-label%22%20sde-type%3D%22label%22%20title%3D%22%22%20contenteditable%3D%22true%22%20sde-isloadasyncdata%3D%22false%22%3Exxx%E5%8C%BB%E9%99%A2%3C%2Fspan%3E%3C%2Fspan%3E%3C%2Fp%3E%3Cp%20style%3D%22white-space%3A%20normal%3B%20text-align%3A%20center%3B%22%3E%3Cspan%20style%3D%22font-size%3A%2020px%3B%22%3E%3Cspan%20style%3D%22font-size%3A%2018px%3B%22%3E%3Cspan%20class%3D%22sde-ctrl%20sde-label%22%20id%3D%22recordType-text%22%20sde-type%3D%22label%22%20title%3D%22%22%20contenteditable%3D%22true%22%20sde-isloadasyncdata%3D%22false%22%20sde-model%3D%22%257B%2522desc%2522%253A%2522%2522%257D%22%3E%E9%97%A8%E8%AF%8A%E5%A4%8D%E8%AF%8A%E7%97%85%E5%8E%86%3C%2Fspan%3E%3C%2Fspan%3E%3Cbr%3E%3C%2Fspan%3E%3C%2Fp%3E%3Cp%20style%3D%22white-space%3A%20normal%3B%22%3E%3Cspan%20class%3D%22sde-ctrl%20sde-label%22%20id%3D%22name-label%22%20sde-type%3D%22label%22%20title%3D%22%22%20contenteditable%3D%22true%22%20sde-isloadasyncdata%3D%22false%22%3E%E5%A7%93%E5%90%8D%EF%BC%9A%3C%2Fspan%3E%26nbsp%3B%3Cspan%20class%3D%22sde-ctrl%22%20contenteditable%3D%22false%22%20id%3D%22name-text%22%20sde-type%3D%22text%22%20sde-right%3D%22.%22%20sde-model%3D%22%257B%2522desc%2522%253A%2522%2522%252C%2522required%2522%253A0%252C%2522strictverify%2522%253A0%252C%2522notdel%2522%253A0%252C%2522verify%2522%253A%2522%2522%252C%2522mode%2522%253A%2522READONLY%2522%257D%22%20sde-isloadasyncdata%3D%22false%22%3E%3Cspan%20class%3D%22sde-value%22%20contenteditable%3D%22false%22%20sde-left%3D%22%5B%22%20sde-right%3D%22%5D%22%3E%3C%2Fspan%3E%3C%2Fspan%3E%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%3Cspan%20class%3D%22sde-ctrl%20sde-label%22%20id%3D%22ID-label%22%20sde-type%3D%22label%22%20title%3D%22%22%20contenteditable%3D%22true%22%20sde-isloadasyncdata%3D%22false%22%3E%E8%BA%AB%E4%BB%BD%E8%AF%81%E5%8F%B7%EF%BC%9A%3C%2Fspan%3E%26nbsp%3B%3Cspan%20class%3D%22sde-ctrl%22%20contenteditable%3D%22false%22%20id%3D%22ID-text%22%20sde-type%3D%22text%22%20sde-right%3D%22.%22%20sde-model%3D%22%257B%2522desc%2522%253A%2522%2522%252C%2522required%2522%253A0%252C%2522strictverify%2522%253A0%252C%2522notdel%2522%253A0%252C%2522verify%2522%253A%2522%2522%252C%2522mode%2522%253A%2522READONLY%2522%257D%22%20sde-isloadasyncdata%3D%22false%22%3E%3Cspan%20class%3D%22sde-value%22%20contenteditable%3D%22false%22%20sde-left%3D%22%5B%22%20sde-right%3D%22%5D%22%3E%3C%2Fspan%3E%3C%2Fspan%3E%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%26nbsp%3B%3Cspan%20class%3D%22sde-ctrl%20sde-label%22%20id%3D%22patientId-label%22%20sde-type%3D%22label%22%20title%3D%22%22%20contenteditable%3D%22true%22%20sde-isloadasyncdata%3D%22false%22%3E%E7%97%85%E4%BA%BA%E7%BC%96%E5%8F%B7%EF%BC%9A%3C%2Fspan%3E%26nbsp%3B%3Cspan%20class%3D%22sde-ctrl%22%20contenteditable%3D%22false%22%20id%3D%22patientId-text%22%20sde-type%3D%22text%22%20sde-right%3D%22.%22%20sde-model%3D%22%257B%2522desc%2522%253A%2522%2522%252C%2522required%2522%253A0%252C%2522strictverify%2522%253A0%252C%2522notdel%2522%253A0%252C%2522verify%2522%253A%2522%2522%252C%2522mode%2522%253A%2522READONLY%2522%257D%22%20sde-isloadasyncdata%3D%22false%22%3E%3Cspan%20class%3D%22sde-value%22%20contenteditable%3D%22false%22%20sde-left%3D%22%5B%22%20sde-right%3D%22%5D%22%3E%3C%2Fspan%3E%3C%2Fspan%3E%3C%2Fp%3E%3Cp%20style%3D%22white-space%3A%20normal%3B%22%3E%3Cspan%20style%3D%22font-size%3A%2018px%3B%22%3E%3Cspan%20style%3D%22font-size%3A%2016px%3B%22%3E%3Cspan%20class%3D%22sde-ctrl%20sde-label%22%20id%3D%22visitTime-label%22%20sde-type%3D%22label%22%20title%3D%22%22%20contenteditable%3D%22true%22%20sde-isloadasyncdata%3D%22false%22%3E%E5%B0%B1%E8%AF%8A%E6%97%B6%E9%97%B4%EF%BC%9A%3C%2Fspan%3E%26nbsp%3B%3Cspan%20class%3D%22sde-ctrl%22%20contenteditable%3D%22false%22%20id%3D%22visit-time%22%20sde-type%3D%22text%22%20sde-right%3D%22.%22%20sde-model%3D%22%257B%2522desc%2522%253A%2522%2522%252C%2522required%2522%253A1%252C%2522strictverify%2522%253A0%252C%2522notdel%2522%253A0%252C%2522verify%2522%253A%2522%2522%252C%2522mode%2522%253A%2522READONLY%2522%257D%22%20sde-isloadasyncdata%3D%22false%22%3E%3Cspan%20class%3D%22sde-value%22%20contenteditable%3D%22false%22%20sde-left%3D%22%5B%22%20sde-right%3D%22%5D%22%20_backups%3D%22%22%3E%3C%2Fspan%3E%3C%2Fspan%3E%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%3Cspan%20class%3D%22sde-ctrl%20sde-label%22%20id%3D%22category-label%22%20sde-type%3D%22label%22%20title%3D%22%22%20contenteditable%3D%22true%22%20sde-isloadasyncdata%3D%22false%22%3E%E7%A7%91%E5%88%AB%EF%BC%9A%3C%2Fspan%3E%26nbsp%3B%3Cspan%20class%3D%22sde-ctrl%22%20contenteditable%3D%22false%22%20id%3D%22department%22%20sde-type%3D%22text%22%20sde-right%3D%22.%22%20sde-model%3D%22%257B%2522desc%2522%253A%2522%2522%252C%2522required%2522%253A0%252C%2522strictverify%2522%253A0%252C%2522notdel%2522%253A0%252C%2522verify%2522%253A%2522%2522%252C%2522mode%2522%253A%2522READONLY%2522%257D%22%20sde-isloadasyncdata%3D%22false%22%3E%3Cspan%20class%3D%22sde-value%22%20contenteditable%3D%22false%22%20sde-left%3D%22%5B%22%20sde-right%3D%22%5D%22%3E%3C%2Fspan%3E%3C%2Fspan%3E%3C%2Fspan%3E%3C%2Fspan%3E%3C%2Fp%3E%3Chr%20class%3D%22pagebreak%22%20noshade%3D%22noshade%22%20size%3D%225%22%20style%3D%22-webkit-user-select%3A%20none%3B%22%3E%3Cp%20style%3D%22white-space%3A%20normal%3B%22%3E%3Cspan%20style%3D%22font-size%3A%2018px%3B%22%3E%3Cspan%20style%3D%22font-size%3A%2016px%3B%22%3E%3Cspan%20class%3D%22sde-ctrl%20sde-label%22%20id%3D%22temperature-labell%22%20sde-type%3D%22label%22%20title%3D%22%22%20contenteditable%3D%22true%22%20sde-isloadasyncdata%3D%22false%22%3E%E4%BD%93%E6%B8%A9%EF%BC%9A%3C%2Fspan%3E%26nbsp%3B%3Cspan%20class%3D%22sde-ctrl%22%20contenteditable%3D%22false%22%20id%3D%22temperature%22%20sde-type%3D%22text%22%20sde-right%3D%22.%22%20sde-model%3D%22%257B%2522desc%2522%253A%2522%2522%252C%2522required%2522%253A1%252C%2522strictverify%2522%253A0%252C%2522notdel%2522%253A1%252C%2522verify%2522%253A%2522%2522%252C%2522mode%2522%253A%2522EDITOR%2522%257D%22%20sde-isloadasyncdata%3D%22false%22%3E%3Cspan%20class%3D%22sde-value%22%20contenteditable%3D%22true%22%20sde-left%3D%22%5B%22%20sde-right%3D%22%5D%22%20_backups%3D%22%22%3E%3C%2Fspan%3E%3C%2Fspan%3E%26nbsp%3B%3Cspan%20class%3D%22sde-ctrl%20sde-label%22%20id%3D%22centigrade-label%22%20sde-type%3D%22label%22%20title%3D%22%22%20contenteditable%3D%22true%22%20sde-isloadasyncdata%3D%22false%22%3E%E2%84%83%3C%2Fspan%3E%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%3Cspan%20class%3D%22sde-ctrl%20sde-label%22%20id%3D%22breaths-label%22%20sde-type%3D%22label%22%20title%3D%22%22%20contenteditable%3D%22true%22%20sde-isloadasyncdata%3D%22false%22%3E%E5%91%BC%E5%90%B8%EF%BC%9A%3C%2Fspan%3E%26nbsp%3B%3Cspan%20class%3D%22sde-ctrl%22%20contenteditable%3D%22false%22%20id%3D%22breaths%22%20sde-type%3D%22text%22%20sde-right%3D%22.%22%20sde-model%3D%22%257B%2522desc%2522%253A%2522%2522%252C%2522required%2522%253A1%252C%2522strictverify%2522%253A0%252C%2522notdel%2522%253A0%252C%2522verify%2522%253A%2522%255E%255B0-9%255D*%2524%2522%252C%2522mode%2522%253A%2522EDITOR%2522%257D%22%20sde-isloadasyncdata%3D%22false%22%3E%3Cspan%20class%3D%22sde-value%22%20contenteditable%3D%22true%22%20sde-left%3D%22%5B%22%20sde-right%3D%22%5D%22%20_backups%3D%22%22%3E%3C%2Fspan%3E%3C%2Fspan%3E%26nbsp%3B%3Cspan%20class%3D%22sde-ctrl%20sde-label%22%20id%3D%22huxi%E4%BD%86%E6%9C%AA-label%22%20sde-type%3D%22label%22%20title%3D%22%22%20contenteditable%3D%22true%22%20sde-isloadasyncdata%3D%22false%22%3E%E6%AC%A1%2Fmin%3C%2Fspan%3E%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%26nbsp%3B%3Cspan%20class%3D%22sde-ctrl%20sde-label%22%20id%3D%22maibo-text%22%20sde-type%3D%22label%22%20title%3D%22%22%20contenteditable%3D%22true%22%20sde-isloadasyncdata%3D%22false%22%3E%E8%84%89%E6%90%8F%EF%BC%9A%3C%2Fspan%3E%26nbsp%3B%3Cspan%20class%3D%22sde-ctrl%22%20contenteditable%3D%22false%22%20id%3D%22pulse%22%20sde-type%3D%22text%22%20sde-right%3D%22.%22%20sde-model%3D%22%257B%2522desc%2522%253A%2522%2522%252C%2522required%2522%253A1%252C%2522strictverify%2522%253A1%252C%2522notdel%2522%253A0%252C%2522verify%2522%253A%2522%255E%255B0-9%255D*%2524%2522%252C%2522mode%2522%253A%2522EDITOR%2522%257D%22%20sde-isloadasyncdata%3D%22false%22%3E%3Cspan%20class%3D%22sde-value%22%20contenteditable%3D%22true%22%20sde-left%3D%22%5B%22%20sde-right%3D%22%5D%22%20_backups%3D%22%22%3E%3C%2Fspan%3E%3C%2Fspan%3E%26nbsp%3B%3Cspan%20class%3D%22sde-ctrl%20sde-label%22%20id%3D%22maibodanwei-text%22%20sde-type%3D%22label%22%20title%3D%22%22%20contenteditable%3D%22true%22%20sde-isloadasyncdata%3D%22false%22%3E%E6%AC%A1%2Fmin%3C%2Fspan%3E%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%3Cspan%20class%3D%22sde-ctrl%20sde-label%22%20id%3D%22xueya-text%22%20sde-type%3D%22label%22%20title%3D%22%22%20contenteditable%3D%22true%22%20sde-isloadasyncdata%3D%22false%22%3E%E8%A1%80%E5%8E%8B%EF%BC%9A%3C%2Fspan%3E%26nbsp%3B%3Cspan%20class%3D%22sde-ctrl%22%20contenteditable%3D%22false%22%20id%3D%22blood-pressure%22%20sde-type%3D%22text%22%20sde-right%3D%22.%22%20sde-model%3D%22%257B%2522desc%2522%253A%2522%2522%252C%2522required%2522%253A1%252C%2522strictverify%2522%253A0%252C%2522notdel%2522%253A0%252C%2522verify%2522%253A%2522%2522%252C%2522mode%2522%253A%2522EDITOR%2522%257D%22%20sde-isloadasyncdata%3D%22false%22%3E%3Cspan%20class%3D%22sde-value%22%20contenteditable%3D%22true%22%20sde-left%3D%22%5B%22%20sde-right%3D%22%5D%22%20_backups%3D%22%22%3E%3C%2Fspan%3E%3C%2Fspan%3E%26nbsp%3B%3Cspan%20class%3D%22sde-ctrl%20sde-label%22%20id%3D%22xueyadanwei-label%22%20sde-type%3D%22label%22%20title%3D%22%22%20contenteditable%3D%22true%22%20sde-isloadasyncdata%3D%22false%22%3EmmHg%3C%2Fspan%3E%3C%2Fspan%3E%3C%2Fspan%3E%3C%2Fp%3E%3Cp%20style%3D%22white-space%3A%20normal%3B%22%3E%3Cspan%20style%3D%22font-size%3A%2018px%3B%22%3E%3Cspan%20style%3D%22font-size%3A%2016px%3B%22%3E%3Cbr%3E%3C%2Fspan%3E%3C%2Fspan%3E%3C%2Fp%3E%3Cdiv%3E%3Cspan%20style%3D%22font-size%3A%2018px%3B%22%3E%3Cspan%20style%3D%22font-size%3A%2016px%3B%22%3E%3Cspan%20class%3D%22sde-ctrl%20sde-label%22%20id%3D%22zs-text%22%20sde-type%3D%22label%22%20title%3D%22%22%20contenteditable%3D%22true%22%20sde-isloadasyncdata%3D%22false%22%3E%E4%B8%BB%E8%AF%89%EF%BC%9A%3C%2Fspan%3E%26nbsp%3B%3Cspan%20class%3D%22sde-ctrl%22%20contenteditable%3D%22false%22%20id%3D%22zhusu%22%20sde-type%3D%22text%22%20sde-right%3D%22.%22%20sde-model%3D%22%257B%2522desc%2522%253A%2522%2522%252C%2522required%2522%253A0%252C%2522strictverify%2522%253A0%252C%2522notdel%2522%253A0%252C%2522verify%2522%253A%2522%2522%252C%2522mode%2522%253A%2522EDITOR%2522%257D%22%20sde-isloadasyncdata%3D%22false%22%3E%3Cspan%20class%3D%22sde-value%22%20contenteditable%3D%22true%22%20sde-left%3D%22%5B%22%20sde-right%3D%22%5D%22%20_backups%3D%22%22%3E%3C%2Fspan%3E%3C%2Fspan%3E%3C%2Fspan%3E%3C%2Fspan%3E%3Cp%3E%3Cbr%3E%3C%2Fp%3E%3Cp%3E%3Cspan%20style%3D%22font-size%3A%2018px%3B%22%3E%3Cspan%20style%3D%22font-size%3A%2016px%3B%22%3E%3Cspan%20class%3D%22sde-ctrl%20sde-label%22%20id%3D%22%E7%8E%B0%E7%97%85%E5%8F%B2-label%22%20sde-type%3D%22label%22%20title%3D%22%22%20contenteditable%3D%22true%22%20sde-model%3D%22%257B%2522desc%2522%253A%2522%2522%257D%22%20sde-isloadasyncdata%3D%22false%22%3E%3Cspan%20class%3D%22sde-ctrl%20sde-label%22%20id%3D%22xbs-label%22%20sde-type%3D%22label%22%20title%3D%22%22%20contenteditable%3D%22true%22%20sde-isloadasyncdata%3D%22false%22%3E%3Cspan%20class%3D%22sde-ctrl%20sde-label%22%20id%3D%22xbs-label%22%20sde-type%3D%22label%22%20title%3D%22%22%20contenteditable%3D%22true%22%20sde-isloadasyncdata%3D%22false%22%3E%E7%8E%B0%E7%97%85%E5%8F%B2%EF%BC%9A%3C%2Fspan%3E%26nbsp%3B%3C%2Fspan%3E%26nbsp%3B%3Cspan%20class%3D%22sde-ctrl%22%20contenteditable%3D%22false%22%20id%3D%22xbs-text%22%20sde-type%3D%22text%22%20sde-right%3D%22.%22%20sde-model%3D%22%257B%2522desc%2522%253A%2522%2522%252C%2522required%2522%253A0%252C%2522strictverify%2522%253A0%252C%2522notdel%2522%253A0%252C%2522verify%2522%253A%2522%2522%252C%2522mode%2522%253A%2522EDITOR%2522%257D%22%20sde-isloadasyncdata%3D%22false%22%3E%3Cspan%20class%3D%22sde-value%22%20contenteditable%3D%22true%22%20sde-left%3D%22%5B%22%20sde-right%3D%22%5D%22%3E%3C%2Fspan%3E%3C%2Fspan%3E%3C%2Fspan%3E%3C%2Fspan%3E%3C%2Fspan%3E%3C%2Fp%3E%3Cp%3E%3Cbr%3E%3C%2Fp%3E%3Cp%3E%3Cspan%20class%3D%22sde-ctrl%20sde-label%22%20id%3D%22jws-label%22%20sde-type%3D%22label%22%20title%3D%22%22%20contenteditable%3D%22true%22%20sde-isloadasyncdata%3D%22false%22%3E%E6%97%A2%E5%BE%80%E5%8F%B2%EF%BC%9A%3C%2Fspan%3E%26nbsp%3B%3Cspan%20class%3D%22sde-ctrl%22%20contenteditable%3D%22false%22%20id%3D%22%E6%97%A2%E5%BE%80%E5%8F%B2%22%20sde-type%3D%22text%22%20sde-right%3D%22.%22%20sde-model%3D%22%257B%2522desc%2522%253A%2522%2522%252C%2522required%2522%253A0%252C%2522strictverify%2522%253A0%252C%2522notdel%2522%253A0%252C%2522verify%2522%253A%2522%2522%252C%2522mode%2522%253A%2522EDITOR%2522%257D%22%20sde-isloadasyncdata%3D%22false%22%3E%3Cspan%20class%3D%22sde-value%22%20contenteditable%3D%22true%22%20sde-left%3D%22%5B%22%20sde-right%3D%22%5D%22%3E%3C%2Fspan%3E%3C%2Fspan%3E%3Cbr%3E%3C%2Fp%3E%3Cp%3E%3Cspan%20style%3D%22font-size%3A%2018px%3B%22%3E%3Cspan%20style%3D%22font-size%3A%2016px%3B%22%3E%3Cbr%3E%3C%2Fspan%3E%3C%2Fspan%3E%3C%2Fp%3E%3Cp%3E%3Cspan%20style%3D%22font-size%3A%2018px%3B%22%3E%3Cspan%20style%3D%22font-size%3A%2016px%3B%22%3E%3Cspan%20class%3D%22sde-ctrl%20sde-label%22%20id%3D%22ct-label%22%20sde-type%3D%22label%22%20title%3D%22%22%20contenteditable%3D%22true%22%20sde-isloadasyncdata%3D%22false%22%3E%E6%9F%A5%E4%BD%93%EF%BC%9A%3C%2Fspan%3E%26nbsp%3B%3Cspan%20class%3D%22sde-ctrl%22%20contenteditable%3D%22false%22%20id%3D%22%E6%9F%A5%E4%BD%93%22%20sde-type%3D%22text%22%20sde-right%3D%22.%22%20sde-model%3D%22%257B%2522desc%2522%253A%2522%2522%252C%2522required%2522%253A0%252C%2522strictverify%2522%253A0%252C%2522notdel%2522%253A0%252C%2522verify%2522%253A%2522%2522%252C%2522mode%2522%253A%2522EDITOR%2522%257D%22%20sde-isloadasyncdata%3D%22false%22%3E%3Cspan%20class%3D%22sde-value%22%20contenteditable%3D%22true%22%20sde-left%3D%22%5B%22%20sde-right%3D%22%5D%22%3E%3C%2Fspan%3E%3C%2Fspan%3E%3C%2Fspan%3E%3C%2Fspan%3E%3C%2Fp%3E%3Cp%3E%3Cbr%3E%3C%2Fp%3E%3Cp%3E%3Cspan%20style%3D%22font-size%3A%2018px%3B%22%3E%3Cspan%20style%3D%22font-size%3A%2016px%3B%22%3E%3Cspan%20class%3D%22sde-ctrl%20sde-label%22%20id%3D%22zkqk-label%22%20sde-type%3D%22label%22%20title%3D%22%22%20contenteditable%3D%22true%22%20sde-isloadasyncdata%3D%22false%22%3E%E4%B8%93%E7%A7%91%E6%83%85%E5%86%B5%EF%BC%9A%3C%2Fspan%3E%26nbsp%3B%3Cspan%20class%3D%22sde-ctrl%22%20contenteditable%3D%22false%22%20id%3D%22%E4%B8%93%E7%A7%91%E6%83%85%E5%86%B5%22%20sde-type%3D%22text%22%20sde-right%3D%22.%22%20sde-model%3D%22%257B%2522desc%2522%253A%2522%2522%252C%2522required%2522%253A0%252C%2522strictverify%2522%253A0%252C%2522notdel%2522%253A0%252C%2522verify%2522%253A%2522%2522%252C%2522mode%2522%253A%2522EDITOR%2522%257D%22%20sde-isloadasyncdata%3D%22false%22%3E%3Cspan%20class%3D%22sde-value%22%20contenteditable%3D%22true%22%20sde-left%3D%22%5B%22%20sde-right%3D%22%5D%22%3E%3C%2Fspan%3E%3C%2Fspan%3E%3C%2Fspan%3E%3C%2Fspan%3E%3C%2Fp%3E%3Cp%3E%3Cspan%20style%3D%22font-size%3A%2018px%3B%22%3E%3Cspan%20style%3D%22font-size%3A%2016px%3B%22%3E%3Cbr%3E%3C%2Fspan%3E%3C%2Fspan%3E%3C%2Fp%3E%3Cp%3E%3Cspan%20style%3D%22font-size%3A%2018px%3B%22%3E%3Cspan%20style%3D%22font-size%3A%2016px%3B%22%3E%3Cspan%20class%3D%22sde-ctrl%20sde-label%22%20id%3D%22fzjc-label%22%20sde-type%3D%22label%22%20title%3D%22%22%20contenteditable%3D%22true%22%20sde-isloadasyncdata%3D%22false%22%3E%E8%BE%85%E5%8A%A9%E6%A3%80%E6%9F%A5%EF%BC%9A%3C%2Fspan%3E%26nbsp%3B%3Cspan%20class%3D%22sde-ctrl%22%20contenteditable%3D%22false%22%20id%3D%22%E8%BE%85%E5%8A%A9%E6%A3%80%E6%9F%A5%22%20sde-type%3D%22text%22%20sde-right%3D%22.%22%20sde-model%3D%22%257B%2522desc%2522%253A%2522%2522%252C%2522required%2522%253A0%252C%2522strictverify%2522%253A0%252C%2522notdel%2522%253A0%252C%2522verify%2522%253A%2522%2522%252C%2522mode%2522%253A%2522EDITOR%2522%257D%22%20sde-isloadasyncdata%3D%22false%22%3E%3Cspan%20class%3D%22sde-value%22%20contenteditable%3D%22true%22%20sde-left%3D%22%5B%22%20sde-right%3D%22%5D%22%3E%3C%2Fspan%3E%3C%2Fspan%3E%3C%2Fspan%3E%3C%2Fspan%3E%3C%2Fp%3E%3Cp%3E%3Cspan%20style%3D%22font-size%3A%2018px%3B%22%3E%3Cspan%20style%3D%22font-size%3A%2016px%3B%22%3E%3Cbr%3E%3C%2Fspan%3E%3C%2Fspan%3E%3C%2Fp%3E%3Cp%3E%3Cspan%20style%3D%22font-size%3A%2018px%3B%22%3E%3Cspan%20style%3D%22font-size%3A%2016px%3B%22%3E%3Cspan%20class%3D%22sde-ctrl%20sde-label%22%20id%3D%22cbpd-label%22%20sde-type%3D%22label%22%20title%3D%22%22%20contenteditable%3D%22true%22%20sde-isloadasyncdata%3D%22false%22%3E%E5%88%9D%E6%AD%A5%E8%AF%8A%E6%96%AD%EF%BC%9A%3C%2Fspan%3E%26nbsp%3B%3Cspan%20class%3D%22sde-ctrl%22%20contenteditable%3D%22false%22%20id%3D%22%E5%88%9D%E6%AD%A5%E8%AF%8A%E6%96%AD%22%20sde-type%3D%22text%22%20sde-right%3D%22.%22%20sde-model%3D%22%257B%2522desc%2522%253A%2522%2522%252C%2522required%2522%253A0%252C%2522strictverify%2522%253A0%252C%2522notdel%2522%253A0%252C%2522verify%2522%253A%2522%2522%252C%2522mode%2522%253A%2522EDITOR%2522%257D%22%20sde-isloadasyncdata%3D%22false%22%3E%3Cspan%20class%3D%22sde-value%22%20contenteditable%3D%22true%22%20sde-left%3D%22%5B%22%20sde-right%3D%22%5D%22%3E%3C%2Fspan%3E%3C%2Fspan%3E%3C%2Fspan%3E%3C%2Fspan%3E%3C%2Fp%3E%3Cp%3E%3Cspan%20style%3D%22font-size%3A%2018px%3B%22%3E%3Cspan%20style%3D%22font-size%3A%2016px%3B%22%3E%3Cbr%3E%3C%2Fspan%3E%3C%2Fspan%3E%3C%2Fp%3E%3Cp%3E%3Cspan%20style%3D%22font-size%3A%2018px%3B%22%3E%3Cspan%20style%3D%22font-size%3A%2016px%3B%22%3E%3Cspan%20class%3D%22sde-ctrl%20sde-label%22%20id%3D%22cl-label%22%20sde-type%3D%22label%22%20title%3D%22%22%20contenteditable%3D%22true%22%20sde-isloadasyncdata%3D%22false%22%3E%E5%A4%84%E7%90%86%EF%BC%9A%3C%2Fspan%3E%26nbsp%3B%3Cspan%20class%3D%22sde-ctrl%22%20contenteditable%3D%22false%22%20id%3D%22%E5%A4%84%E7%90%86%22%20sde-type%3D%22text%22%20sde-right%3D%22.%22%20sde-model%3D%22%257B%2522desc%2522%253A%2522%2522%252C%2522required%2522%253A0%252C%2522strictverify%2522%253A0%252C%2522notdel%2522%253A0%252C%2522verify%2522%253A%2522%2522%252C%2522mode%2522%253A%2522EDITOR%2522%257D%22%20sde-isloadasyncdata%3D%22false%22%3E%3Cspan%20class%3D%22sde-value%22%20contenteditable%3D%22true%22%20sde-left%3D%22%5B%22%20sde-right%3D%22%5D%22%3E%3C%2Fspan%3E%3C%2Fspan%3E%3C%2Fspan%3E%3C%2Fspan%3E%3C%2Fp%3E%3Cp%3E%3Cspan%20style%3D%22font-size%3A%2018px%3B%22%3E%3Cspan%20style%3D%22font-size%3A%2016px%3B%22%3E%3Cbr%3E%3C%2Fspan%3E%3C%2Fspan%3E%3C%2Fp%3E%3Cp%20style%3D%22text-align%3A%20right%3B%22%3E%3Cspan%20style%3D%22font-size%3A%2018px%3B%22%3E%3Cspan%20style%3D%22font-size%3A%2016px%3B%22%3E%3Cspan%20class%3D%22sde-ctrl%20sde-label%22%20id%3D%22ysqm%22%20sde-type%3D%22label%22%20title%3D%22%22%20contenteditable%3D%22true%22%20sde-isloadasyncdata%3D%22false%22%3E%E5%8C%BB%E7%94%9F%E7%AD%BE%E5%90%8D%EF%BC%9A%3C%2Fspan%3E%26nbsp%3B%3Cspan%20class%3D%22sde-ctrl%22%20contenteditable%3D%22false%22%20id%3D%22%E5%8C%BB%E7%94%9F%E7%AD%BE%E5%90%8D%22%20sde-type%3D%22text%22%20sde-right%3D%22.%22%20sde-model%3D%22%257B%2522desc%2522%253A%2522%2522%252C%2522required%2522%253A0%252C%2522strictverify%2522%253A0%252C%2522notdel%2522%253A0%252C%2522verify%2522%253A%2522%2522%252C%2522mode%2522%253A%2522EDITOR%2522%257D%22%20sde-isloadasyncdata%3D%22false%22%3E%3Cspan%20class%3D%22sde-value%22%20contenteditable%3D%22true%22%20sde-left%3D%22%5B%22%20sde-right%3D%22%5D%22%3E%3C%2Fspan%3E%3C%2Fspan%3E%3C%2Fspan%3E%3C%2Fspan%3E%3C%2Fp%3E%3Cp%3E%3Cspan%20style%3D%22font-size%3A%2018px%3B%22%3E%3Cspan%20style%3D%22font-size%3A%2016px%3B%22%3E%3Cbr%3E%3C%2Fspan%3E%3C%2Fspan%3E%3C%2Fp%3E%3Cp%3E%3Cbr%3E%3C%2Fp%3E%3C%2Fdiv%3E</html></xml>';
            let that = this;

            axios
                .post(config.url + "/record-template", {
                    templateName: that.templateTypeToSave,
                    template: xml,
                    templateNo: that.templateNo,
                    department: that.department,
                    usageType: that.usageType,
                    creater: that.creater,
                    creationTime: that.creationTime,
                    luruma: that.luruma,
                    status: that.status,
                    comment: that.comment,
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

