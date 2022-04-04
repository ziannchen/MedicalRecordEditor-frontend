<template>
  <div class="box" ref="box" @contextmenu.prevent>
    <div class="menu" id="app" ref="left" @contextmenu.prevent>
      <leftMenu v-if="treeData.length != 0" v-bind:menuData="treeData">
      </leftMenu>
    </div>
    <div class="resize" title="收缩侧边栏" ref="resize"></div>
    <div class="editor">
      <h1>example for SDE v4</h1>
      <div class="toolbars">
        <b>修改模式：</b>
        <button v-on:click="changeMode('DESIGN')">设置为设计模式</button>
        <button v-on:click="changeMode('EDITOR')">设置为编辑模式</button>
        <button v-on:click="changeMode('STRICT')">
          设置为严格（表单）模式
        </button>
        <button v-on:click="changeMode('READONLY')">设置为只读模式</button>
        <button v-on:click="getMode()">获取当前模式</button>
        <br />
        <b>内部方法：</b>
        <button v-on:click="importXML()">导入xml</button>
        <button v-on:click="exportXML()">导出xml</button>
        <button v-on:click="downloadXML()">下载xml</button>
        <button v-on:click="getHTML()">获取编辑器内容</button>
        <button v-on:click="setHTML()">设置编辑器内容</button
        ><input type="text" v-model="txthtml" placeholder="请输入html内容" />
        <br />
      </div>
      <div style="margin: 0 auto; width: 1200px">
        <sde-editor ref="sdeEditor"></sde-editor>
      </div>
    </div>
  </div>
