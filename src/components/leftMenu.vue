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
            if (
                data.length != 0 &&
                data[0].id != undefined &&
                (this.currentId != data[0].id ||
                    this.currentRecordType != data[0].title)
            ) {
                this.currentId = data[0].id;
                this.currentRecordType = data[0].title;
                console.log(data[0].id);
                EventBus.$emit("openRecord", {
                    id: data[0].id,
                    recordType: data[0].title,
                    department: data[0].department,
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
