/*
    ioBroker.vis vis-materialdesign Widget-Set
    
    Copyright 2019 Scrounger scrounger@gmx.net
*/
"use strict";

vis.binds.materialdesign.helper = {
    vibrate: function (duration) {
        try {
            if ("vibrate" in navigator) {
                window.navigator.vibrate(duration);
            }
        } catch (ex) {
            console.error(`vibrate [${data.wid}]: error: ${ex.message}, stack: ${ex.stack}`);
        }
    },
    waitForVisConnected: function (callBack, counter = 0, debug = false) {
        if (counter < 500) {

            setTimeout(function () {
                if (vis.conn && vis.conn.getIsConnected()) {
                    callBack();
                } else {
                    if (debug) console.log(`[waitForVisConnected] wait for vis connection`);
                    counter++
                    vis.binds.materialdesign.helper.waitForVisConnected(callBack, counter);
                }
            }, 1)
        } else {
            if (debug) console.log(`[waitForVisConnected] stop waiting for vis connection after 100 retries`);
            callBack();
        }
    },
    waitForElement: function (parent, elementPath, wid, widgetName, callBack, counter = 0, debug = false) {
        if (counter < 100) {

            setTimeout(function () {
                if (parent.find(elementPath).length) {
                    callBack();
                } else {
                    if (debug) console.log(`[${widgetName} ${wid}] wait for elements`);
                    counter++
                    vis.binds.materialdesign.helper.waitForElement(parent, elementPath, wid, widgetName, callBack, counter);
                }
            }, 50)
        } else {
            if (debug) console.log(`[${widgetName} ${wid}] stop waiting after 100 retries`);
            callBack();
        }
    },
    waitForRealWidth: function (element, wid, widgetName, callBack, counter = 0, debug = false) {
        if (counter < 100) {
            setTimeout(function () {
                let width = window.getComputedStyle(element, null).width

                if (width.includes('px')) {
                    callBack();
                } else {
                    if (debug) console.log(`[${widgetName} ${wid}] wait for real width`);
                    counter++
                    vis.binds.materialdesign.helper.waitForRealWidth(element, wid, widgetName, callBack, counter);
                }
            }, 50);
        } else {
            if (debug) console.log(`[${widgetName} ${wid}] stop waiting for real width after 100 retries`);
            callBack();
        }
    },
    waitForRealHeight: function (element, wid, widgetName, callBack, counter = 0, debug = false) {
        if (counter < 100) {
            setTimeout(function () {
                let height = window.getComputedStyle(element, null).height

                if (height.includes('px')) {
                    callBack();
                } else {
                    if (debug) console.log(`[${widgetName} ${wid}] wait for real height`);
                    counter++
                    vis.binds.materialdesign.helper.waitForRealHeight(element, wid, widgetName, callBack, counter);
                }
            }, 50);
        } else {
            if (debug) console.log(`[${widgetName} ${wid}] stop waiting for real height after 100 retries`);
            callBack();
        }
    },
    installedVersion: function (el, data) {
        myMdwHelper.waitForVisConnected(function () {
            myMdwHelper.getVersion(function (version) {
                $(el).find('#versionNumber').text(version);
            });
        });
    },
    getValueFromData: function (dataValue, nullValue, prepand = '', append = '') {
        try {
            if (Array.isArray(dataValue)) {
                if (dataValue.length > 0) {
                    return dataValue;
                } else {
                    return nullValue;
                }
            } else {
                return (dataValue === undefined || dataValue === null || dataValue === '') ? nullValue : prepand + dataValue + append;
            }
        } catch (err) {
            console.error(`[Helper] getValueFromData: ${err.message}`);
            return 'Error';
        }
    },
    getBooleanFromData: function (dataValue, nullValue) {
        try {
            if (dataValue === undefined || dataValue === null || dataValue === '') {
                return nullValue
            } else if (dataValue === true || dataValue === 'true' || dataValue === 1 || dataValue === '1') {
                return true;
            } else {
                return false;
            }

        } catch (err) {
            console.error(`[Helper] getBooleanFromData: ${err.message}`);
            return 'Error';
        }
    },
    getNumberFromData: function (dataValue, nullValue) {
        try {
            return (dataValue === undefined || dataValue === null || dataValue === '' || isNaN(dataValue)) ? nullValue : parseFloat(dataValue);
        } catch (err) {
            console.error(`[Helper] getNumberFromData: ${err.message}`);
            return 'Error';
        }
    },
    getStringFromNumberData: function (dataValue, nullValue, prepand = '', append = '') {
        try {
            return (dataValue === undefined || dataValue === null || dataValue === '' || isNaN(dataValue)) ? nullValue : prepand + parseFloat(dataValue) + append;
        } catch (err) {
            console.error(`[Helper] getStringFromNumberData: ${err.message}`);
            return 'Error';
        }
    },
    getFontSize: function (fontSizeValue) {
        let fontSize = vis.binds.materialdesign.helper.getValueFromData(fontSizeValue, null);

        if (fontSize !== null) {
            if (fontSize.includes('headline') || fontSize.includes('subtitle') || fontSize.includes('body') || fontSize.includes('caption') || fontSize.includes('button') || fontSize.includes('overline')) {
                // font size is a mdc-typography style
                return { class: `mdc-typography--${fontSize}`, style: '' };
            } else if (!isNaN(fontSize)) {
                // number only
                return { class: ``, style: `font-size: ${fontSize}px;` };
            } else {
                return { class: ``, style: `font-size: ${fontSize};` };
            }
        } else {
            return { class: '', style: '' };
        }
    },
    getListItemHeader: function (text, fontSize) {
        if (text !== null && text !== '') {
            return `<h3 class="mdc-list-group__subheader ${fontSize.class}" 
                        style="${fontSize.style}">
                            ${text}
                    </h3>`;
        }
        return '';
    },
    getListItemTextElement: function (text, subText, fontSize, subFontSize, align = 'left') {

        let alignFlex = 'flex-start';
        if (align === 'center') {
            alignFlex = 'center';
        } else if (align === 'right') {
            alignFlex = 'flex-end';
        }

        return `<span class="mdc-list-item__text" style="width: 100%">     
                    <span class="mdc-list-item__primary-text ${fontSize.class}" style="justify-content: ${alignFlex};${fontSize.style}">${text}</span>
                    <span class="mdc-list-item__secondary-text ${subFontSize.class}" style="text-align: ${align}; ${subFontSize.style}">${subText}</span>
                </span>`;
    },
    getListItemImage: function (image, style) {
        if (image != '') {
            return `<img 
                    class="mdc-list-item__graphic" src="${image}" 
                    style="width: auto; padding-top: 8px; padding-bottom: 8px;${style}"
                >`
        }
        return '';
    },

    getListItem: function (layout, itemIndex, backdropImage, hasSubItems, isSubItem = false, style = '', dataOid = '', role = '', dataValue = '') {
        if (layout === 'standard') {
            // Layout: Standard
            return `<div 
                        class="mdc-list-item${(isSubItem) ? ' mdc-sub-list-item isSubItem' : ''}${(itemIndex === 0) ? ' mdc-list-item--activated' : ''}${(hasSubItems) ? ' hasSubItems' : ''}" 
                        tabindex="${(itemIndex === 0) ? '0' : '-1'}" 
                        id="listItem_${itemIndex}" 
                        style="${style}"
                        data-value="${dataValue}" 
                        ${dataOid} 
                        ${role}
                    >`
        } else {
            // Layout: Backdrop
            return `<div 
                        class="mdc-list-item${(isSubItem) ? ' mdc-sub-list-item isSubItem' : ''}${(itemIndex === 0) ? ' mdc-list-item--activated' : ''} mdc-card__media${(hasSubItems) ? ' hasSubItems' : ''}" 
                        tabindex="${(itemIndex === 0) ? '0' : '-1'}"
                        id="listItem_${itemIndex}"
                        style="background-image: url(${backdropImage}); align-items: flex-end; padding: 0px;${style}"
                    >`
        }
    },
    getListItemLabel: function (layout, itemIndex, text, hasSubItems, fontSize, showLabel, toggleIconColor, backdropLabelHeight, isSubItem = false, align = 'left') {

        let subItemToggleIcon = '';
        if (hasSubItems) {
            subItemToggleIcon = `<span 
                                    class="mdc-list-item__meta mdi mdi-menu-down toggleIcon" aria-hidden="true" style="font-size: 24px; ${vis.binds.materialdesign.helper.getValueFromData(toggleIconColor, '', 'color: ', ';')}">                                        
                                </span>`;
        }

        if (layout === 'standard') {
            // Layout: Standard
            let listItemLabel = `<span 
                                    class="mdc-list-item__text ${fontSize.class}"
                                    id="listItem_${itemIndex}"
                                    style="width: 100%; text-align: ${align}; ${fontSize.style}${showLabel}">
                                        ${text}
                                </span>`;

            return listItemLabel + subItemToggleIcon;

        } else {
            // Layout: Backdrop

            // generate SubItems toggle Icon
            return `<div 
                        class="materialdesign-list-item-backdrop-container${(isSubItem) ? ' isSubItem' : ''}" 
                        id="backdropContainer_${itemIndex}" 
                        style="${backdropLabelHeight}">
                            <span 
                                class="mdc-list-item__text ${fontSize.class}"
                                id="listItem_${itemIndex}"
                                style="position: absolute; ${fontSize.style}${showLabel}">
                                    ${text}
                            </span>
                            ${subItemToggleIcon}
                    </div>`;
        }
    },
    getListItemDivider: function (showDivider, dividerLayout) {
        if (showDivider === true || showDivider === 'true') {
            if (dividerLayout === 'standard') {
                return '<hr class="mdc-list-divider">'
            } else {
                return `<hr class="mdc-list-divider mdc-list-divider--${dividerLayout}">`
            }
        }
        return '';
    },
    getIconElement: function (iconData, width, height, iconColor = '', style = '', appendClass = '') {
        let className = `materialdesign-icon-image ${appendClass}`;

        let icon = myMdwHelper.getValueFromData(iconData, null);
        let color = myMdwHelper.getValueFromData(iconColor, '');

        if (icon !== null) {
            if (myMdwHelper.getAllowedImageFileExtensions().some(el => icon.includes(el))) {
                // is image
                return `<img 
                        class="${className}"
                        src="${icon}" 
                        style="width: ${width}; height: ${height}; ${style};" />`;
            } else {
                // is material-icons
                return `<span class="mdi mdi-${icon} ${className}" 
                            style="width: ${height}; height: ${height}; font-size: ${height}; color: ${color}; ${style};"></span>`
            }
        }

        return '';
    },
    getListIcon: function (iconData, width, height, iconColor = '', style = '') {
        return myMdwHelper.getIconElement(iconData, width, height, iconColor, `padding-top: 8px; padding-bottom: 8px;${style}`, 'mdc-list-item__graphic');
    },
    changeIconElement: function (parentElement, iconData, width, height, iconColor = '', style = '', appendClass = '') {
        let className = (`materialdesign-icon-image ${appendClass}`).trim();

        let element = parentElement.find('.' + className.replace(/\s/g, '.'));

        let icon = myMdwHelper.getValueFromData(iconData, null);
        let color = myMdwHelper.getValueFromData(iconColor, '');

        if (icon !== null) {
            if (myMdwHelper.getAllowedImageFileExtensions().some(el => icon.includes(el))) {
                // is image
                if (element.is('img')) {
                    element.attr('src', icon);
                } else {
                    // previous image is material-icon
                    element.replaceWith(`<img 
                                            class="${className}"
                                            src="${icon}" 
                                            style="width: ${width}; height: ${height}; ${style};" />`);
                }
            } else {
                // is material-icons
                element.replaceWith(`<span class="mdi mdi-${icon} ${className}" 
                                                style="width: ${height}; height: ${height}; font-size: ${height}; color: ${color}; ${style};"></span>`)
            }
        }
    },
    changeListIconElement: function (parentElement, iconData, width, height, iconColor = '', style = '') {
        myMdwHelper.changeIconElement(parentElement, iconData, width, height, iconColor, `padding-top: 8px; padding-bottom: 8px;${style}`, 'mdc-list-item__graphic');
    },
    getAllowedImageFileExtensions: function () {
        return ['.gif', '.png', '.bmp', '.jpg', '.jpeg', '.tif', '.svg', 'http://', 'https://'];
    },
    getVisibility: function (val, visibilityOid, visibilityCond, visibilityVal) {
        var oid = visibilityOid;
        var condition = visibilityCond;
        if (oid) {
            if (val === undefined || val === null) {
                val = vis.states.attr(oid + '.val');
            }
            if (val === undefined || val === null) {
                return (condition === 'not exist');
            }

            var value = visibilityVal;

            if (!condition || value === undefined || value === null) {
                return (condition === 'not exist');
            }

            if (val === 'null' && condition !== 'exist' && condition !== 'not exist') {
                return false;
            }

            var t = typeof val;
            if (t === 'boolean' || val === 'false' || val === 'true') {
                value = value === 'true' || value === true || value === 1 || value === '1';
            } else
                if (t === 'number') {
                    value = parseFloat(value);
                } else
                    if (t === 'object') {
                        val = JSON.stringify(val);
                    }

            // Take care: return true if widget is hidden!
            switch (condition) {
                case '==':
                    value = value.toString();
                    val = val.toString();
                    if (val === '1') val = 'true';
                    if (value === '1') value = 'true';
                    if (val === '0') val = 'false';
                    if (value === '0') value = 'false';
                    return value !== val;
                case '!=':
                    value = value.toString();
                    val = val.toString();
                    if (val === '1') val = 'true';
                    if (value === '1') value = 'true';
                    if (val === '0') val = 'false';
                    if (value === '0') value = 'false';
                    return value === val;
                case '>=':
                    return val < value;
                case '<=':
                    return val > value;
                case '>':
                    return val <= value;
                case '<':
                    return val >= value;
                case 'consist':
                    value = value.toString();
                    val = val.toString();
                    return (val.toString().indexOf(value) === -1);
                case 'not consist':
                    value = value.toString();
                    val = val.toString();
                    return (val.toString().indexOf(value) !== -1);
                case 'exist':
                    return val === 'null';
                case 'not exist':
                    return val !== 'null';
                default:
                    console.log('Unknown visibility condition: ' + condition);
                    return false;
            }
        } else {
            return (condition === 'not exist');
        }
    },
    getViewOfWidget(wid) {
        for (var view in vis.views) {
            if (vis.views[view].widgets && vis.views[view].widgets[wid]) {
                return view;
            }
        }
    },
    oidNeedSubscribe(oid, wid, widgetName, oidNeedSubscribe, isBinding = false, debug = false) {
        let view = vis.binds.materialdesign.helper.getViewOfWidget(wid);

        if (oid !== undefined) {
            // Check if Oid is subscribed and put to vis subscribing object
            if (!vis.editMode && !vis.subscribing.byViews[view].includes(oid)) {
                vis.subscribing.byViews[view].push(oid)

                if (!isBinding) {
                    if (debug) console.log(`[oidNeedSubscribe] ${widgetName} (${wid}): oid '${oid}' need subscribe`);
                } else {
                    if (debug) console.log(`[oidNeedSubscribe] ${widgetName} (${wid}): binding '${oid}' need subscribe`);
                }

                return true;
            }
        }

        return oidNeedSubscribe;
    },
    bindingNeedSubscribe(element, wid, widgetName, oidNeedSubscribe) {
        let result = { bindingTokenList: [], oidNeedSubscribe: oidNeedSubscribe };

        let bindings = vis.extractBinding(element);

        if (bindings !== 'null' && bindings !== null && bindings.length > 0) {
            for (var b = 0; b <= bindings.length - 1; b++) {
                result.bindingTokenList.push(bindings[b].token);

                if (vis.bindings.hasOwnProperty([bindings[b].systemOid]) === false) {
                    result.oidNeedSubscribe = vis.binds.materialdesign.helper.oidNeedSubscribe(bindings[b].systemOid, wid, widgetName, oidNeedSubscribe, true);

                    vis.bindings[[bindings[b].systemOid]] = [{
                        visOid: bindings[b].visOid,
                        systemOid: bindings[b].visOid,
                        token: bindings[b].visOid,
                        format: bindings[b].format,
                        isSeconds: bindings[b].isSeconds,
                        operations: bindings[b].operations,
                        type: "data",
                        attr: bindings[b].systemOid,
                        view: vis.binds.materialdesign.helper.getViewOfWidget(wid),
                        widget: wid
                    }]
                }
            }
        }

        return result;
    },
    subscribeStatesAtRuntime(wid, widgetName, callback, debug = false) {
        // modified from vis.js -> https://github.com/ioBroker/ioBroker.vis/blob/2a08ee6da626a65b9d0b42b8679563e74272bfc6/www/js/vis.js#L2710

        if (debug) console.log(`[subscribeStatesAtRuntime] ${widgetName} (${wid}) subscribe states at runtime`);

        let view = vis.binds.materialdesign.helper.getViewOfWidget(wid);

        if (!view || vis.editMode) {
            if (callback) callback();
            return;
        }

        if (!vis.subscribing.activeViews.includes(view)) {
            vis.subscribing.activeViews.push(view);
        }

        vis.subscribing.byViews[view] = vis.subscribing.byViews[view] || [];

        // subscribe
        var oids = [];
        for (var i = 0; i < vis.subscribing.byViews[view].length; i++) {
            if (vis.subscribing.active.indexOf(vis.subscribing.byViews[view][i]) === -1) {
                vis.subscribing.active.push(vis.subscribing.byViews[view][i]);
                oids.push(vis.subscribing.byViews[view][i]);
            }
        }

        if (oids.length) {
            var that = vis;
            console.debug('[subscribeStatesAtRuntime] [' + Date.now() + '] Request ' + oids.length + ' states.');
            vis.conn._socket.emit('getStates', oids, function (error, data) {
                if (error) that.showError(error);

                that.updateStates(data);
                that.conn.subscribe(oids);
                if (callback) callback();
            });
        } else {
            if (callback) callback();
        }
    },
    calcChecker(prop, wid, widgetName, debug = false) {
        if (prop.includes("calc")) {
            console.error(`${widgetName} (${wid}) not supoort calc()! Use px or % instead! (${prop})`);
        } else {
            if (debug) console.log(`${widgetName} (${wid}) width: ${prop}`);
        }
    },
    formatNumber(value, minDigits = undefined, maxDigits = undefined) {
        if (!isNaN(parseFloat(value))) {
            value = parseFloat(value);
            if ((minDigits !== undefined && minDigits !== '') && (maxDigits !== undefined && maxDigits !== '')) {
                return value.toLocaleString(undefined, { minimumFractionDigits: minDigits, maximumFractionDigits: maxDigits });
            } else if (minDigits !== undefined && minDigits !== '') {
                return value.toLocaleString(undefined, { minimumFractionDigits: minDigits });
            } else if (maxDigits !== undefined && maxDigits !== '') {
                return value.toLocaleString(undefined, { maximumFractionDigits: maxDigits });
            }

            return value.toLocaleString();
        }
        // keine zahl
        return value;
    },
    getObject(id, callback) {
        vis.conn._socket.emit('getObject', id, function (err, obj) {
            if (!err && obj) {
                callback(obj)
            } else {
                callback(undefined)
            }
        });
    },
    getVersion(callback) {
        vis.binds.materialdesign.helper.getObject('system.adapter.vis-materialdesign', function (obj) {
            if (obj && obj.common && obj.common.installedVersion) {
                callback(obj.common.installedVersion);
            } else if (obj && obj.common && obj.common.version) {
                callback(obj.common.version);
            } else {
                callback('unknown');
            }
        });
    },
    setValue(id, value) {
        if (!vis.editMode) {
            vis.binds.materialdesign.helper.getObject(id, function (obj) {
                if (obj && obj.common && obj.common['type'] && value !== null) {
                    if (obj.common['type'] === 'string') {
                        vis.setValue(id, value.toString());
                    } else if (obj.common['type'] === 'number') {
                        vis.setValue(id, parseFloat(value));
                    } else if (obj.common['type'] === 'boolean') {
                        vis.setValue(id, !(/^(false|0)$/i).test(value.toString().toLowerCase()) && !!value);
                    } else {
                        vis.setValue(id, value);
                    }
                } else {
                    vis.setValue(id, value);
                }
            })
        }
    },
    generateUuidv4() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    },
    initializeSentry(version) {
        const fileName = 'materialdesign.sentry'

        vis.conn.readFile(fileName, function (err, data) {
            if (err === 'Not exists') {
                const uuid = vis.binds.materialdesign.helper.generateUuidv4();

                vis.conn.writeFile(fileName, uuid, function (err) {
                    if (!err) {
                        vis.binds.materialdesign.helper._initializeSentry(version, uuid);
                    } else {
                        vis.binds.materialdesign.helper._initializeSentry(version, 'uuid_error');
                    }
                });
            } else {
                if (data !== 'disabled') {
                    // TODO: check if is uuid format

                    if (/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(data)) {
                        vis.binds.materialdesign.helper._initializeSentry(version, data)
                    } else {
                        console.warn('uuid is not valid -> recreate');
                        const uuid = vis.binds.materialdesign.helper.generateUuidv4();

                        vis.conn.writeFile(fileName, uuid, function (err) {
                            if (!err) {
                                vis.binds.materialdesign.helper._initializeSentry(version, uuid);
                            } else {
                                vis.binds.materialdesign.helper._initializeSentry(version, 'uuid_error');
                            }
                        });
                    }
                } else {
                    console.log('sentry is deactivated for vis-materialdesign');
                }
            }
        })
    },
    _initializeSentry(version, uuid) {
        Sentry.init({
            dsn: 'https://888b0efc877b4b12a8a83e3c1fb7fe1a@sentry.iobroker.net/77',
            debug: false,
            release: version,
            integrations: [
                new Sentry.Integrations.Dedupe(),
                new Sentry.Integrations.CaptureConsole({
                    levels: ['error']
                })
            ],
            beforeSend(event) {
                // Modify the event here
                if (!vis.editMode && event && event.message && event.message.includes('materialdesign')) {
                    // only send to sentry, if error is at runtime and fired by MDW

                    if (!event.message.includes('cannot parse json string') &&                                                  // ignore json parse errors
                        !/\b(Cannot access)\b .* \b(before initialization)\b/g.test(event.message) &&                           // ignore lib init errors
                        !/\b(can't access lexical declaration)\b .* \b(before initialization)\b/g.test(event.message) &&        // ignore lib init errors
                        !event.message.includes('out of memory')
                    ) {

                        event.message = event.message.replace(new RegExp("( - w\\d+)", "g"), "");   // remove data.wid from message
                        return event;
                    }
                }
            }
        });

        Sentry.configureScope(function (scope) {
            scope.setExtra("vis version", vis.version);
            scope.setUser({ id: uuid });
        });

        console.log('sentry initialized for vis-materialdesign');
    }
};

let myMdwHelper = vis.binds.materialdesign.helper;
vis.binds.materialdesign.showVersion();