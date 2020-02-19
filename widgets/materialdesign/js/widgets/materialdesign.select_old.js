/*
    ioBroker.vis vis-materialdesign Widget-Set

    version: "0.2.58"

    Copyright 2019 Scrounger scrounger@gmx.net
*/
"use strict";

vis.binds.materialdesign.selectOld = {
    initialize: function (data, isBooleanSelect = false) {
        try {
            let selectElementList = [];

            let iconHeight = myMdwHelper.getValueFromData(data.drawerIconHeight, '', 'height: ', 'px !important;');
            let menuItemFontSize = myMdwHelper.getFontSize(data.listItemTextSize);
            let spaceBetweenImageAndLabel = myMdwHelper.getValueFromData(data.distanceBetweenTextAndImage, '', 'margin-right: ', 'px;');
            let menuWidth = myMdwHelper.getValueFromData(data.menuWidth, '', 'width: ', 'px;');

            let selectElement = '';
            let labelledbyAttribute = '';
            let labelElement = '';

            if (data.layout === 'standard') {
                selectElement = `<div class="mdc-select" style="width: 100%; z-index: ${myMdwHelper.getNumberFromData(data.z_index, 0)}">`
                labelledbyAttribute = 'filled_enhanced filled_enhanced-label';

                labelElement = `<span class="mdc-floating-label mdc-floating-label--float-above">${myMdwHelper.getValueFromData(data.hintText, '')}</span>
                                <div class="mdc-line-ripple"></div>`
            } else {
                selectElement = '<div class="mdc-select mdc-select--outlined" style="width: 100%;">'
                labelledbyAttribute = 'shaped_filled_enhanced shaped_filled_enhanced-label';

                labelElement = `<div class="mdc-notched-outline">
                                    <div class="mdc-notched-outline__leading"></div>
                                    <div class="mdc-notched-outline__notch">
                                        <label class="mdc-floating-label">${myMdwHelper.getValueFromData(data.hintText, '')}</label>
                                    </div>
                                    <div class="mdc-notched-outline__trailing"></div>
                                </div>`
            }

            let imageElement = '';
            let listElements = [];
            let rightItemLabel = '';

            if (isBooleanSelect) {
                // Bool Select
                let image = myMdwHelper.getValueFromData(data.image, null);
                let imageTrue = myMdwHelper.getValueFromData(data.imageTrue, null);

                if (image != null || imageTrue != null) {
                    selectElement = $($.parseHTML(selectElement)).addClass('mdc-select--with-leading-icon').get(0).outerHTML.replace('</div>', '');
                    imageElement = `<img class="mdc-select__icon" tabindex="0" role="button" src="${image}" />`;
                }

                listElements.push(`${myMdwHelper.getListItem('standard', 0, '', false, false, iconHeight, '', '', false)}
                                                ${(image != null) ? myMdwHelper.getListItemImage(image, `${iconHeight}${spaceBetweenImageAndLabel}`) : ''}
                                                ${myMdwHelper.getListItemLabel('standard', 0, myMdwHelper.getValueFromData(data.text_false, 'Item false'), false, menuItemFontSize, '', 0)}</div>`)

                listElements.push(`${myMdwHelper.getListItem('standard', 1, '', false, false, iconHeight, '', '', true)}
                                                ${(imageTrue != null) ? myMdwHelper.getListItemImage(imageTrue, `${iconHeight}${spaceBetweenImageAndLabel}`) : ''}
                                                ${myMdwHelper.getListItemLabel('standard', 1, myMdwHelper.getValueFromData(data.text_true, 'Item true'), false, menuItemFontSize, '', 0)}</div>`)

            } else {
                // Value Select
                let imageExists = false;
                let initialeImage = '';

                for (var i = 0; i <= data.values; i++) {
                    let menuIcon = myMdwHelper.getValueFromData(data.attr('menuIcon' + i), null);

                    listElements.push(`${myMdwHelper.getListItem('standard', i, '', false, false, iconHeight, '', '', myMdwHelper.getValueFromData(data.attr('value' + i), ''))}
                                                ${(menuIcon != null) ? myMdwHelper.getListItemImage(menuIcon, `${iconHeight}${spaceBetweenImageAndLabel}`) : ''}
                                                ${$($.parseHTML(myMdwHelper.getListItemLabel('standard', 0, myMdwHelper.getValueFromData(data.attr('label' + i), myMdwHelper.getValueFromData(data.attr('value' + i), `no value for Item ${i}`)), false, menuItemFontSize, '', 0))).css('width','').get(0).outerHTML}`)

                    if (menuIcon !== null) {
                        imageExists = true;
                        initialeImage = menuIcon;
                    }

                    if (data.showValueOnRight) {
                        let rightLabelFontSize = myMdwHelper.getFontSize(data.valueRightFontsize);

                        rightItemLabel = myMdwHelper.getListItemLabel('standard', i, myMdwHelper.getValueFromData(data.attr('value' + i)) + myMdwHelper.getValueFromData(data.valueRightAppendix, ''), false, rightLabelFontSize, '', '', '');
                        rightItemLabel = $($.parseHTML(rightItemLabel)).css('width', 'auto');
                        rightItemLabel = rightItemLabel.addClass('materialdesign-list-item-text-right').addClass('mdc-list-item__meta').get(0).outerHTML;

                        listElements.push(rightItemLabel);
                    }


                    listElements.push('</div>')
                }

                if (imageExists) {
                    selectElement = $($.parseHTML(selectElement)).addClass('mdc-select--with-leading-icon').get(0).outerHTML.replace('</div>', '');
                    imageElement = `<img class="mdc-select__icon" tabindex="0" role="button" src="${initialeImage}" />`;
                }
            }

            let textFontSize = myMdwHelper.getFontSize(data.selectTextSize);

            selectElementList.push(`${selectElement}
                                        <div class="mdc-select__anchor">
                                            ${imageElement}
                                            <i class="mdc-select__dropdown-icon"></i>
                                            <div id="filled_enhanced" 
                                                class="mdc-select__selected-text ${textFontSize.class}" 
                                                role="button" 
                                                aria-haspopup="listbox" 
                                                aria-labelledby="${labelledbyAttribute}"
                                                style="${textFontSize.style}; font-family: ${myMdwHelper.getValueFromData(data.selectTextFont, '')};">
                                            </div>
                                            ${labelElement}
                                        </div>
                                        <div class="mdc-select__menu mdc-menu mdc-menu-surface" style="${menuWidth}; z-index: ${myMdwHelper.getNumberFromData(data.z_index, 0)}">
                                            <ul class="mdc-list">
                                                ${listElements.join('')}
                                            </ul>
                                        </div>
                                        
                                    </div>`);

            return selectElementList.join('');

        } catch (ex) {
            console.error(`[Select] initialize: error: ${ex.message}, stack: ${ex.stack}`);
        }
    },
    handle: function (el, data, isBooleanSelect) {
        try {
            setTimeout(function () {
                var $this = $(el);
                let select = $this.find('.mdc-select').get(0);
                let list = $this.find('.mdc-list').get(0);

                const mdcSelect = new mdc.select.MDCSelect(select);
                const mdcList = new mdc.list.MDCList(list);
                const listItemRipples = mdcList.listElements.map((listItemEl) => new mdc.ripple.MDCRipple(listItemEl));

                select.style.setProperty("--materialdesign-color-select-background", myMdwHelper.getValueFromData(data.selectBackground, ''));
                select.style.setProperty("--materialdesign-color-select-background-hover", myMdwHelper.getValueFromData(data.selectBackgroundHover, ''));
                select.style.setProperty("--materialdesign-color-select-hint", myMdwHelper.getValueFromData(data.selectHintTextColor, ''));
                select.style.setProperty("--materialdesign-color-select-hint_selected", myMdwHelper.getValueFromData(data.selectHintTextColorSelected, ''));
                select.style.setProperty("--materialdesign-color-select-border", myMdwHelper.getValueFromData(data.selectBorderColor, ''));
                select.style.setProperty("--materialdesign-color-select-border-selected", myMdwHelper.getValueFromData(data.selectBorderColorSelected, ''));
                select.style.setProperty("--materialdesign-color-select-text", myMdwHelper.getValueFromData(data.selectTextColor, ''));

                let colorDrawerBackground = myMdwHelper.getValueFromData(data.colorDrawerBackground, '');
                list.style.setProperty("--materialdesign-color-drawer-background", colorDrawerBackground);
                list.style.setProperty("--materialdesign-color-list-item-background", myMdwHelper.getValueFromData(data.colorDrawerItemBackground, colorDrawerBackground));
                list.style.setProperty("--materialdesign-color-list-item-selected", myMdwHelper.getValueFromData(data.colorListItemSelected, ''));
                list.style.setProperty("--materialdesign-color-list-item-hover", myMdwHelper.getValueFromData(data.colorListItemHover, ''));
                list.style.setProperty("--materialdesign-color-list-item-text", myMdwHelper.getValueFromData(data.colorListItemText, ''));
                list.style.setProperty("--materialdesign-color-list-item-text-activated", myMdwHelper.getValueFromData(data.colorListItemTextSelected, ''));
                list.style.setProperty("--materialdesign-color-list-item-text-right", myMdwHelper.getValueFromData(data.colorListItemTextRight, ''));


                setSelectState(vis.states.attr(data.oid + '.val'));

                vis.states.bind(data.oid + '.val', function (e, newVal, oldVal) {
                    setSelectState(newVal);
                });

                if (!vis.editMode) {
                    mdcSelect.listen('MDCSelect:change', function () {
                        if (isBooleanSelect) {
                            vis.setValue(data.oid, (mdcSelect.value === 'true') ? true : false);
                        } else {
                            vis.setValue(data.oid, mdcSelect.value);
                        }

                        vis.binds.materialdesign.helper.vibrate(data.vibrateOnMobilDevices);
                    });
                }

                function setSelectState(val) {

                    if (isBooleanSelect) {
                        if (val) {
                            mdcSelect.selectedIndex = 1;
                            mdcList.selectedIndex = 1;
                            $this.find('.mdc-select__icon').attr('src', myMdwHelper.getValueFromData(data.imageTrue, ''))
                        } else {
                            mdcSelect.selectedIndex = 0;
                            mdcList.selectedIndex = 0;
                            $this.find('.mdc-select__icon').attr('src', myMdwHelper.getValueFromData(data.image, ''))
                        }
                    } else {
                        for (var i = 0; i <= data.values; i++) {
                            if (val.toString() === myMdwHelper.getValueFromData(data.attr('value' + i), '').toString()) {
                                mdcSelect.selectedIndex = i;
                                mdcList.selectedIndex = i;
                                $this.find('.mdc-select__icon').attr('src', myMdwHelper.getValueFromData(data.attr('menuIcon' + i), ''))

                                break;
                            }
                        }
                    }
                };

                $this.find('.mdc-select').click(function() {
                    vis.binds.materialdesign.helper.vibrate(data.vibrateOnMobilDevices);
                });
                
            }, 1);

        } catch (ex) {
            console.error(`[Select] handleBoolean: error: ${ex.message}, stack: ${ex.stack}`);
        }
    }
};