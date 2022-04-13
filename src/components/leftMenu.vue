<template>
    <Tree
        :data="data5"
        @on-contextmenu="handleContextMenu"
        @on-select-change="handleLeftClick"
    >
        <template slot="contextMenu">
            <DropdownItem @click.native="handleContextMenuEdit"
                >编辑</DropdownItem
            >
            <DropdownItem
                @click.native="handleContextMenuDelete"
                style="color: #ed4014"
                >删除</DropdownItem
            >
        </template>
    </Tree>
</template>
<script>
import { EventBus } from "../event-bus.js";
export default {
    props: {
        menuData: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            currentId: -1,
            currentRecordType: "",
            data5: this.menuData,
        };
    },

    methods: {
        handleLeftClick(data) {
            console.log(111);
            if (data.length != 0) {
                console.log(data[0]);
                EventBus.$emit("openRecord", {
                    xml: data[0].xml,
                    recordNo: data[0].recordNo,
                    isRecord: data[0].isRecord,
                    recordType: data[0].recordType,
                });
            }
        },
        handleContextMenu(data) {
            this.contextData = data;
        },
        handleContextMenuEdit() {
            this.$Message.info("Click edit of" + this.contextData.title);
        },
        handleContextMenuDelete() {
            this.$Message.info("Click delete of" + this.contextData.title);
        },
    },
};
</script>