</template>
<script>
import leftMenu from "../components/leftMenu.vue";
import sdeEditor from "../components/sdeEditor";
import axios from "axios";
export default {
  components: {
    sdeEditor,
    leftMenu,
  },
  data() {
    return {
      txthtml: "",
      treeData: [],
    };
  },
  mounted() {
    this.dragControllerDiv();
  },
  created() {
    let that = this;
    axios.get("http://127.0.0.1:3000/").then(function (response) {
      var jsonData = response.data;
      console.log("get json");
      console.log(jsonData);
      let myMap = new Map();
      for (var i = 0; i < jsonData.length; i++) {
        if (!myMap.has(jsonData[i].first)) {
          myMap.set(jsonData[i].first, new Map());
        }

        if (!myMap.get(jsonData[i].first).has(jsonData[i].second)) {
          myMap.get(jsonData[i].first).set(jsonData[i].second, new Array());
        }

        myMap
          .get(jsonData[i].first)
          .get(jsonData[i].second)
          .push(jsonData[i].name);
      }
      var result = [];
      for (const first of myMap.keys()) {
        var currentFirst = {};
        currentFirst.title = first;
        currentFirst.expand = false;

        currentFirst.children = [];
        var internalMap = myMap.get(first);
        for (const second of internalMap.keys()) {
          var currentSecond = {};
          currentSecond.title = second;
          currentSecond.expand = false;
          currentSecond.children = [];
          var nameList = internalMap.get(second);
          for (const name of nameList) {
            var currentName = {};
            currentName.title = name;
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
              editor[j].style.width = box[i].clientWidth - moveLen - 10 + "px";
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
      const xml = `<?xml version="1.0" encoding="UTF-8"?><xml><html>%3Cp%3Eadfa%E6%89%93%E5%8F%91sfadsf%E9%98%BFsfadsf%E9%98%BF%E6%96%AFdfa%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%3Cspan%20sde-type%3D%22text%22%20sde-right%3D%22.%22%20id%3D%22abc1%22%20sde-model%3D%22%257B%2522mode%2522%253A%2522EDITOR%2522%252C%2522notdel%2522%253A0%252C%2522strictverify%2522%253A0%252C%2522verify%2522%253A%2522%255E%255B0-9%255D*%2524%2522%252C%2522required%2522%253A0%252C%2522desc%2522%253A%2522%25E6%2595%25B4%25E6%2595%25B0%25E6%258E%25A7%25E4%25BB%25B6%2522%252C%2522remotedata%2522%253A%257B%2522url%2522%253A%2522%252Fdata%252Fjson1.json%2522%252C%2522method%2522%253A%2522get%2522%252C%2522data%2522%253A%257B%2522name%2522%253A%2522tl%2522%257D%257D%257D%22%20contenteditable%3D%22false%22%20class%3D%22sde-ctrl%22%20sde-isloadasyncdata%3D%22true%22%20bindingdata%3D%22undefined%22%20sde-updatetime%3D%222018-05-08T12%3A32%3A22.721Z%22%3E%3Cspan%20sde-left%3D%22%5B%22%20sde-right%3D%22%5D%22%20contenteditable%3D%22true%22%20class%3D%22sde-value%22%20title%3D%22%E6%95%B4%E6%95%B0%E6%8E%A7%E4%BB%B6%22%3E%E6%95%B4%E6%95%B0%E6%8E%A7%E4%BB%B6%3C%2Fspan%3E%3C%2Fspan%3E%26nbsp%3B%20%26nbsp%3Bsd%E5%95%8A%E6%96%AF%E9%A1%BF%E5%8F%91%E6%89%93%E5%8F%91%E6%96%AF%E8%92%82%E8%8A%AC%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%3Cspan%20sde-value%3D%22%5B%7B%20%26quot%3Blabel%26quot%3B%3A%20%26quot%3B%E7%94%B7%26quot%3B%2C%20%26quot%3Bvalue%26quot%3B%3A%201%20%7D%5D%22%20sde-type%3D%22select%22%20sde-updatetime%3D%222018-05-08T12%3A32%3A22.722Z%22%20sde-right%3D%22.%22%20id%3D%22abc-select%22%20sde-model%3D%22%257B%2522mode%2522%253A%2522EDITOR%2522%252C%2522notdel%2522%253A0%252C%2522strictverify%2522%253A0%252C%2522required%2522%253A0%252C%2522multi%2522%253A0%252C%2522desc%2522%253A%2522%25E6%2580%25A7%25E5%2588%25AB%2522%252C%2522bindingdata%2522%253A%255B%255D%252C%2522remotedata%2522%253A%257B%2522url%2522%253A%2522%252Fdata%252Fsex.json%2522%252C%2522method%2522%253A%2522get%2522%252C%2522headers%2522%253A%257B%257D%252C%2522data%2522%253A%257B%257D%257D%257D%22%20contenteditable%3D%22false%22%20class%3D%22sde-ctrl%22%20sde-isloadasyncdata%3D%22true%22%20bindingdata%3D%22%5B%7B%26quot%3Blabel%26quot%3B%3A%26quot%3B%E7%94%B7%26quot%3B%2C%26quot%3Bvalue%26quot%3B%3A1%7D%2C%7B%26quot%3Blabel%26quot%3B%3A%26quot%3B%E5%A5%B3%26quot%3B%2C%26quot%3Bvalue%26quot%3B%3A2%7D%2C%7B%26quot%3Blabel%26quot%3B%3A%26quot%3B%E6%9C%AA%E7%9F%A5%26quot%3B%2C%26quot%3Bvalue%26quot%3B%3A3%7D%5D%22%3E%3Cspan%20sde-left%3D%22%5B%22%20sde-right%3D%22%5D%22%20contenteditable%3D%22true%22%20class%3D%22sde-value%20sde-select%22%20title%3D%22%E6%80%A7%E5%88%AB%22%3E%E7%94%B7%3C%2Fspan%3E%3C%2Fspan%3E%26nbsp%3Bsd%E5%95%8A%E6%89%93%E7%88%B1%E7%9A%84%E5%8F%91%E7%9A%84%E8%92%82%E8%8A%AC%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%3Cspan%20sde-value%3D%22%5B%7B%20%26quot%3Blabel%26quot%3B%3A%20%26quot%3B%E6%84%9F%E8%A7%89%E5%BE%88%E5%A5%BD%26quot%3B%2C%20%26quot%3Bvalue%26quot%3B%3A%201%20%7D%2C%20%7B%20%26quot%3Blabel%26quot%3B%3A%20%26quot%3B%E6%84%9F%E8%A7%89%E4%B8%80%E8%88%AC%26quot%3B%2C%20%26quot%3Bvalue%26quot%3B%3A%202%20%7D%5D%22%20sde-type%3D%22select%22%20sde-updatetime%3D%222018-05-08T12%3A32%3A22.728Z%22%20sde-right%3D%22.%22%20id%3D%22abc-select1%22%20sde-model%3D%22%257B%2522mode%2522%253A%2522EDITOR%2522%252C%2522notdel%2522%253A0%252C%2522strictverify%2522%253A0%252C%2522required%2522%253A0%252C%2522multi%2522%253A1%252C%2522desc%2522%253A%2522%25E6%2584%259F%25E8%25A7%2589%2522%252C%2522bindingdata%2522%253A%255B%255D%252C%2522remotedata%2522%253A%257B%2522url%2522%253A%2522%252Fdata%252Ffeel.json%2522%252C%2522method%2522%253A%2522get%2522%252C%2522headers%2522%253A%257B%257D%252C%2522data%2522%253A%257B%257D%257D%257D%22%20contenteditable%3D%22false%22%20class%3D%22sde-ctrl%22%20sde-isloadasyncdata%3D%22true%22%20bindingdata%3D%22%5B%7B%26quot%3Blabel%26quot%3B%3A%26quot%3B%E6%84%9F%E8%A7%89%E5%BE%88%E5%A5%BD%26quot%3B%2C%26quot%3Bvalue%26quot%3B%3A1%7D%2C%7B%26quot%3Blabel%26quot%3B%3A%26quot%3B%E6%84%9F%E8%A7%89%E4%B8%80%E8%88%AC%26quot%3B%2C%26quot%3Bvalue%26quot%3B%3A2%7D%2C%7B%26quot%3Blabel%26quot%3B%3A%26quot%3B%E6%97%A0%E6%84%9F%E8%A7%89%26quot%3B%2C%26quot%3Bvalue%26quot%3B%3A3%7D%2C%7B%26quot%3Blabel%26quot%3B%3A%26quot%3B%E6%84%9F%E8%A7%89%E7%B3%9F%E7%B3%95%26quot%3B%2C%26quot%3Bvalue%26quot%3B%3A4%7D%5D%22%3E%3Cspan%20sde-left%3D%22%5B%22%20sde-right%3D%22%5D%22%20contenteditable%3D%22true%22%20class%3D%22sde-value%20sde-select%22%20title%3D%22%E6%84%9F%E8%A7%89%22%3E%3Cspan%20class%3D%22sde-val-item%22%20sde-value%3D%221%22%3E%E6%84%9F%E8%A7%89%E5%BE%88%E5%A5%BD%3C%2Fspan%3E%3Cspan%20class%3D%22sde-val-item%22%20sde-value%3D%222%22%3E%E6%84%9F%E8%A7%89%E4%B8%80%E8%88%AC%3C%2Fspan%3E%3C%2Fspan%3E%3C%2Fspan%3E%26nbsp%3Bsd%E5%95%8A%E6%89%93%E5%8F%91sf%3C%2Fp%3E%3Cp%3E%E5%BC%80%E5%A7%8B%E6%97%B6%E9%97%B4%EF%BC%9A%26nbsp%3B%3Cspan%20id%3D%22kssj%22%20sde-type%3D%22date%22%20sde-model%3D%22%257B%2522mode%2522%253A%2522EDITOR%2522%252C%2522notdel%2522%253A0%252C%2522strictverify%2522%253A0%252C%2522required%2522%253A0%252C%2522desc%2522%253A%2522%2522%252C%2522defvalue%2522%253A%25222018-5-7%252016%253A08%253A09%2522%252C%2522format%2522%253A%2522%257Byyyy%257D-%257BMM%257D-%257Bdd%257D%2520%257Bhh%257D%253A%257Bmm%257D%253A%257Bss%257D%2522%252C%2522min%2522%253A%2522%2522%252C%2522max%2522%253A%2522%2522%257D%22%20class%3D%22sde-ctrl%22%20contenteditable%3D%22false%22%20sde-isloadasyncdata%3D%22false%22%3E%3Cspan%20contenteditable%3D%22true%22%20sde-left%3D%22%5B%22%20sde-right%3D%22%5D%22%20class%3D%22sde-value%22%3E%E5%BC%80%E5%A7%8B%E6%97%B6%E9%97%B4%3C%2Fspan%3E%3C%2Fspan%3E%26nbsp%3B%E9%98%BF%E6%89%93%E5%8F%91%E6%89%93%0A%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%E7%BB%93%E6%9D%9F%E6%97%B6%E9%97%B4%EF%BC%9A%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%3Cspan%20id%3D%22jssj%22%20sde-type%3D%22date%22%20sde-model%3D%22%257B%2522mode%2522%253A%2522EDITOR%2522%252C%2522notdel%2522%253A0%252C%2522strictverify%2522%253A0%252C%2522required%2522%253A0%252C%2522desc%2522%253A%2522%2522%252C%2522defvalue%2522%253A%25222018-5-7%252016%253A08%253A09%2522%252C%2522format%2522%253A%2522%257Byyyy%257D-%257BMM%257D-%257Bdd%257D%2520%257Bhh%257D%253A%257Bmm%257D%253A%257Bss%257D%2522%252C%2522min%2522%253A%25222018-4-7%252016%253A08%253A09%2522%252C%2522max%2522%253A%25222018-5-17%252016%253A08%253A09%2522%257D%22%20class%3D%22sde-ctrl%22%20contenteditable%3D%22false%22%20sde-isloadasyncdata%3D%22false%22%3E%3Cspan%20contenteditable%3D%22true%22%20sde-left%3D%22%5B%22%20sde-right%3D%22%5D%22%20class%3D%22sde-value%22%3E%E7%BB%93%E6%9D%9F%E6%97%B6%E9%97%B4%3C%2Fspan%3E%3C%2Fspan%3E%26nbsp%3B%E9%98%BF%E6%89%93%E5%8F%91%E6%89%93%0A%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%E5%8F%91%E9%9A%8F%E6%84%8F%E6%97%B6%E9%97%B4%EF%BC%9A%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%3Cspan%20id%3D%22sysj%22%20sde-type%3D%22date%22%20sde-model%3D%22%257B%2522mode%2522%253A%2522EDITOR%2522%252C%2522notdel%2522%253A0%252C%2522strictverify%2522%253A0%252C%2522required%2522%253A0%252C%2522desc%2522%253A%2522%2522%252C%2522defvalue%2522%253A%25222018-5-7%252016%253A08%253A09%2522%252C%2522format%2522%253A%2522%257Byyyy%257D%25E5%25B9%25B4%257BMM%257D-%257Bdd%257D%2520%257Bhh%257D%253A%257Bmm%257D%253A%257Bss%257D%2522%252C%2522min%2522%253A%25222018-4-7%252016%253A08%253A09%2522%252C%2522max%2522%253A%25222018-5-17%252016%253A08%253A09%2522%257D%22%20class%3D%22sde-ctrl%22%20contenteditable%3D%22false%22%20sde-isloadasyncdata%3D%22false%22%3E%3Cspan%20contenteditable%3D%22true%22%20sde-left%3D%22%5B%22%20sde-right%3D%22%5D%22%20class%3D%22sde-value%22%3E%E7%BB%93%E6%9D%9F%E6%97%B6%E9%97%B4%3C%2Fspan%3E%3C%2Fspan%3E%26nbsp%3B%E9%98%BF%E6%89%93%E5%8F%91%E6%89%93%0A%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%E5%8F%91%3C%2Fp%3E</html></xml>`;
      this.$refs.sdeEditor.sde.importXML(xml);
    },
    exportXML() {
      alert(this.$refs.sdeEditor.sde.exportXML());
    },
    downloadXML() {
      this.$refs.sdeEditor.sde.downloadXML();
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
  margin: 1% 0px;
  overflow: hidden;
  background: #ffffff;
}
/*左侧div样式*/
.menu {
  width: calc(22% - 20px); /*左侧初始化宽度*/
  height: 100%;
  float: left;
  background-color: #868686;
  user-select: none;
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
  width: 68%; /*右侧初始化宽度*/
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

