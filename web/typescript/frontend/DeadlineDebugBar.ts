export class DeadlineDebugBar {
    constructor(private $widget: JQuery) {
        const csrf = $widget.find('> input[name=_csrf]').val();

        $widget.submit(ev => ev.preventDefault());

        $widget.find('.closeCol button').click(() => {
            $.post($widget.attr('action'), {
                '_csrf': csrf,
                'action': 'close'
            }, (ret) => {
                if (ret['success']) {
                    window.location = window.location.href; // Reload ignoring POST data
                } else {
                    alert(ret['error']);
                }
            });
        });

        const $picker = $widget.find('#simulateAdminTime');
        $picker.datetimepicker({
            locale: $picker.find('input').data('locale')
        });
        
        $widget.find('.setTime').click(() => {
            const time = $picker.find('input').val();
            $.post($widget.attr('action'), {
                '_csrf': csrf,
                'action': 'setTime',
                'time': time
            }, (ret) => {
                if (ret['success']) {
                    window.location = window.location.href; // Reload ignoring POST data
                } else {
                    alert(ret['error']);
                }
            });
        });
    }
}