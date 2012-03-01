var Shell = function () {

    var shell = $("#shell");
    var history = [];
    var history_index = 0;

    $.ajaxSetup({"error":function (XMLHttpRequest, textStatus, errorThrown) {
        console.log(textStatus);
        console.log(errorThrown);
        console.log(XMLHttpRequest.responseText);
    }});

    append_prompt = function (command) {
        var prompt_data = {command:command};
        var prompt_line = ich.prompt_line(prompt_data);
        shell.append(prompt_line);
    };

    append_text = function (text) {
        var line_data = {texts:text.split(/\r\n|\r|\n/)};
        var text_line = ich.text_line(line_data);
        shell.append(text_line);
    };

    append_text_list = function (texts) {
        var line_data = {
            texts:texts
        };
        var text_list_line = ich.text_list_line(line_data);
        shell.append(text_list_line);
    };

    append_link = function (link, text) {
        var link_data = {
            link:link,
            link_text:text
        };
        var link_line = ich.link_line(link_data);
        shell.append(link_line);
    };

    append_drawing = function (data) {
        var drawing_data = {drawing:data};
        var drawing_line = ich.drawing_line(drawing_data);
        shell.append(drawing_line);
    };

    append_html = function(data) {
        var html = {html_block:data};
        var block = ich.html_block(html)
        shell.append(block);
    },

    unknown_command = function () {
        append_text("unknown command :(");
    };

    is_not_hidden = function (command) {
        return (command !== "is_the_earth_hollow")
            && (command !== "execute")
            && (command !== "next_command_history")
            && (command !== "previous_command_history");
    };

    add_to_history = function (command) {
        history.push(command);
        history_index = history.length;
    };

    history_next = function () {
        if (history_index > 0) {
            history_index--;
        }
        return history[history_index]
    };

    history_previous = function () {
        if (history_index < history.length - 1) {
            history_index++;
        }
        return history[history_index];
    };
};

Shell.prototype = {

    execute:function (prompt_command) {
        append_prompt(prompt_command);
        add_to_history(prompt_command);
        var command = getCommand(prompt_command);

        if (this[command] !== undefined) {
            this[command]();
        } else {
            unknown_command();
        }

        function getCommand(prompt_command) {
            var command_without_spaces = prompt_command.replace(/ /g, '_');
            var command_without_question_mark = command_without_spaces.replace(/_+\?/, '');
            return command_without_question_mark.toLowerCase();
        }
    },

    next_command_history:function () {
        return history_next();
    },

    previous_command_history:function () {
        return history_previous();
    },

    commands:function () {
        var texts = [];
        $.each(this.__proto__, function (command) {
            if (is_not_hidden(command)) {
                texts.push(command);
            }
        });
        append_text_list(texts);
    },

    quit:function () {
        $.get("contents/quit.txt", function (data) {
            append_text(data);
        });
    },

    clear:function () {
        $("#shell").empty();
    },

    welcome:function () {
        $.get("contents/ascii.txt", function (data) {
            append_drawing(data);
        });
        $.get("contents/welcome.txt", function (data) {
            append_text(data);
        });
    },

    is_the_earth_hollow:function () {
        $.get("contents/hollow.txt", function (data) {
            append_text(data);
        });
    },

    projects:function () {
        $.getJSON("contents/projects.json", function (data) {
            $.each(data, function (index, value) {
                append_link(value.url, value.title);
            });
        });
    },

    twitter:function () {
        $.get("contents/twitter.html", function (data) {
            append_html(data);
        });
    }
};