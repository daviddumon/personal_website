var shell_tests = new TestCase("shell");

var old_getJSON = $.getJSON;
var old_get = $.get;

shell_tests.prototype = {

    addHtmlElementsForTest:function () {
        /*:DOC += <div>
         <div id="shell"></div>
         <input id="prompt" />
         </div> */
    },

    addTemplatesForTest:function () {
        ich.addTemplate('prompt_line', "<p class='prompt element'>/> {{command}}</p>");
        ich.addTemplate('text_line', "{{#texts}}<p class='line element'>{{.}}&nbsp;</p>{{/texts}}");
        ich.addTemplate('text_list_line', "<p class='line element'>{{#texts}}[&nbsp;{{.}}&nbsp;]&nbsp;{{/texts}}</p>");
        ich.addTemplate('link_line', "<p class='element'><a href='{{link}}' target='_blank' class='element'>{{link_text}}</a></p>");
        ich.addTemplate('drawing_line', "<pre class='element'>{{drawing}}</pre>");
        ich.addTemplate('html_block', "<div class='html_block'>{{{html_block}}}</div>");
    },

    override_getjson:function (data) {
        $.getJSON = function (url, callback) {
            var jqxhr = {
                complete:function () {
                }
            };
            callback(data);
            return jqxhr;
        };
    },

    override_get:function (data) {
        $.get = function (url, callback) {
            callback(data);
        };
    },

    setUp:function () {
        this.addHtmlElementsForTest();
        this.addTemplatesForTest();
    },

    tearDown:function () {
        $.getJSON = old_getJSON;
        $.get = old_get;
    },

    test_can_create_a_shell:function () {
        var shell = new Shell();
    },

    test_has_a_shell_and_prompt:function () {
        assertNotNull(document.getElementById("shell"));
        assertNotNull(document.getElementById("prompt"));
    },

    test_can_execute_unknown_command:function () {
        var shell = new Shell();

        shell.execute("hello");

        assertEquals(2, document.getElementsByTagName("p").length);
        assertSame("/&gt; hello", document.getElementsByTagName("p")[0].innerHTML);
        assertSame("unknown command :(&nbsp;", document.getElementsByTagName("p")[1].innerHTML);
    },

    test_can_execute_real_command:function () {
        this.override_get("i wish i could ...");
        var shell = new Shell();

        shell.execute("quit");

        assertSame("i wish i could ...&nbsp;", document.getElementsByTagName("p")[1].innerHTML);
    },

    test_can_clear_the_shell:function () {
        var shell = new Shell();
        shell.execute("hello");

        shell.execute("clear");

        assertEquals(0, document.getElementsByTagName("p").length);
    },

    test_can_append_text_list_to_shell:function () {
        var shell = new Shell();

        shell.execute("commands");

        assertSame("[&nbsp;commands&nbsp;]&nbsp;[&nbsp;quit&nbsp;]&nbsp;[&nbsp;clear&nbsp;]&nbsp;", getFirstCommandsOnly());

        function getFirstCommandsOnly() {
            return document.getElementsByTagName("p")[1].innerHTML.substring(0, 77);
        }
    },

    test_can_append_link_to_shell:function () {
        this.override_getjson([
            {"url":"http://www.steambeat.com", "title":"steambeat"}
        ]);
        var shell = new Shell();

        shell.execute("projects");

        assertSame('<a href=\"http://www.steambeat.com\" target=\"_blank\" class=\"element\">steambeat</a>', document.getElementsByTagName("p")[1].innerHTML);
    },

    test_can_append_drawing_to_shell:function () {
        this.override_get("-_-");
        var shell = new Shell();

        shell.execute("welcome");

        assertSame('-_-', document.getElementsByTagName("pre")[0].innerHTML);
    },

    test_can_get_command_history:function () {
        var shell = new Shell();

        shell.execute("welcome");
        shell.execute("test");
        shell.execute("yarg");

        assertSame("yarg", shell.next_command_history());
        assertSame("test", shell.next_command_history());
        assertSame("welcome", shell.next_command_history());
        assertSame("welcome", shell.next_command_history());
        assertSame("test", shell.previous_command_history());
        assertSame("yarg", shell.previous_command_history());
        assertSame("yarg", shell.previous_command_history());
    },

    test_can_add_html_block:function () {
        this.override_get("<p>html</p>");
        var shell = new Shell();

        shell.execute("twitter");

        assertSame('<p>html</p>', document.getElementsByClassName("html_block")[0].innerHTML);
    },

    test_can_understand_upper_case:function () {
        this.override_get("<p>html</p>");
        var shell = new Shell();

        shell.execute("Twitter");

        assertSame('<p>html</p>', document.getElementsByClassName("html_block")[0].innerHTML);
    }
};