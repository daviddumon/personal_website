$(function () {
    var shell = new Shell();
    shell.execute("welcome");

    $("#prompt").keydown(function () {
        if(isEnterKey()) {
            shell.execute($("#prompt").val())
            $("#prompt").val("");
            $(window).scrollTop($("#prompt").offset().top);
        }
    });

    function isEnterKey() {
        return event.keyCode == 13;
    }
});