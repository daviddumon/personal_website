$(function () {
    var shell = new Shell();
    shell.execute("welcome");

    $(window).keypress(function(event) {
        $("#prompt").focus();
    });

    $("#prompt").keydown(function (event) {
        if (isEnterKey(event)) {
            shell.execute($("#prompt").val())
            $("#prompt").val("");
            $(window).scrollTop($("#prompt").offset().top);
        }
        if (isUpKey(event)) {
            $("#prompt").val(shell.next_command_history());
        }
        if (isDownKey(event)) {
            $("#prompt").val(shell.previous_command_history());
        }
    });

    function isEnterKey(event) {
        return event.which == 13;
    }

    function isUpKey(event) {
        return event.which == 38;
    }

    function isDownKey(event) {
        return event.which == 40;
    }
});