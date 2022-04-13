import Vue from "vue";
import Router from "vue-router";
import inpatient from "../view/inpatient";
import outpatient from "../view/outpatient";
import templateEdit from "../view/template-edit";

Vue.use(Router);

export default new Router({
    routes: [{
            path: "/inpatient",
            name: "inpatient",
            component: inpatient
        },
        {
            path: "/inpatient/:id",
            name: "inpatients",
            component: inpatient
        },
        {
            path: "/template-edit",
            name: "templateEdit",
            component: templateEdit
        },
        {
            path: "/outpatient/:id",
            name: "outpatients",
            component: outpatient
        }
    ]
});