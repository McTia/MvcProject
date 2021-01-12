/**
* Theme: 
* Author: Alessandro
* Component: Editable
* 
*/

(function ($) {
    'use strict';
    $.fn.EditableRender = {
        date: function (data, type, row) {
            if (data === null) return "";
            return new Date(data).toLocaleDateString($('body').prop('lang'));
        },
        datetime: function (data, type, row) {
            if (data === null) return "";
            return new Date(data).toLocaleString($('body').prop('lang'));
        },
        check: function (data, type, row) {
            if (data === null) return "";
            if (type === "display")
                return '<div class="custom-control custom-checkbox"><input type="checkbox"' + ((data === false) ? "" : " checked ") + 'class="custom-control-input"><label class="custom-control-label"></label></div>'
            else return data;
        },
        singlefile: function (data, type, row) {
            var isobj = data != null && (data instanceof Object);
            var name = isobj ? data.name : '';
            if (name.length > 16) name = name.substring(0, 3) + "..." + name.substr(-10);
            if (type === "display")
                return (!data) ? "" :
                    '<a class="btn btn-purple btn-sm fileinput-button" href="/Dynamic/File/' +
                    (isobj ? data.refID : data) + '" download><i class="zmdi zmdi-download"></i> ' +
                    name + '</a>';
            return data;
        }, obj: function (data, type, row) {
            var isobj = data != null && (data instanceof Object);
            if (type === "display") {
                if (isobj) {
                    if (data.text) return data.text;
                    var keys = Object.keys(data);
                    for (var i = 0; i < keys; i++) {
                        if (keys[i] != 0 || keys[i] != "refID")
                            return data[keys[i]];
                    }
                }
            }
            return data;
        }

    };

    $.fn.EditableEditor = {
        'default': function (name, value, $row) {
            var input = $('<input type="text" class="form-control input-block" name="' + name + '"/>');
            if (value) input.val(value);
            $row.html(input);
        },
        date: function (name, value, $row) {
            var input = $('<input type="text" name="' + name + '" class="form-control" >');
            if (value) input.val(value);
            $('<div class="input-group"/>')
                .append(input, '<span class="input-group-addon"><i class="glyphicon glyphicon-calendar" ></i></span>')
                .appendTo($row.empty());
            input.datepicker();
        }
    };

    $.fn.EditableTable = function (tableOptions, intvars) {
        var options = $.extend(true, {},
            $.fn.EditableTable.defaults, {
            addButton: {
                wrapper: null,
                buttonIndex: 0
            },
            rowActions: {},
        }, intvars);

        options.tableOption = $.extend({
            "processing": true,
            "serverSide": true,
            "deferRender": true,
            "rowId": 'Id'
        }, tableOptions);

        var vars = {
            $table: $(this),
            $form: $(this).closest('form'),
            modalAction: null   //Action in modal form 
        }

        var rowActions = {
            add: function (buttons) {
                if (options.rowActions.add)
                    return options.rowActions.add(buttons);
                else {
                    var datacollection = vars.datatable.columns().flatten().map(function (v) { return ''; });
                    datacollection[datacollection.length - 1] = buttons.join(' ');
                    return datacollection;
                }
            }
        }

        var methods = {
            initialize: function () {
                this.setVars()
                    .build()
                    .events();
                return {
                    // return datatable option
                    getDT: function () {
                        return vars.datatable;
                    }
                };

            },
            setVars: function () {
                /// table Options ---
                if (!options.tableOption.columnDefs) options.tableOption.columnDefs = [];
                options.tableOption.columnDefs.push({
                    "targets": -1,
                    "orderable": false,
                    "createdCell": function (td, cellData, rowData, row, col) {
                        $(td).addClass('actions').html(options.rowButtons.join(' '));
                    }
                });

                options.tableOption.initComplete = function () {
                    if ($.fn.dataTable.defaults.oLanguage != null)
                        setTimeout(function () { methods.tableInitComplete(); }, 10);
                    else methods.tableInitComplete();
                }

                /// buttons -----
                if (!options.rowButtons) options.rowButtons = [
                    options.rowButton.edit,
                    options.rowButton.remove,
                    options.rowButton.save,
                    options.rowButton.cancel,
                ];

                /// dialog ----
                vars.dialog = {};
                vars.dialog.$wrapper = $(options.dialog.wrapper);
                vars.dialog.$cancel = $(options.dialog.cancelButton);
                vars.dialog.$confirm = $(options.dialog.confirmButton);
                /// OTHER ----
                //$jq wrapper of table
                vars.$table;
                //DataTable main object
                vars.datatable;
                //dataSrc of DataTable, useful when data bing with class
                vars.dataSrc;
                //bool indicate when data is looked up by index
                vars.dataSrcByIndex;
                //$jq for the Modal window
                vars.$addmodal;
                //$jq for the add button
                vars.$addButton;
                //(create|update) if edit or create new item
                vars.modalAction;
                //$jq wrapper for row that is in edit mode
                vars.$row;
                //id of the row in edit mode
                vars.rowid;

                return this;
            },

            build: function () {
                vars.datatable = vars.$table.DataTable(options.tableOption);
                vars.dataSrc = vars.datatable.settings().columns().dataSrc();
                vars.dataSrcByIndex = $.isNumeric(vars.dataSrc[0]);

                if (vars.dataSrcByIndex) {
                    vars.dataSrc = vars.datatable.columns().header().map(function (a) {
                        return jQuery.data(a, "name");
                    });
                }

                return this;
            },
            tableInitComplete: function () {
                if (options.tableOption.serverSide) {
                    vars.$addButton = (options.addButton.wrapper)
                        ? $(options.addButton.wrapper)
                        : vars.datatable.button(options.addButton.buttonIndex).to$();

                    if (!options.modal.wrapper && options.addButton.wrapper) {
                        vars.$addmodal = $(options.addButton.wrapper + '-modal');
                    } else if (options.modal.wrapper) {
                        vars.$addmodal = $(options.modal.wrapper);
                    }

                    vars.$addmodal.find(options.modal.confirmButton).click(this.modalClick);

                    if (!options.addButton.wrapper) {
                        vars.datatable.button(options.addButton.buttonIndex)
                            .action(methods.addClick);
                    } else {
                        vars.$addButton.on('click', methods.addClick);
                    }
                } else {
                    vars.$addButton.on('click', methods.addClick);
                }

            },
            events: function () {
                var _self = this;

                vars.$table
                    .on('click', 'a.save-row', function (e) {
                        e.preventDefault();

                        _self.rowSave($(this).closest('tr'));
                    })
                    .on('click', 'a.cancel-row', function (e) {
                        e.preventDefault();

                        _self.rowCancel($(this).closest('tr'));
                    })
                    .on('click', 'a.edit-row', function (e) {
                        e.preventDefault();
                        if (options.editType == 'inline')
                            _self.rowEdit($(this).closest('tr'));
                        else
                            _self.rowEditModal($(this).closest('tr'));
                    })
                    .on('click', 'a.remove-row', function (e) {
                        e.preventDefault();
                        var $row = $(this).closest('tr');
                        $.fn.popItUp({
                            wrapper: "#dialog-delete",
                            confirm: options.dialog.confirmButton,
                            cancel: options.dialog.cancelButton,
                            callbacks: {
                                okaction: function () {
                                    _self.rowRemove($row);
                                    vars.dialog.$confirm.off('click');
                                },
                                closeaction: function () {
                                    vars.dialog.$confirm.off('click');
                                }
                            },
                            animtype: options.deletemodal.animtype,
                            anispeed: options.deletemodal.anispeed
                        });
                        /**------------- OLD ----------------------------------*/
                        /**
                        $.magnificPopup.open({
                            items: {
                                src: options.dialog.wrapper,
                                type: 'inline'
                            },
                            preloader: false,
                            modal: true,
                            callbacks: {
                                change: function () {
                                    vars.dialog.$confirm.on('click', function (e) {
                                        e.preventDefault();

                                        _self.rowRemove($row);
                                        $.magnificPopup.close();
                                    });
                                },
                                close: function () {
                                    vars.dialog.$confirm.off('click');
                                }
                            }
                        });*/
                        /**------------- OLD ----------------------------------*/
                    });

                vars.dialog.$cancel.on('click', function (e) {
                    e.preventDefault();
                    $.magnificPopup.close();
                });

                return this;
            },

            addClick: function (e) {
                e.preventDefault();
                if (options.tableOption.serverSide)
                    methods.rowAddModal();
                else
                    methods.rowAdd();
            },

            modalClick: function (e) {
                var $modalform = vars.$addmodal.closest('form');
                if ($.isFunction($modalform.valid) && !$modalform.valid())
                    return;

                var postdata = vars.$addmodal.find(':input').serialize();
                if (vars.modalAction === "update")
                    postdata += ("&" + options.tableOption.rowId + "=" + vars.rowid);
                methods.callAjax(vars.modalAction, postdata, function (data) {
                    if (data.errors) {
                        methods.rowError(null, vars.modalAction, data.errors);
                    } else {
                        vars.datatable.draw();
                        vars.$addmodal.modal('hide');
                    }
                });
            },
            // ==========================================================================================
            // ROW FUNCTIONS
            // ==========================================================================================

            //return dvalue of data with idx
            dataValue: function (data, idx) {
                return (vars.dataSrcByIndex)
                    ? data[idx] : data[vars.dataSrc[idx]];
            },

            rowAddModal: function () {
                vars.modalAction = 'create';
                var modal = vars.$addmodal;
                modal.find("#rh-action")
                    .text(vars.datatable.i18n('editable.' + vars.modalAction, 'Create'));
                modal.closest('form')[0].reset();
                for (var i = 0; i < vars.dataSrc.length - 1; i++) {
                    var name = vars.dataSrc[i];
                    if (!name) continue;
                    var $input = vars.$addmodal.find('[name="' + name + '"]');
                    $input.trigger('reset');
                }
                //modify for select2 that not reset:
                modal.find(".select2-hidden-accessible").trigger('change');
                modal.modal('show');
            },
            rowAdd: function () {
                vars.$addButton.attr({ 'disabled': 'disabled' });

                var data,
                    $row;

                data = vars.datatable.row.add(rowActions.add(options.rowButtons));
                $row = vars.datatable.row(data[0]).nodes().to$();

                this.rowEdit($row);

                // if async will be disabed
                vars.datatable.order([0, 'asc']).draw(); // always show fields
            },

            rowCancel: function ($row) {
                var _self = this,
                    $actions,
                    i,
                    data;

                if ($row.hasClass('adding')) {
                    this.rowRemove($row);
                } else {

                    data = vars.datatable.row($row.get(0)).data();
                    $row.children('td').each(function (i) {
                        var $this = $(this);
                        if ($this.hasClass('actions')) {
                            _self.rowSetActionsDefault($row);
                            $this.find('input[type=hidden]').prop('disabled', true);
                        } else {
                            $this.html(_self.dataValue(data, i));
                        }
                    });

                    vars.$row = null;
                }
            },

            rowEditModal: function ($row) {
                var _self = this,
                    data, id;
                data = vars.datatable.row($row.get(0)).data();
                vars.rowid = _self.dataValue(data, data.length - 1);
                vars.modalAction = 'update';
                vars.$addmodal.find("#rh-action")
                    .text(vars.datatable.i18n('editable.' + vars.modalAction, 'Update'));
                for (var i = 0; i < data.length - 1; i++) {
                    var name = vars.dataSrc[i];
                    var value = _self.dataValue(data, i);
                    var isobj = (value !== null && value instanceof Object);
                    //Replace holder
                    !isobj && vars.$addmodal.find('#rh-index' + i).text(value);
                    //Set values
                    if (!name) continue;
                    var $input = vars.$addmodal.find('[name="' + name + '"]');
                    if (options.modal.binder.call(_self, i, name, value, $input))
                        $input.trigger("change", value);
                }
                vars.$addmodal.modal('show');

            },

            rowEdit: function ($row) {
                if (vars.$row) this.rowCancel(vars.$row);
                vars.$row = $row;

                var _self = this,
                    data, colcells;
                data = vars.datatable.row($row.get(0)).data();
                colcells = vars.datatable.columns().header();

                $row.children('td').each(function (i) {
                    var $this = $(this);

                    if ($this.hasClass('actions')) {
                        _self.rowSetActionsEditing($row);
                    } else {
                        var editor, name = vars.dataSrc[i];
                        var editorType = $(colcells[i]).data('type') || 'default';
                        if (name && editorType !== "fixed") {
                            var value = _self.dataValue(data, i);
                            if (editor = $.fn.EditableEditor[editorType])
                                editor(name, value, $this);
                        }
                    }
                });
            },

            rowSave: function ($row) {
                var _self = this,
                    data, id;

                if ($row.hasClass('adding')) {
                    vars.$addButton.removeAttr('disabled');
                    $row.removeClass('adding');
                }
                data = vars.datatable.row($row.get(0)).data();
                id = _self.dataValue(data, data.length - 1);

                this.callAjax('update', vars.$form.serialize() + "&" + options.tableOption.rowId + "=" + id, function (data) {
                    if (data.errors) {
                        methods.rowError($row, 'update', data.errors)
                    } else {
                        vars.datatable.draw();
                    }
                });
            },

            callAjax: function (action, data, cb) {
                $.ajax({
                    type: vars.$form.attr('method'),
                    url: vars.$form.attr('action') + '?m=' + action,
                    data: data
                })
                    .done(cb)
                    .fail(function (xhr, ajaxOptions, thrownError) {
                        alert("STATUS:" + xhr.status + " " + thrownError);
                    });
            },

            rowRemove: function ($row) {
                var _self = this,
                    data, id;

                if ($row.hasClass('adding')) {
                    vars.$addButton.removeAttr('disabled');
                }
                data = vars.datatable.row($row.get(0)).data();
                id = _self.dataValue(data, data.length - 1);

                this.callAjax('delete', options.tableOption.rowId + "=" + id, function (data) {
                    if (data.errors) {
                        methods.rowError($row, 'delete', data.errors)
                    } else {
                        vars.datatable.draw();
                    }
                });

                //vars.datatable.row($row.get(0)).remove().draw();
            },

            rowError: function ($row, action, errors) {
                errors.map(function (error) {
                    return alert(error);
                });
                
                //
                //$.magnificPopup.open({
                //    items: {
                //        src: '<div id="dialog" class="modal-block">' +
                //            '<section class="panel panel-danger panel-color">' +
                //            '<div class="panel-heading"><h2 class="panel-title">Error</h2></div>' +
                //            '<div class="panel-body"><div class="modal-wrapper">' +
                //            '<div class="modal-text"><ul>' + errors.map(function (error) {
                //                return $('<li>', { text: error }).html()
                //            }).join('') +
                //            '</ul></div></div></div></section></div>',
                //        type: 'inline'
                //    }
                //});
            },

            rowSetActionsEditing: function ($row) {
                $row.find('.on-editing').show();
                $row.find('.on-default').hide();
            },

            rowSetActionsDefault: function ($row) {
                $row.find('.on-editing').hide();
                $row.find('.on-default').show();
            }
        }

        return methods.initialize();

    }
    //Here all default EditableTable properties
    $.fn.EditableTable.defaults = {
        rowButton: {
            edit: '<a href="#" class="btn btn-xs btn-secondary on-default edit-row"><i class="mdi mdi-pencil"></i></a>',
            save: '<a href="#" class="btn btn-xs btn-secondary on-editing save-row" style="display:none;"><i class="mdi mdi mdi-content-save"></i></a>',
            cancel: '<a href="#" class="btn btn-xs btn-secondary on-editing cancel-row" style="display:none;"><i class="mdi mdi mdi mdi-cancel"></i></a>',
            remove: '<a href="#" class="btn btn-xs btn-secondary on-default remove-row"><i class="mdi mdi mdi mdi-delete"></i></a>'
        },
        dialog: {
            wrapper: '#dialog',
            cancelButton: '#dialogCancel',
            confirmButton: '#dialogConfirm',
        },
        modal: {
            wrapper: '#addToTable-modal',
            confirmButton: 'button.btn-dt-confirm',
            binder: function (i, name, value, $input) {
                if ($input.is(':checkbox')) {
                    $input.prop('checked', value);
                    return true;
                } else {
                    var old = $input.val();
                    var valueType = value;
                    if ((value instanceof Object) && value.refID) {
                        valueType = value.refID;
                    }
                    if ((value instanceof Object) && value.text) {
                        if ($input.is("select") && !$input.find("option[value='" + valueType + "']").length) {
                            $input.append(new Option(value.text, valueType, false, true))
                        }
                    }
                    $input.val(valueType);
                    if ($input.data('datepicker')) $input.datepicker('update');
                    return (old !== valueType);
                }
            }
        },
        editType: 'inline',
        deletemodal: {
            animtype: "slide",
            anispeed: {
                in: "fast",
                out: "fast"
            }
        }
    };

    $.fn.dataTable.ext.buttons.add = $.fn.EditableTable.AddButton = {
        text: function (dt, button, config) {
            return dt.i18n('buttons.add', 'Add');
        },
        className: 'btn-sm'
    };

    $.fn.EditableTable.CopyButton = {
        extend: 'copy',
        text: function (dt, button, config) {
            return dt.i18n('buttons.copy', 'Copy');
        },
        className: 'btn-sm'
    };

})(jQuery);