/*
    ioBroker.vis vis-materialdesign Widget-Set

    version: "0.2.44"

    Copyright 2019 Scrounger scrounger@gmx.net
*/
"use strict";

// this code can be placed directly in materialdesign.html
vis.binds.materialdesign.autocomplete =
    function (el, data) {
        try {
            let $this = $(el);
            let helper = vis.binds.materialdesign.input.helper
            let containerClass = 'materialdesign-vuetify-autoComplete';

            let inputMode = 'combobox'
            if (data.inputMode === 'select') {
                inputMode = 'autocomplete';
            }

            let itemsList = [];

            for (var i = 0; i <= data.countSelectItems; i++) {
                let value = myMdwHelper.getValueFromData(data.attr('value' + i), null)

                if (value !== null) {
                    itemsList.push(
                        {
                            text: myMdwHelper.getValueFromData(data.attr('label' + i), value),
                            subText: myMdwHelper.getValueFromData(data.attr('subLabel' + i), ''),
                            value: myMdwHelper.getValueFromData(data.attr('value' + i), ''),
                            icon: myMdwHelper.getValueFromData(data.attr('listIcon' + i), '', 'mdi-'),
                        }
                    )
                }
            }

            //     <template v-slot:selection="data">
            //     <v-icon v-html="data.item.icon"></v-icon>
            // </template>

            $this.append(`
            <div class="${containerClass}" style="width: 100%; height: 100%;">
                <v-${inputMode}
                    ${helper.getConstructor(data)}
                    
                    v-model="item"
                    item-text="text"
                    item-value="value"
                    
                    :items="items"
                    menu-props="${myMdwHelper.getValueFromData(data.listPosition, 'auto')}"
                    :append-icon="collapseIcon"

                    @focus="focus"
                >

                ${(data.showSelectedIcon !== 'no') ? `
                    <template v-slot:${data.showSelectedIcon}>
                        <div class="v-input__icon v-input__icon--${data.showSelectedIcon}">
                            <v-icon>{{ icon }}</v-icon>
                        </div>
                    </template>
                ` : ''}
                 
                <template v-slot:item="data">
                    <v-icon class="materialdesign-v-list-item-icon">{{data.item.icon}}</v-icon>
                    <v-list-item-content style="height: 100%">
                        <v-list-item-title class="materialdesign-v-list-item-title" v-html="data.item.text"></v-list-item-title>
                        <v-list-item-subtitle class="materialdesign-v-list-item-subtitle">{{data.item.subText}}</v-list-item-subtitle>
                    </v-list-item-content>
                    ${(data.showValue) ? `<label class="materialdesign-v-list-item-value">{{data.item.value}}</label>`: ''}
                </template>

                </v-${inputMode}>
            </div>`);

            myMdwHelper.waitForElement($this, `.${containerClass}`, function () {
                myMdwHelper.waitForElement($("body"), '#materialdesign-vuetify-container', function () {

                    let $vuetifyContainer = $("body").find('#materialdesign-vuetify-container');
                    let widgetHeight = window.getComputedStyle($this.context, null).height.replace('px', '');

                    let vueTextField = new Vue({
                        el: $this.find(`.${containerClass}`).get(0),
                        vuetify: new Vuetify(),
                        data() {
                            let dataObj = helper.getData(data, widgetHeight);

                            let item = getObjectByValue(vis.states.attr(data.oid + '.val'));

                            dataObj.item = item;
                            dataObj.items = itemsList;
                            dataObj.icon = item.icon;
                            dataObj.collapseIcon = myMdwHelper.getValueFromData(data.collapseIcon, undefined, 'mdi-');

                            return dataObj;
                        },
                        methods: {
                            changeEvent(item) {
                                if (item) {
                                    if (item.value) {
                                        vis.setValue(data.oid, item.value);
                                    } else {
                                        // only if combobox (is writeable)
                                        vis.setValue(data.oid, item);
                                    }
                                } else {
                                    let item = getObjectByValue(vis.states.attr(data.oid + '.val'));
                                    this.item = item;
                                    this.icon = item.icon;
                                }
                            },
                            focus(value) {
                                // select object will first time created after item is focused. select object is created under vue app container
                                let selectId = $this.find('.v-input__slot').attr('aria-owns');

                                if (itemsList.length > 0) {
                                    myMdwHelper.waitForElement($vuetifyContainer, '#' + selectId, function () {

                                        // corresponding select object create -> set style options
                                        let selectList = $vuetifyContainer.find(`#${selectId} .v-list`).get(0);

                                        // list item style
                                        selectList.style.setProperty('--vue-list-item-height', myMdwHelper.getStringFromNumberData(data.listItemHeight, 'auto', '', 'px'));

                                        selectList.style.setProperty('--vue-list-item-background-color', myMdwHelper.getValueFromData(data.listItemBackgroundColor, 'inherit'));
                                        selectList.style.setProperty('--vue-list-item-background-hover-color', myMdwHelper.getValueFromData(data.listItemBackgroundHoverColor, ''));
                                        selectList.style.setProperty('--vue-list-item-background-selected-color', myMdwHelper.getValueFromData(data.listItemBackgroundSelectedColor, ''));

                                        // list item ripple effect color
                                        selectList.style.setProperty('--vue-ripple-effect-color', myMdwHelper.getValueFromData(data.listItemRippleEffectColor, ''));

                                        // list item font style                                        
                                        selectList.style.setProperty('--vue-list-item-font-size', myMdwHelper.getStringFromNumberData(data.listItemFontSize, 'inherit', '', 'px'));
                                        selectList.style.setProperty('--vue-list-item-font-family', myMdwHelper.getValueFromData(data.listItemFont, 'inherit'));

                                        let listItemFontColor = myMdwHelper.getValueFromData(data.listItemFontColor, 'inherit');

                                        selectList.style.setProperty('--vue-list-item-font-color', listItemFontColor);
                                        selectList.style.setProperty('--vue-list-item-font-color-hover', myMdwHelper.getValueFromData(data.listItemFontHoverColor, listItemFontColor));
                                        selectList.style.setProperty('--vue-list-item-font-color-selected', myMdwHelper.getValueFromData(data.listItemFontSelectedColor, listItemFontColor));

                                        // list item subTitle font style
                                        selectList.style.setProperty('--vue-list-item-subtitle-font-size', myMdwHelper.getStringFromNumberData(data.listItemSubFontSize, 'inherit', '', 'px'));
                                        selectList.style.setProperty('--vue-list-item-subtitle-font-family', myMdwHelper.getValueFromData(data.listItemSubFont, 'inherit'));

                                        let listItemSubFontColor = myMdwHelper.getValueFromData(data.listItemSubFontColor, '');

                                        selectList.style.setProperty('--vue-list-item-subtitle-font-color', listItemSubFontColor);
                                        selectList.style.setProperty('--vue-list-item-subtitle-font-color-hover', myMdwHelper.getValueFromData(data.listItemSubFontHoverColor, listItemSubFontColor));
                                        selectList.style.setProperty('--vue-list-item-subtitle-font-color-selected', myMdwHelper.getValueFromData(data.listItemSubFontSelectedColor, listItemSubFontColor));

                                        // list item value font style
                                        selectList.style.setProperty('--vue-list-item-value-font-size', myMdwHelper.getStringFromNumberData(data.listItemValueFontSize, 'inherit', '', 'px'));
                                        selectList.style.setProperty('--vue-list-item-value-font-family', myMdwHelper.getValueFromData(data.listItemValueFont, 'inherit'));

                                        let listItemValueFontColor = myMdwHelper.getValueFromData(data.listItemValueFontColor, '');

                                        selectList.style.setProperty('--vue-list-item-value-font-color', listItemValueFontColor);
                                        selectList.style.setProperty('--vue-list-item-value-font-color-hover', myMdwHelper.getValueFromData(data.listItemValueFontHoverColor, listItemValueFontColor));
                                        selectList.style.setProperty('--vue-list-item-value-font-color-selected', myMdwHelper.getValueFromData(data.listItemValueFontSelectedColor, listItemValueFontColor));

                                        // list item icon style
                                        let listItemColor = myMdwHelper.getValueFromData(data.listIconColor, '#44739e');

                                        selectList.style.setProperty('--vue-list-item-icon-size', myMdwHelper.getStringFromNumberData(data.listIconSize, 'inherit', '', 'px'));
                                        selectList.style.setProperty('--vue-list-item-icon-color', listItemColor);
                                        selectList.style.setProperty('--vue-list-item-icon-color-hover', myMdwHelper.getValueFromData(data.listIconHoverColor, listItemColor));
                                        selectList.style.setProperty('--vue-list-item-icon-color-selected', myMdwHelper.getValueFromData(data.listIconSelectedColor, listItemColor));
                                    });
                                }
                            }
                        }
                    });

                    helper.setStyles($this, data);

                    $this.context.style.setProperty("--vue-text-icon-append-size", myMdwHelper.getNumberFromData(data.collapseIconSize, 16) + 'px');
                    $this.context.style.setProperty("--vue-text-icon-append-color", myMdwHelper.getValueFromData(data.collapseIconColor, ''));
                    $this.context.style.setProperty("--vue-text-icon-append-cursor", 'pointer');

                    vis.states.bind(data.oid + '.val', function (e, newVal, oldVal) {
                        let item = getObjectByValue(newVal);
                        vueTextField.item = item;
                        vueTextField.icon = item.icon;
                    });

                    function getObjectByValue(val) {
                        var result = itemsList.filter(obj => {
                            return obj.value === val;
                        });

                        if (result.length === 1) {
                            return result[0];
                        } else if (result.length > 1) {
                            console.warn("[Vuetify AutoComplete]: more than one result found!")
                            return result[0];
                        } else {
                            if (inputMode = 'combobox') {
                                // only if combobox (is writeable)
                                return { text: val, value: val };
                            } else {
                                return null;
                            }
                        }
                    }
                });
            });
        } catch (ex) {
            console.error(`[Vuetify AutoComplete]: error: ${ex.message}, stack: ${ex.stack} `);
        }
    };