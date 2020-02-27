(function ($) {
    let workArea = $('#imapworkarea'),
        workAreaError = $('#imapworkareaError');

    workArea.show();
    workAreaError.hide();

    $(document).ready(function () {
        app.imap.init();
    });
})(jQuery);
