var shell_tests = new TestCase("shell");

var old_get = $.get;

shell_tests.prototype = {

    addHtmlElementsForTest:function () {
        /*:DOC += <div>
         <div id="shell"></div>
         <div id="active_prompt"><input id="prompt" /></div>
         </div> */
    },

    addTemplatesForTest:function () {
        ich.addTemplate('prompt_line', "<p class='prompt element'>/> {{command}}</p>");
        ich.addTemplate('text_list_line', "<p class='line element'>{{#texts}}[&nbsp;{{.}}&nbsp;]&nbsp;{{/texts}}</p>");
        ich.addTemplate('html_block', "<div class='html_block'>{{{html_block}}}</div>");
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
        $.get = old_get;
    },

    test_can_create_a_shell:function () {
        var shell = new Shell();
    },

    test_has_a_shell_and_prompt:function () {
        assertNotNull(document.getElementById("shell"));
        assertNotNull(document.getElementById("prompt"));
        assertTrue($("#active_prompt").is(":visible"));
    },

    test_can_execute_unknown_command:function () {
        this.override_get("<p>unknown command :(&nbsp;</p>");
        var shell = new Shell();

        shell.execute("hello");

        assertEquals(2, document.getElementsByTagName("p").length);
        assertSame("/&gt; hello", document.getElementsByTagName("p")[0].innerHTML);
        assertSame("unknown command :(&nbsp;", document.getElementsByTagName("p")[1].innerHTML);
        assertTrue($("#active_prompt").is(":visible"));
    },

    test_can_execute_real_command:function () {
        this.override_get("<p>i wish i could ...&nbsp;</p>");
        var shell = new Shell();

        shell.execute("quit");

        assertSame("i wish i could ...&nbsp;", document.getElementsByTagName("p")[1].innerHTML);
        assertTrue($("#active_prompt").is(":visible"));
    },

    test_can_clear_the_shell:function () {
        var shell = new Shell();
        shell.execute("hello");

        shell.execute("clear");

        assertEquals(0, document.getElementsByTagName("p").length);
        assertTrue($("#active_prompt").is(":visible"));
    },

    test_can_append_text_list_to_shell:function () {
        var shell = new Shell();

        shell.execute("commands");

        assertSame("[&nbsp;commands&nbsp;]&nbsp;[&nbsp;quit&nbsp;]&nbsp;[&nbsp;clear&nbsp;]&nbsp;", getFirstCommandsOnly());

        function getFirstCommandsOnly() {
            return document.getElementsByTagName("p")[1].innerHTML.substring(0, 77);
        }
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