<template>
    <div class="sde-root">
        <div
            ref="editor"
            :style="{ height: height }"
            style="box-shadow: 0 0 0 1px #d1d1d1, 0 0 3px 1px #ccc"
        ></div>
    </div>
</template>
<script>
import "../../static/sdeEditor/sde.config.js?t=88";
import "../../static/sdeEditor/ueditor/themes/default/css/ueditor.min.css";
import "../../static/sdeEditor/ueditor/ueditor.all.min.js";
import "../../static/sdeEditor/ueditor/lang/zh-cn/zh-cn.js";
import "../../static/sdeEditor/js/sde-ie8-design.js";

export default {
    name: "sdeEditor",
    props: {
        //编辑器的宽高取决于编辑器渲染节点本身的宽高
        width: {
            type: String,
            default: "1200px",
        },
        height: {
            type: String,
            default: "800px",
        },
        defaultXML: {
            type: String,
            default: "",
        },
        defaultToolbars: {
            type: Array,
            default: undefined,
        },
        defaultMode: {
            type: String,
            default: "DESIGN",
        },
    },
    data() {
        return {
            sde: null,
        };
    },

    methods: {
        execCommand() {
            return this.sde.execCommand.apply(this.sde, arguments);
        },
        mode(mode) {
            if (!!mode) {
                this.sde.mode(mode);
            } else {
                return this.sde.mode();
            }
        },
        getHTML() {
            return this.sde.html();
        },
        setHTML(html) {
            this.sde.html(html);
        },
    },
    created() {
        console.log("sde components created.");
    },
    watch: {
        defaultXML(newXML) {
            console.log(11);
            this.sde.importXML(newXML);
        },
    },
    mounted() {
        //alert('新增扩展toolbar示例，详见sdeEditor.vue组件!');
        this.sde = new SDE({
            el: this.$refs.editor,
            iframe_css_src: null, //string/Array数组 扩展css
            iframe_js_src: null, //string/Array数组 扩展js
            page_start_num: 6, //页面起始页//默认为1
            print: {
                resettingPrint(opt, viewDom) {}, //默认重置（包括首次设置）打印页面前触发。优先级高于render系列函数
                resetedPrint(opt, viewDom) {}, //默认重置（包括首次设置）打印页面后触发。优先级高于render系列函数
                renderHeader(index, page) {
                    return `<div style="line-height:55px;background:red;border:1px solid yellow;">这里是header</div>`;
                }, //返回要渲染的页眉。默认从零开始
                renderFooter(index, page) {
                    return `<div style="line-height:35px;background:blue;border:1px solid green;"><center>第${
                        index + 1
                    }页<center></div>`;
                }, //返回要渲染的页脚。默认从零开始
                renderedHeader(index, count, page, header) {}, //渲染后
                renderedFooter(index, count, page, footer) {}, //渲染后
                scale: 2, //放大比例，默认2倍，越大越清晰，相应的渲染也更慢
                autoPrint: true, //是否默认打开pdfviewer即执行打印操作
                isDownload: false, //是否下载，如果为true，则不再打开pdfviewer页面
                fileName: "SDE 测试打印", //如果isDownload=true时的pdf文件下载名称
                pageMode: "A4", //页面模式:A3|A4|A5 ……
                width: 794, //以下默认值
                height: 1123,
                top: 72,
                right: 72,
                bottom: 72,
                left: 72,
                printMode: "normal", //打印模式：normal|neat|revise|comment
                ctrlMode: "normal", //控件模式：normal|hidden|remove
                printDirection: "vertical", //打印方向 vertical|horizontal
                printCssUrl: null, //打印的样式表，可以是string，也可以是array
                printJsUrl: null, //打印的js，可以是string，也可以是array
            },
            ctrl_remote_handle: function (data) {
                //这里可以处理url，对url进行再加工。比如重置data.url值
                //data.url='static/sdeEditor/'+data.url;
                return data;
            },
            mode: this.defaultMode,
            default_open_toolbar: "sde-toolbar-editor", //默认打开的toolbar的集合，如果不填，默认使用第一个集合
            toolbars: this.defaultToolbars,
        });
        let that = this;
        this.sde.addListener("ready", function () {
            console.log("sde 初始化完成！");
            that.sde.importXML(that.defaultXML);
        });
        this.sde.addListener("headerfooteropen", function () {
            console.log("design headerfooteropen ok!");
        });

        this.sde.addListener("beforerender", function () {
            console.log("beforerender ok!");
        });
        this.sde.addListener("rendered", function () {
            console.log(arguments);
            console.log("rendered ok!");
        });
        this.sde.addListener("click", function () {
            console.log(arguments);
            console.log("click ok!");
        });
        this.sde.addListener("valuechange", function () {
            console.log(arguments);
            console.log("valuechange ok!");
        });

        this.sde.addListener("contentchange", function () {
            console.log("111");
            console.log(arguments);
        });

        this.sde.addListener("ctrlchange", function () {
            console.log("?Asdas1");
        });
        //todo 这里可以尝试调用this.sde的各种方法
    },
    beforeDestroy() {
        this.sde.destroy();
    },
};
</script>
