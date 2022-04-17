<template>
    <div class="box" ref="box" @contextmenu.prevent>
        <div class="menu" id="app" ref="left" @contextmenu.prevent>
            <div>
                <div>门诊挂号序号： {{ patientInfo.mzghxh }}</div>
                <div>姓名：{{ patientInfo.xm }}</div>
                <div>性别： {{ patientInfo.xb }}</div>
                <div>出生时间： {{ patientInfo.cssj }}</div>
                <div>年龄： {{ patientInfo.nl }}</div>
                <div>科别： {{ patientInfo.kb }}</div>
                <div>病人编号： {{ patientInfo.cdno }}</div>
                <div>身份证号： {{ patientInfo.sfzhm }}</div>
            </div>
            <div>
                <leftMenu
                    v-if="childData"
                    v-bind:menuData="treeData"
                    @loadRecord="handleLoadRecord"
                >
                </leftMenu>
            </div>
        </div>
        <div class="resize" title="收缩侧边栏" ref="resize"></div>
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
                <button
                    v-bind:disabled="!currIsRecord || !isChanged"
                    v-on:click="saveOnOldRecord()"
                >
                    保存当前修改
                </button>
                <button v-on:click="saveAsNewRecord()">保存为新的病历</button>

                <el-dialog
                    ref="dialog"
                    title="预览"
                    :visible.sync="dialogVisible"
                >
                    <sde-editor
                        ref="sdeEditor-preview"
                        :defaultXML="currPreviewXml"
                        :defaultMode="previewMode"
                    ></sde-editor>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible = false"
                            >取 消</el-button
                        >
                        <el-button
                            type="primary"
                            @click="handleUsePreviewRecord()"
                            >确 定</el-button
                        >
                    </span>
                </el-dialog>
                <br />
            </div>
            <div style="margin: 0 auto">
                <sde-editor
                    ref="sdeEditor"
                    :defaultToolbars="outpatientToolbars"
                ></sde-editor>
            </div>
        </div>
    </div>
</template>
<script>
import leftMenu from "../components/leftMenu.vue";
import sdeEditor from "../components/sdeEditor";
import axios from "axios";
var config = require("../../config/api-config");
export default {
    components: {
        sdeEditor,
        leftMenu,
    },
    data() {
        return {
            patientInfo: {
                mzghxh: "",
                xm: "",
                xb: "",
                cssj: "",
                nl: "",
                kb: "",
                cdno: "",
                sfzhm: "",
            },
            childData: true,
            txthtml: "",
            treeData: [],
            currIsRecord: false,
            currXml: "",
            currPreviewXml: "",
            xmlToPreview: "",
            currRecordNo: -1,
            currRecordType: "",
            isChanged: false,
            dialogVisible: false,
            previewMode: "READONLY",
            outpatientToolbars: [
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
    mounted() {
        this.dragControllerDiv();

        let data = this.loadFile("../../config/api-config");
        console.log(data);
    },
    created() {
        var mzghxh = this.$route.params.id;
        console.log(this.$route.params.id);
        this.loadLeftInfo(mzghxh);
    },
    methods: {
        handleLoadRecord(data) {
            console.log("handle left click");
            this.currPreviewXml = data[0].xml;
            this.currRecordNo = data[0].recordNo;
            console.log(this.currRecordNo);
            this.currIsRecord = data[0].isRecord;
            this.currRecordType = data[0].recordType;
            this.dialogVisible = true;
        },
        handleUsePreviewRecord() {
            this.dialogVisible = false;
            this.currXml = this.currPreviewXml;
            this.$refs.sdeEditor.sde.importXML(this.currXml);
        },
        refreshLeft() {
            this.childData = false;
            this.$nextTick(() => {
                this.childData = true;
            });
        },

        loadLeftInfo(mzghxh) {
            let that = this;
            axios
                .get(config.url + "/outpatient?mzghxh=" + mzghxh)
                .then(function (response) {
                    that.treeData = response.data.data.menuData;
                    that.patientInfo = response.data.data.patientInfo;
                    console.log(response.data.data);
                    console.log("Load left info");
                    that.refreshLeft();
                });
        },
        loadFile(name) {
            // name为文件所在位置
            let xhr = new XMLHttpRequest(),
                okStatus = document.location.protocol === "file:" ? 0 : 200;
            xhr.open("GET", name, false);
            xhr.overrideMimeType("text/html;charset=utf-8"); //默认为utf-8
            xhr.send(null);
            return xhr.status === okStatus ? xhr.responseText : null;
        },
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
            console.log(this.$refs.sdeEditor.getHTML());
        },
        setHTML() {
            this.$refs.sdeEditor.setHTML(this.txthtml);
            console.log(11111);
            console.log(document.getElementById("visit-time"));
        },
        aaa() {
            console.log(this.$refs.sdeEditor.sde.getControlById("visit-time"));
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
            return this.$refs.sdeEditor.sde.exportXML();
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
        saveOnOldRecord() {
            const xml = this.$refs.sdeEditor.sde.exportXML();
            axios
                .post(config.url + "/medical-record/update", {
                    record: xml,
                    recordNo: this.currRecordNo,
                })
                .then(function (response) {
                    console.log(response);
                });
        },
        saveAsNewRecord() {
            const xml = this.$refs.sdeEditor.sde.exportXML();
            let that = this;
            axios
                .post(config.url + "/medical-record/insert", {
                    patientCdno: this.patientInfo.cdno,
                    recordType: this.currRecordType,
                    record: xml,
                })
                .then(function (response) {
                    console.log(response);
                    that.loadLeftInfo(that.patientInfo.mzghxh);
                });
        },
        loadRecord(id, name, type, department, IDNumber) {
            let that = this;
            console.log("id:" + id);
            console.log("name:" + name);
            console.log("type:" + type);
            console.log("department:" + department);
            console.log("IDNumber:" + IDNumber);
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
                        console.log(that.getDate());
                        that.$refs.sdeEditor.sde
                            .getControlById("visit-time")
                            .setValue(that.getDate());
                        that.$refs.sdeEditor.sde
                            .getControlById("name-text")
                            .setValue(name);
                        that.$refs.sdeEditor.sde
                            .getControlById("patientId-text")
                            .setValue(id);
                        that.$refs.sdeEditor.sde
                            .getControlById("department")
                            .setValue(department);
                        that.$refs.sdeEditor.sde
                            .getControlById("ID-text")
                            .setValue(IDNumber);
                    }
                });
        },
        getDate() {
            const myDate = new Date();
            //获取当前年
            const year = myDate.getFullYear();
            //获取当前月
            const month = myDate.getMonth() + 1;
            //获取当前日
            const date = myDate.getDate();
            //获取当前小时数(0-23)
            const h = myDate.getHours();
            //获取当前分钟数(0-59)
            const m = myDate.getMinutes();

            //获取当前时间
            const time =
                year +
                "-" +
                this.convert(month) +
                "-" +
                this.convert(date) +
                " " +
                this.convert(h) +
                ":" +
                this.convert(m);

            return time;
        },
        //日期时间处理
        convert(val) {
            return val < 10 ? "0" + val : val;
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
