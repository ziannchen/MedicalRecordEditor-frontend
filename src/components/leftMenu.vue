
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
            this.$emit("loadRecord", data);
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