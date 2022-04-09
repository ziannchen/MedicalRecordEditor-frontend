import Vue from "vue";
import Router from "vue-router";
import index from "../view/index";
import templateEdit from "../view/template-edit";

Vue.use(Router);

export default new Router({
    routes: [{
            path: "/patients",
            name: "index",
            component: index
        },
        {
            path: "/patients/:id",
            name: "index",
            component: index
        },
        {
            path: "/template-edit",
            name: "templateEdit",
            component: templateEdit
        }
    ]
});