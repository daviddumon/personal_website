var Shell = function () {

    var shell = $("#shell");
    var prompt = $("#active_prompt");
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

    append_text_list = function (texts) {
        var line_data = {
            texts:texts
        };
        var text_list_line = ich.text_list_line(line_data);
        shell.append(text_list_line);
    };

    append_html = function (data) {
        var html = {html_block:data};
        var block = ich.html_block(html);
        shell.append(block);
    };

    unknown_command = function () {
        $.get("contents/unknown.html", function (data) {
            append_html(data);
            show_prompt();
        });
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

    show_prompt = function () {
        prompt.show();
    };

    hide_prompt = function () {
        prompt.hide();
    };
};

Shell.prototype = {

    execute:function (prompt_command) {
        hide_prompt();
        append_prompt(prompt_command);
        add_to_history(prompt_command);
        var command = getCommand(prompt_command);

        if (this[command] !== undefined) {
            this[command]();
        } else {
            unknown_command();
            show_prompt();
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
                if (command.indexOf('_') != -1) {
                    command = command.replace(/_/g, ' ');
                    command = command + " ?";
                }
                texts.push(command);
            }
        });
        append_text_list(texts);
        show_prompt();
    },

    quit:function () {
        $.get("contents/quit.html", function (data) {
            append_html(data);
            show_prompt();
        });
    },

    clear:function () {
        $("#shell").empty();
        show_prompt();
    },

    welcome:function () {
        $.get("contents/welcome.html", function (data) {
            append_html(data);
            show_prompt();
        });
    },

    is_the_earth_hollow:function () {
        $.get("contents/hollow.html", function (data) {
            append_html(data);
            show_prompt();
        });
    },

    projects:function () {
        $.get("contents/projects.html", function (data) {
            append_html(data);
            show_prompt();
        });
    },

    twitter:function () {
        $.get("contents/twitter.html", function (data) {
            append_html(data);
            show_prompt();
        });
    },

    contact:function () {
        $.get("contents/contact.html", function (data) {
            append_html(data);
            show_prompt();
        });
    },

    languages:function () {
        $.get("contents/languages.html", function (data) {
            append_html(data);
            show_prompt();
        });
    },

    what_do_you_like:function () {
        $.get("contents/like.html", function (data) {
            append_html(data);
            show_prompt();
        });
    },

    tools:function () {
        $.get("contents/tools.html", function (data) {
            append_html(data);
            show_prompt();
        });
    }

    //communities
    //identities
    //sentences
    //masters
    //resume
    //viadeo
    //linkedin
    //formation
    //reading list
    //book reviews
};