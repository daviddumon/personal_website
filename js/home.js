$(function () {
    var shell = new Shell();
    shell.execute("welcome");

    $(window).keypress(function (event) {
        if (!$("#prompt_input").is(":focus")) {
            $("#prompt_input").focus();
        }
    });

    $("#prompt_input").keydown(function (event) {
        if (isEnterKey(event)) {
            shell.execute($("#prompt_input").val())
            $("#prompt_input").val("");
            setTimeout(function () {
                $(window).scrollTop($(document).height());
            }, 200);

        }
        if (isUpKey(event)) {
            $("#prompt_input").val(shell.next_command_history());
        }
        if (isDownKey(event)) {
            $("#prompt_input").val(shell.previous_command_history());
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
