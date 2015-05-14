/*global browser: true, regexp: true */
/*global $, jQuery, alert, confirm, console, document, Sortable */
/*jslint regexp: true*/


(function ($) {
    "use strict";

    var consultationEditForm = function () {
        var lang = $('html').attr('lang');

        $("#antrag_neu_kann_telefon").change(function () {
            if ($(this).prop("checked")) {
                $("#antrag_neu_braucht_telefon_holder").show();
            } else {
                $("#antrag_neu_braucht_telefon_holder").hide();
            }
        }).trigger("change");

        $('#deadlineAmendmentsHolder').datetimepicker({
            locale: lang
        });
        $('#deadlineMotionsHolder').datetimepicker({
            locale: lang
        });
    };


    var sectionsEdit = function () {
        var $list = $('#sectionsList'),
            newCounter = 0;

        $list.data("sortable", Sortable.create($list[0], {
            handle: '.drag-handle',
            animation: 150
        }));
        $list.on('click', 'a.remover', function (ev) {
            ev.preventDefault();
            var $sectionHolder = $(this).parents('li').first(),
                delId = $sectionHolder.data('id');
            $('.adminSectionsForm').append('<input type="hidden" name="sectionsTodelete[]" value="' + delId + '">');
            $sectionHolder.remove();
        });
        $list.on('change', '.sectionType', function () {
            var $li = $(this).parents('li').first(),
                val = parseInt($(this).val());
            $li.removeClass('title textHtml textSimple image tabularData');
            if (val === 0) {
                $li.addClass('title');
            } else if (val === 1) {
                $li.addClass('textSimple');
            } else if (val === 2) {
                $li.addClass('textHtml');
            } else if (val === 3) {
                $li.addClass('image');
            } else if (val === 4) {
                $li.addClass('tabularData');
                if ($li.find('.tabularDataRow ul > li').length == 0) {
                    $li.find('.tabularDataRow .addRow').click().click().click();
                }
            }
        });
        $list.find('.sectionType').trigger('change');
        $list.on('change', '.maxLenSet', function () {
            var $li = $(this).parents('li').first();
            if ($(this).prop('checked')) {
                $li.addClass('maxLenSet').removeClass('no-maxLenSet');
            } else {
                $li.addClass('no-maxLenSet').removeClass('maxLenSet');
            }
        });
        $list.find('.maxLenSet').trigger('change');

        $('.sectionAdder').click(function (ev) {
            ev.preventDefault();
            var newStr = $('#sectionTemplate').html();
            newStr = newStr.replace(/#NEW#/g, 'new' + newCounter);
            var $newObj = $(newStr);
            $list.append($newObj);
            newCounter = newCounter + 1;

            $list.find('.sectionType').trigger('change');
            $list.find('.maxLenSet').trigger('change');

            var $tab = $newObj.find('.tabularDataRow ul');
            $tab.data("sortable", Sortable.create($tab[0], {
                handle: '.drag-data-handle',
                animation: 150
            }));
        });

        var dataNewCounter = 0;
        $list.on('click', '.tabularDataRow .addRow', function (ev) {
            console.log(dataNewCounter);
            ev.preventDefault();
            var $this = $(this),
                $ul = $this.parent().find("ul"),
                $row = $($this.data('template').replace(/#NEWDATA#/g, 'new' + dataNewCounter++));
            $row.removeClass('no0').addClass('no' + $ul.children().length);
            $ul.append($row);
            $row.find('input').focus();
        });

        $list.on('click', '.tabularDataRow .delRow', function (ev) {
            ev.preventDefault();
            if (!confirm('Diese Angabe wirklich löschen?')) {
                return;
            }
            $(this).parents("li").first().remove();
        });

        $list.find('.tabularDataRow ul').each(function () {
            var $this = $(this);
            $this.data("sortable", Sortable.create(this, {
                handle: '.drag-data-handle',
                animation: 150
            }));
        });

    };


    var agendaEdit = function () {
        var adderClasses = 'agendaItemAdder mjs-nestedSortable-no-nesting mjs-nestedSortable-disabled',
            adder = '<li class="' + adderClasses + '"><a href="#"><span class="glyphicon glyphicon-plus-sign"></span> Eintrag hinzufügen</a></li>',
            prepareAgendaItem = function ($item) {
                $item.find('> div').prepend('<span class="glyphicon glyphicon-resize-vertical moveHandle"></span>');
                $item.find('> div > h3').append('<a href="#" class="editAgendaItem"><span class="glyphicon glyphicon-pencil"></span></a>');
                $item.find('> div > h3').append('<a href="#" class="delAgendaItem"><span class="glyphicon glyphicon-minus-sign"></span></a>');
            },
            prepareAgendaList = function ($list) {
                $list.append(adder);
            },
            $agenda = $('.motionListAgenda');

        $agenda.addClass('agendaListEditing');
        $agenda.nestedSortable({
            handle: '.moveHandle',
            items: 'li.agendaItem',
            toleranceElement: '> div',
            placeholder: 'movePlaceholder',
            tolerance: 'pointer',
            forcePlaceholderSize: true,
            helper: 'clone',
            axis: 'y'
        });
        $agenda.find('.agendaItem').each(function () {
            prepareAgendaItem($(this));
        });
        prepareAgendaList($agenda);
        $agenda.find('ol.agenda').each(function () {
            prepareAgendaList($(this));
        });

        $agenda.on('click', '.agendaItemAdder a', function (ev) {
            ev.preventDefault();
            var $newElement = $($('#agendaNewElementTemplate').val()),
                $adder = $(this).parents('.agendaItemAdder').first();
            $adder.before($newElement);
            prepareAgendaItem($newElement);
            prepareAgendaList($newElement.find('ol.agenda'));
        });

        $agenda.on('click', '.delAgendaItem', function (ev) {
            ev.preventDefault();
            if (!confirm('Do you really want to delete this agenda item, including all sub-items?')) {
                return;
            }
            $(this).parents('li.agendaItem').first().remove();
        });

        $agenda.on('click', '.editAgendaItem', function (ev) {
            ev.preventDefault();
            $(this).parents('li.agendaItem').first().addClass('editing');
        });

        $agenda.on('submit', '.agendaItemEditForm', function (ev) {
            ev.preventDefault();
            $(this).parents('li.agendaItem').first().removeClass('editing');
        });
    };

    $.AntragsgruenAdmin = {
        'consultationEditForm': consultationEditForm,
        'sectionsEdit': sectionsEdit,
        'agendaEdit': agendaEdit
    };

}(jQuery));
