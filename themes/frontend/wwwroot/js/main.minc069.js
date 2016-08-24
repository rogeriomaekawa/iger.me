$(function() {
    $(".fancybox").fancybox({
        padding: 0
    });
    $("*[data-checked]").each(function() {
        var $inp = $(this);
        $inp.prop("checked", $inp.data("checked"))
    });
    $("*[data-selected]").each(function() {
        var $inp = $(this);
        $inp.find('option[value="' + $inp.data("selected") + '"]').prop("selected", true)
    });
    $("*[data-disabled]").each(function() {
        var $inp = $(this);
        $inp.prop("disabled", $inp.data("disabled"))
    });
    $("*[data-hidden]").each(function() {
        var $el = $(this),
            hidden = $el.data("hidden");
        if (hidden) {
            $el.css("display", "none");
            $el.addClass("hidden")
        } else {
            $el.css("display", "");
            $el.removeClass("hidden")
        }
    });
    $('[data-toggle="tooltip"]').tooltip({
        animation: false,
        html: true,
        placement: "top",
        trigger: "hover focus",
        container: "body"
    });
    $('[data-toggle="popover"], .help-tip').popover({
        animation: false,
        html: true,
        placement: "top",
        trigger: "hover focus",
        container: "body"
    });
    $(document.body).on("popup.do-close", ".popup", function() {
        var popupId = $(this).attr("id");
        if (!popupId) {
            throw new Error("Popup without ID attribute cannot be closed this way")
        }
        var $popup = $("#" + popupId);
        $popup.popupClose();
        var formsTriggered = 0;
        $("form", $popup).each(function() {
            var $form = $(this);
            $form.trigger("popup.close");
            formsTriggered++
        });
        if (formsTriggered === 0) {
            $(document.body).trigger("popup.close")
        }
    });
    $(document.body).on("popup.do-open", ".popup", function() {
        var popupId = $(this).attr("id");
        if (!popupId) {
            throw new Error("Popup without ID attribute cannot be opened this way")
        }
        var $popup = $("#" + popupId);
        $popup.popup({
            shadow: true
        });
        $popup.find("*[autofocus]").focus();
        var formsTriggered = 0;
        $("form", $popup).each(function() {
            var $form = $(this);
            $form.trigger("popup.open");
            formsTriggered++
        });
        if (formsTriggered === 0) {
            $(document.body).trigger("popup.open")
        }
    });
    $(document.body).on("click", "*[data-popup-close]", function(e) {
        e.preventDefault();
        var $btn = $(this);
        var $popup = $($btn.data("popup-close"));
        if ($popup.data("popup-modal")) {
            return
        }
        $popup.trigger("popup.do-close")
    });
    $(document.body).on("click", "*[data-popup-open]", function(e) {
        e.preventDefault();
        var $btn = $(this);
        var $popup = $($btn.data("popup-open"));
        $popup.trigger("popup.do-open")
    });
    $("*[data-popup-auto]").each(function() {
        var popupId = $(this).attr("id");
        if (!popupId) {
            throw new Error("Popup without ID attribute cannot be auto-opened this way")
        }
        var $popup = $("#" + popupId);
        if ($popup.data("popup-auto")) {
            $popup.trigger("popup.do-open")
        }
    });
    (function() {
        var $popup = $("#popup-support"),
            $form = $("form", $popup),
            $inp = $("input[name=token]", $form);
        $popup.on("popup.open", function() {
            $.ajax({
                url: "/support/token/create",
                type: "post",
                dataType: "json"
            }).done(function(data) {
                if (data.status === "ok") {
                    $inp.val(data.token)
                } else {
                    if (data.error) {}
                }
            }).fail(function() {})
        });
        $popup.on("popup.close", function() {
            $.ajax({
                url: "/support/token/remove/" + $inp.val(),
                type: "post",
                dataType: "json"
            }).done(function(data) {
                if (data.status === "ok") {
                    $inp.val("")
                } else {
                    if (data.error) {}
                }
            }).fail(function() {})
        })
    })();
    $(document.body).on("click", "*[data-confirm]", function(e) {
        if (!confirm($(this).data("confirm"))) {
            e.preventDefault()
        }
    });
    $("form.form-ajax").each(function() {
        var $form = $(this);
        var $submit = $("*[type=submit]", $form);
        var $inputs = $("input, select, textarea, button", $form);
        var $alerts = $form.parent().find(".alerts .alert");
        var $alertSuccess = $alerts.filter(".alert-success");
        var $alertErrors = $alerts.filter(".alert-error");
        var $fieldWraps = $(".field-wrap", $form);
        var $fieldErrors = $(".text-error", $fieldWraps);
        $form.on("submit", function(e) {
            e.preventDefault();
            var action = $form.attr("action");
            var method = $form.attr("method");
            var params = helper.formArrayToObject($form.serializeArray());
            $submit.button("loading");
            $inputs.prop("disabled", true);
            $alerts.html("").hide();
            $fieldWraps.removeClass("error");
            $fieldErrors.text("").addClass("hidden");
            $.ajax({
                url: action,
                type: method,
                data: params,
                dataType: "json"
            }).done(function(data) {
                if (data.debug) {
                    console.log(data.debug)
                }
                if (data.message) {
                    alert(data.message)
                }
                if (data.success) {
                    $alertSuccess.html("<div>" + data.success + "</div>").show()
                }
                if (data.error) {
                    $alertErrors.html("<div>" + data.error + "</div>").show()
                }
                if (data.errors) {
                    var errorsHtml = "";
                    for (var i = 0; i < data.errors.length; i++) {
                        errorsHtml += "<div>" + data.errors[i] + "</div>"
                    }
                    $alertErrors.html(errorsHtml).show()
                }
                if (data.validationErrors) {
                    for (var j = 0; j < data.validationErrors.length; j++) {
                        var err = data.validationErrors[j];
                        var errText = _.isObject(err) && err.msg ? err.msg : null;
                        var errField = _.isObject(err) && err.param ? err.param : null;
                        if (errText !== null && errField !== null) {
                            var $fieldWrap = $fieldWraps.filter("[data-field=" + errField + "]");
                            $fieldWrap.addClass("error");
                            $(".text-error", $fieldWrap).text(errText).removeClass("hidden")
                        }
                    }
                }
                if (data.redirect) {
                    document.location = data.redirect
                }
                if (data.formReset) {
                    $form.get(0).reset()
                }
                if (data.formHide) {
                    $form.hide()
                }
                if (data.event) {
                    var eventData = data.eventData || {};
                    $form.trigger(data.event, eventData)
                }
            }).fail(function() {
                alert("Unexpected server error")
            }).always(function() {
                $submit.button("reset");
                $inputs.filter(":not([data-disabled=1],[data-disabled=true])").prop("disabled", false)
            })
        });
        $form.on("popup.reset", function() {
            if ($form.data("persist") === true) {
                return
            }
            if (!$form.data("fields-persist")) {
                $form.show().get(0).reset()
            }
            $alerts.html("").hide();
            $inputs.filter(":not([data-disabled=1],[data-disabled=true])").prop("disabled", false);
            $fieldWraps.removeClass("error");
            $fieldErrors.text("").addClass("hidden");
            $submit.button("reset")
        });
        $form.on("popup.close", function() {
            $form.trigger("popup.reset")
        });
        $form.on("popup.open", function() {
            $form.trigger("popup.reset")
        })
    });
    $(".btnMediaLoad").each(function() {
        var $btn = $(this);
        var $cont = $($btn.data("container"));
        var endpoint = $btn.data("endpoint");
        var loading = false;
        if (!$btn.data("next_max_id")) {
            $btn.hide()
        }
        $btn.on("click", function() {
            var next_max_id = $btn.data("next_max_id");
            if (!next_max_id) {
                $btn.hide();
                return
            }
            $btn.button("loading");
            loading = true;
            $.ajax({
                url: endpoint,
                data: {
                    max_id: next_max_id
                },
                dataType: "json"
            }).done(function(data) {
                if (data.debug) {
                    console.log(data.debug)
                }
                if (data.error) {
                    alert(data.error);
                    return
                } else if (data.errors) {
                    alert(data.errors.join("\n"));
                    return
                }
                $cont.append(data.media_html);
                $btn.data("next_max_id", data.next_max_id);
                if (!data.next_max_id) {
                    $btn.hide()
                }
            }).fail(function() {
                alert("Unexpected server error")
            }).always(function() {
                $btn.button("reset");
                loading = false
            })
        });
        $(window).on("scroll", function() {
            if (loading || !$btn.data("next_max_id")) {
                return
            }
            if ($(window).scrollTop() + $(window).height() - $btn.outerHeight() > $btn.offset().top) {
                $btn.trigger("click")
            }
        })
    });
    $(".btn-buy").on("click", function() {
        $("#popup-alert").popup({
            shadow: true,
            modal: true,
            text: '<div class="text-center">Redirecting to PayPal...</div>'
        })
    });
    $("form", "#popup-payment").on("submit", function() {
        $("#popup-payment").popupClose();
        $("#popup-alert").popup({
            shadow: true,
            modal: true,
            text: '<div class="text-center">Completing payment...</div>'
        })
    });
    (function() {
        var $trydemoCont = $(".trydemo-cont"),
            $paymentCont = $(".payment-cont"),
            $paymentSlider = $(".payment-slider", $paymentCont),
            $btnShow = $(".btn-show-packages", $trydemoCont),
            $btnExtra = $(".btn-extra-packages", $paymentCont),
            $btnNormal = $(".btn-normal-packages", $paymentCont);
        $btnShow.on("click", function(e) {
            e.preventDefault();
            $trydemoCont.hide();
            $paymentCont.show()
        });
        $btnExtra.on("click", function(e) {
            e.preventDefault();
            $btnExtra.hide();
            $btnNormal.show();
            $paymentSlider.stop().animate({
                left: "-309px"
            })
        });
        $btnNormal.on("click", function(e) {
            e.preventDefault();
            $btnNormal.hide();
            $btnExtra.show();
            $paymentSlider.stop().animate({
                left: "0"
            })
        })
    })();
    (function() {
        var $worker = $(".worker"),
            $form = $("form", $worker),
            $formInputs = $("input, select, textarea, button:not(.btn-start-stop)", $form),
            $formCheckboxes = $("input[type=checkbox]", $form),
            $fieldWraps = $(".control-group", $form),
            $botInfoStart = $(".alert.worker-info-start", $worker),
            $botStopReason = $(".alert.worker-stop-reason", $worker),
            $botErrors = $(".alert.worker-error", $worker),
            $btnStart = $(".btn-start", $worker),
            $btnStop = $(".btn-stop", $worker),
            $inpFollow = $("#inpFollow", $worker),
            $inpUnfollow = $("#inpUnfollow", $worker),
            $txtStatus = $(".status", $worker),
            $txtLikes = $(".count-likes", $worker),
            $txtComments = $(".count-comments", $worker),
            $txtFollows = $(".count-follows", $worker),
            $txtUnfollows = $(".count-unfollows", $worker),
            $time = $(".resource", $worker),
            $txtTime = $(".counter", $time),
            $trydemoCont = $(".trydemo-cont", $worker),
            $paymentCont = $(".payment-cont", $worker),
            $selSource = $("#selSource", $worker),
            $inpMinLikes = $("#inpMinLikes", $worker),
            $inpMaxLikes = $("#inpMaxLikes", $worker),
            $contTags = $(".activity-settings .tags", $worker),
            $tagsRow = $(".tags-row", $contTags),
            $tags = $("> span", $tagsRow),
            $inpTags = $("#inpTags", $contTags),
            $inpAddTags = $("#inpAddTags", $contTags),
            $btnAddTags = $(".btn-add-tags", $contTags),
            $btnDelTags = $(".btn-del-tags", $contTags),
            tplTag = $("#tplTag", $contTags).html(),
            $contComments = $(".activity-settings .comments", $worker),
            $commentsRow = $(".comments-row", $contComments),
            $comments = $("> span", $commentsRow),
            $inpComments = $("#inpComments", $contComments),
            $inpAddComments = $("#inpAddComments", $contComments),
            $btnAddComments = $(".btn-add-comments", $contComments),
            $btnDelComments = $(".btn-del-comments", $contComments),
            tplComment = $("#tplComment", $contComments).html(),
            $btnReset = $(".btn-settings-reset", $worker),
            wStatus = $worker.data("status"),
            wDemo = $worker.data("demo"),
            statusTm = null;

        function updateStatus() {
            $.ajax({
                url: "/activity/status",
                data: {},
                type: "GET",
                contentType: "application/json",
                dataType: "json",
                cache: false,
                success: function(data) {
                    if (data.debug) {
                        console.log(data.debug)
                    }
                    if (data.status === "ok") {
                        wStatus = data.worker.status;
                        $txtStatus.text(data.worker.status);
                        $txtLikes.text(data.worker.likes || 0);
                        $txtComments.text(data.worker.comments || 0);
                        $txtFollows.text(data.worker.follows || 0);
                        $txtUnfollows.text(data.worker.unfollows || 0);
                        $txtTime.text(data.nicePaymentTime);
                        if (data.paymentTime <= 0) {
                            $time.removeClass("ok").addClass("over")
                        } else {
                            $time.removeClass("over").addClass("ok")
                        }
                        if (data.worker.error_type) {
                            $botErrors.filter("[data-error-type=" + data.worker.error_type + "]").slideDown()
                        } else if (data.worker.stop_reason) {
                            $botStopReason.removeClass($botStopReason.data("alert-class"));
                            $botStopReason.data("alert-class", "alert-" + (data.worker.stop_reason_type || "success"));
                            $botStopReason.addClass($botStopReason.data("alert-class"));
                            $botStopReason.find(".stop-reason").text(data.worker.stop_reason).end().slideDown()
                        }
                        if (data.worker.client_action) {
                            var action = data.worker.client_action.action;
                            var params = data.worker.client_action.params;
                            switch (action) {
                                case "redirect":
                                    document.location = params.url;
                                    break
                            }
                        }
                    } else {
                        if (data.error) {
                            alert(data.error)
                        } else if (data.errors) {
                            alert(data.errors.join("\n"))
                        }
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {},
                complete: function() {
                    if (wStatus === "started") {
                        startStatusUpdate()
                    } else {
                        onStop()
                    }
                }
            })
        }

        function startStatusUpdate() {
            statusTm = setTimeout(updateStatus, 1e3 * 15)
        }

        function stopStatusUpdate() {
            clearTimeout(statusTm)
        }

        function clearCounters() {
            $txtLikes.text("0");
            $txtComments.text("0");
            $txtFollows.text("0");
            $txtUnfollows.text("0")
        }

        function enableInputs() {
            $formInputs.filter(":not([data-disabled=1],[data-disabled=true])").prop("disabled", false);
            $tagsRow.find("> span a").removeClass("disabled");
            $commentsRow.find("> span a").removeClass("disabled")
        }

        function disableInputs() {
            $formInputs.prop("disabled", true);
            $tagsRow.find("> span a").addClass("disabled");
            $commentsRow.find("> span a").addClass("disabled")
        }

        function onStart() {
            wStatus = "started";
            $txtStatus.text("started").removeClass("status-stopped").addClass("status-started");
            $btnStart.hide();
            $btnStop.show();
            disableInputs();
            $botStopReason.hide();
            $botErrors.hide();
            $trydemoCont.hide();
            $paymentCont.show();
            startStatusUpdate()
        }

        function onStop() {
            wStatus = "stopped";
            $txtStatus.text("stopped").removeClass("status-started").addClass("status-stopped");
            $btnStart.show();
            $btnStop.hide();
            enableInputs();
            stopStatusUpdate()
        }

        function checkMinMaxLikes() {
            var min = parseInt($inpMinLikes.val());
            var max = parseInt($inpMaxLikes.val());
            if (max > 0 && min > max) {
                alert("Error! " + 'You have selected "Min. likes" more than "Max. likes".')
            } else if (min > 0 && max > 0 && min === max) {
                alert("Warning! " + 'You have selected the same value for both "Min. likes" and "Max. likes".')
            } else if (min > 300) {
                alert("Attention! " + 'You have selected too high value for "Min. likes".')
            }
        }

        function prepareTags(str) {
            var tags = [];
            var rawTags = str.replace(/\r/g, "").replace(/#+/g, " ").replace(/\s+|,+/g, "\n").split("\n");
            for (var i = 0; i < rawTags.length; i++) {
                var tag = $.trim(rawTags[i]).toLowerCase();
                if (tag.length) {
                    tags.push(tag)
                }
            }
            return tags
        }

        function onAddTags(e) {
            e.preventDefault();
            var tags = prepareTags($inpTags.val());
            var newTags = prepareTags($inpAddTags.val());
            for (var i = 0; i < newTags.length; i++) {
                var tag = newTags[i];
                if (tags.indexOf(tag) === -1) {
                    tags.push(tag);
                    $tagsRow.append(tplTag.replace(/%tag%/g, helper.escapeHtmlChars(tag)))
                }
            }
            $inpTags.val(tags.join("\n")).trigger("change");
            $inpAddTags.val("").focus()
        }

        function prepareComments(str) {
            var comments = [];
            var rawComments = str.replace(/\r/g, "").split("\n");
            for (var i = 0; i < rawComments.length; i++) {
                var comment = $.trim(rawComments[i]);
                if (comment.length) {
                    comments.push(comment)
                }
            }
            return comments
        }

        function onAddComments(e) {
            e.preventDefault();
            var comments = prepareComments($inpComments.val());
            var newComments = prepareComments($inpAddComments.val());
            for (var i = 0; i < newComments.length; i++) {
                var comment = newComments[i];
                comments.push(comment);
                $commentsRow.append(tplComment.replace(/%comment%/g, helper.escapeHtmlChars(comment)))
            }
            $inpComments.val(comments.join("\n")).trigger("change");
            $inpAddComments.val("").focus()
        }

        function prepareConfig(config) {
            $formCheckboxes.each(function() {
                var name = $(this).attr("name");
                config[name] = config[name] !== undefined
            });
            return config
        }
        if (wStatus === "started") {
            onStart()
        } else {
            onStop()
        }
        $inpFollow.on("change", function() {
            if ($(this).prop("checked")) {
                $inpUnfollow.prop("checked", false)
            }
        });
        $inpUnfollow.on("change", function() {
            if ($(this).prop("checked")) {
                $inpFollow.prop("checked", false)
            }
        });
        $selSource.on("change", function() {
            var state = $(this).val() == "tag";
            $(".activity-settings .tags", $worker).css("display", state ? "block" : "none")
        });
        $selSource.on("change", function() {
            var state = $(this).val() == "feed";
            if (state === true) {
                $inpFollow.prop("checked", false).prop("disabled", state).attr("data-disabled", state)
            } else {
                $inpFollow.prop("disabled", state).attr("data-disabled", state)
            }
        });
        $inpMinLikes.on("change", checkMinMaxLikes);
        $inpMaxLikes.on("change", checkMinMaxLikes);
        $formInputs.on("change", function() {
            $(this).parents(".control-group.error").removeClass("error")
        });
        $("#inpTimeLimit").mask("99:99");
        $btnAddTags.on("click", onAddTags);
        $inpAddTags.on("keydown", function(e) {
            if (e.which == 13) {
                onAddTags(e)
            }
        });
        $tagsRow.on("click", "> span a", function(e) {
            e.preventDefault();
            var $btn = $(this);
            var $tag = $(this).parent();
            var tag = $tag.data("tag");
            if ($btn.hasClass("disabled")) {
                return
            }
            $tag.remove();
            var tags = prepareTags($inpTags.val());
            var newTags = [];
            for (var i = 0; i < tags.length; i++) {
                var t = tags[i];
                if (t != tag) {
                    newTags.push(t)
                }
            }
            $inpTags.val(newTags.join("\n")).trigger("change")
        });
        $btnDelTags.on("click", function(e) {
            e.preventDefault();
            $inpTags.val("").trigger("change");
            $tagsRow.find("> span").remove()
        });
        $btnAddComments.on("click", onAddComments);
        $inpAddComments.on("keydown", function(e) {
            if (e.which == 13) {
                onAddComments(e)
            }
        });
        $commentsRow.on("click", "> span a", function(e) {
            e.preventDefault();
            var $btn = $(this);
            var $comment = $(this).parent();
            var comment = $comment.data("comment");
            if ($btn.hasClass("disabled")) {
                return
            }
            $comment.remove();
            var comments = prepareComments($inpComments.val());
            var newComments = [];
            for (var i = 0; i < comments.length; i++) {
                var c = comments[i];
                if (c != comment) {
                    newComments.push(c)
                }
            }
            $inpComments.val(newComments.join("\n")).trigger("change")
        });
        $btnDelComments.on("click", function(e) {
            e.preventDefault();
            $inpComments.val("").trigger("change");
            $commentsRow.find("> span").remove()
        });
        $(".close", $botInfoStart).on("click", function() {
            $.cookie("bot_info_start_closed", true, {
                expires: 30,
                path: "/"
            })
        });
        $formInputs.on("change", function() {
            if (wDemo) {
                return
            }
            var data = {
                config: prepareConfig(helper.formArrayToObject($form.serializeArray()))
            };
            $.ajax({
                url: "/users/activity/settings/save",
                data: JSON.stringify(data),
                type: "POST",
                contentType: "application/json",
                dataType: "json",
                success: function(data) {
                    if (data.debug) {
                        console.log(data.debug)
                    }
                    if (data.status !== "ok") {
                        if (data.error) {
                            alert(data.error)
                        } else if (data.errors) {
                            alert(data.errors.join("\n"))
                        }
                    }
                },
                error: function() {
                    alert("Unexpected server error")
                }
            })
        });
        $btnReset.on("click", function(e) {
            e.preventDefault();
            if (wDemo) {
                document.location.reload(true);
                return
            }
            if (!confirm("WARNING!\n\nAre you sure you want to reset all settings to default values?")) {
                return
            }
            $.ajax({
                url: "/activity/settings/reset",
                data: JSON.stringify({}),
                type: "POST",
                contentType: "application/json",
                dataType: "json",
                success: function(data) {
                    if (data.debug) {
                        console.log(data.debug)
                    }
                    if (data.status === "ok") {
                        document.location.reload(true)
                    } else {
                        if (data.error) {
                            alert(data.error)
                        } else if (data.errors) {
                            alert(data.errors.join("\n"))
                        }
                    }
                },
                error: function() {
                    alert("Unexpected server error")
                }
            })
        });
        $btnStart.on("click", function(e) {
            e.preventDefault();
            if (wDemo) {
                return
            }
            $btnStart.button("loading");
            $fieldWraps.removeClass("error");
            $tags.removeClass("error");
            $comments.removeClass("error");
            var data = {
                config: prepareConfig(helper.formArrayToObject($form.serializeArray()))
            };
            disableInputs();
            $.ajax({
                url: "/activity/start",
                data: JSON.stringify(data),
                type: "POST",
                contentType: "application/json",
                dataType: "json",
                success: function(data) {
                    if (data.debug) {
                        console.log(data.debug)
                    }
                    if (data.status === "ok") {
                        onStart();
                        clearCounters();
                        if (!$.cookie("bot_info_start_closed", Boolean)) {
                            $botInfoStart.slideDown()
                        }
                    } else {
                        if (data.error) {
                            alert(data.error)
                        } else if (data.errors) {
                            alert(data.errors.join("\n"))
                        }
                        if (data.validationErrors) {
                            alert("Check your settings");
                            for (var j = 0; j < data.validationErrors.length; j++) {
                                var err = data.validationErrors[j];
                                var errText = _.isObject(err) && err.msg ? err.msg : null;
                                var errField = _.isObject(err) && err.param ? err.param : null;
                                if (errText !== null && errField !== null) {
                                    var $fieldWrap = $fieldWraps.filter("[data-field=" + errField + "]");
                                    $fieldWrap.addClass("error")
                                }
                            }
                        }
                        if (data.errorTags) {
                            $tagsRow.find("> span").each(function() {
                                var $tag = $(this),
                                    tag = $tag.data("tag");
                                if (data.errorTags.indexOf(tag) !== -1) {
                                    $tag.addClass("error")
                                }
                            })
                        }
                        if (data.errorComments) {
                            $commentsRow.find("> span").each(function() {
                                var $comment = $(this),
                                    comment = $comment.data("comment");
                                if (data.errorComments.indexOf(comment) !== -1) {
                                    $comment.addClass("error")
                                }
                            })
                        }
                    }
                },
                error: function() {},
                complete: function() {
                    $btnStart.button("reset");
                    if (wStatus !== "started") {
                        enableInputs()
                    }
                }
            })
        });
        $btnStop.on("click", function(e) {
            e.preventDefault();
            if (wDemo) {
                return
            }
            $btnStop.button("loading");
            var data = {};
            $.ajax({
                url: "/activity/stop",
                data: JSON.stringify(data),
                type: "POST",
                contentType: "application/json",
                dataType: "json",
                success: function(data) {
                    if (data.debug) {
                        console.log(data.debug)
                    }
                    if (data.status === "ok") {
                        onStop()
                    } else {
                        if (data.error) {
                            alert(data.error)
                        } else if (data.errors) {
                            alert(data.errors.join("\n"))
                        }
                    }
                },
                error: function() {},
                complete: function() {
                    $btnStop.button("reset")
                }
            })
        })
    })();
    (function() {
        var $accs = $(".account-entry"),
            $btnStartAll = $("#btn-start-all"),
            $btnStopAll = $("#btn-stop-all"),
            $btnsStart = $(".btn-start", $accs),
            $btnsStop = $(".btn-stop", $accs),
            $countStarted = $("#count-started"),
            $countStopped = $("#count-stopped");

        function stopMessage(stopReason) {
            var msg = "Activity automatically stopped";
            if (stopReason) {
                msg += ":<br/>" + stopReason
            }
            return msg
        }

        function showStatusAlert($alert, statusClass, statusMessage) {
            $alert.removeClass($alert.attr("data-alert-class"));
            $alert.attr("data-alert-class", "alert-" + (statusClass || "success"));
            $alert.addClass($alert.attr("data-alert-class"));
            $alert.attr("data-original-title", statusMessage);
            $alert.show()
        }

        function hideStatusAlert($alert) {
            $alert.hide()
        }

        function processStatusForAll(data) {
            if (data.debug) {
                console.log(data.debug)
            }
            if (data.error) {
                alert(data.error)
            } else if (data.errors) {
                alert(data.errors.join("\n"))
            }
            if (data.hasOwnProperty("started")) $countStarted.text(data.started);
            if (data.hasOwnProperty("stopped")) $countStopped.text(data.stopped);
            if (data.results && data.results.length) {
                var usersErrors = [];
                for (var i = 0, s = data.results[i]; i < data.results.length; i++, s = data.results[i]) {
                    if (s.status) {
                        $accs.filter('[data-user-id="' + s.user_id + '"]').trigger("status.activity", s.status)
                    } else {
                        if (s.error) {
                            usersErrors.push(s.username + ": " + s.error)
                        } else if (s.errors) {
                            usersErrors.push(s.username + ": " + s.errors.join("; "))
                        }
                        if (s.validationErrors) {
                            usersErrors.push(s.username + ": Check account settings")
                        }
                        if (s.errorTags) {
                            usersErrors.push(s.username + ": Check account settings")
                        }
                        if (s.errorComments) {
                            usersErrors.push(s.username + ": Check account settings")
                        }
                    }
                }
                if (usersErrors.length) {
                    alert("Accounts with errors:\n\n" + usersErrors.join("\n"))
                }
            }
        }

        function updateStatusForAll() {
            $.ajax({
                url: "/account/activity/status/all",
                data: {},
                type: "GET",
                contentType: "application/json",
                dataType: "json",
                cache: false,
                success: function(data) {
                    processStatusForAll(data)
                },
                error: function(jqXHR, textStatus, errorThrown) {},
                complete: function() {
                    setTimeout(function() {
                        updateStatusForAll()
                    }, 1e3 * 15)
                }
            })
        }
        $btnStartAll.on("click", function(e) {
            e.preventDefault();
            $btnStartAll.button("loading");
            $btnStopAll.button("loading");
            $btnsStart.button("loading");
            $btnsStop.button("loading");
            var data = {};
            $.ajax({
                url: "/account/activity/start/all",
                data: JSON.stringify(data),
                type: "POST",
                contentType: "application/json",
                dataType: "json",
                success: function(data) {
                    processStatusForAll(data)
                },
                error: function() {},
                complete: function() {
                    $btnStartAll.button("reset");
                    $btnStopAll.button("reset");
                    $btnsStart.button("reset");
                    $btnsStop.button("reset")
                }
            })
        });
        $btnStopAll.on("click", function(e) {
            e.preventDefault();
            $btnStartAll.button("loading");
            $btnStopAll.button("loading");
            $btnsStart.button("loading");
            $btnsStop.button("loading");
            var data = {};
            $.ajax({
                url: "/account/activity/stop/all",
                data: JSON.stringify(data),
                type: "POST",
                contentType: "application/json",
                dataType: "json",
                success: function(data) {
                    processStatusForAll(data)
                },
                error: function() {},
                complete: function() {
                    $btnStartAll.button("reset");
                    $btnStopAll.button("reset");
                    $btnsStart.button("reset");
                    $btnsStop.button("reset")
                }
            })
        });
        $accs.each(function() {
            var $acc = $(this),
                $btnStart = $(".btn-start", $acc),
                $btnStop = $(".btn-stop", $acc),
                $status = $(".status", $acc),
                $statusText = $(".status-text", $status),
                $statusAlert = $(".stat-alert", $status),
                $timeStart = $(".time-start", $acc),
                $timeStop = $(".time-stop", $acc),
                $timeOk = $(".payment-timer .label-ok", $acc),
                $timeOver = $(".payment-timer .label-over", $acc),
                $txtLikes = $(".count-likes", $acc),
                $txtComments = $(".count-comments", $acc),
                $txtFollows = $(".count-follows", $acc),
                $txtUnfollows = $(".count-unfollows", $acc);
            var userId = $acc.data("user-id"),
                username = $acc.data("username");
            $acc.on("status.activity", function(e, data) {
                $acc.trigger(data.status + ".activity", data);
                $timeStart.text(data.start_date || "-");
                $timeStop.text(data.stop_date || "-");
                $timeOk.text(data.nicePaymentTime);
                if (data.paymentTime <= 0) {
                    $timeOk.hide();
                    $timeOver.show()
                } else {
                    $timeOver.hide();
                    $timeOk.show()
                }
                $txtLikes.text(data.likes);
                $txtComments.text(data.comments);
                $txtFollows.text(data.follows);
                $txtUnfollows.text(data.unfollows);
                if (data.client_action) {
                    var action = data.client_action.action;
                    var params = data.client_action.params;
                    switch (action) {
                        case "redirect":
                            document.location = params.url;
                            break
                    }
                }
            });
            $acc.on("started.activity", function() {
                $status.removeClass("status-stopped").addClass("status-started");
                $statusText.text("started");
                $btnStart.hide();
                $btnStop.show();
                hideStatusAlert($statusAlert)
            });
            $acc.on("stopped.activity", function(e, data) {
                $status.removeClass("status-started").addClass("status-stopped");
                $statusText.text("stopped");
                $btnStop.hide();
                $btnStart.show();
                if (data.error_type) {
                    showStatusAlert($statusAlert, "error", stopMessage(data.error_message || data.error_type))
                } else if (data.stop_reason) {
                    showStatusAlert($statusAlert, data.stop_reason_type || "success", stopMessage(data.stop_reason))
                }
            });
            $btnStart.on("click", function(e) {
                e.preventDefault();
                $btnStart.button("loading");
                var data = {};
                $.ajax({
                    url: "/account/activity/start/" + userId,
                    data: JSON.stringify(data),
                    type: "POST",
                    contentType: "application/json",
                    dataType: "json",
                    success: function(data) {
                        if (data.debug) {
                            console.log(data.debug)
                        }
                        if (data.status && data.status.status === "started") {
                            $acc.trigger("status.activity", data.status)
                        } else {
                            if (data.error) {
                                alert(data.username + ": " + data.error)
                            } else if (data.errors) {
                                alert(data.username + ": " + data.errors.join("; "))
                            }
                            if (data.validationErrors) {
                                alert(data.username + ": Check account settings")
                            }
                            if (data.errorTags) {
                                alert(data.username + ": Check account settings")
                            }
                            if (data.errorComments) {
                                alert(data.username + ": Check account settings")
                            }
                        }
                    },
                    error: function() {},
                    complete: function() {
                        $btnStart.button("reset")
                    }
                })
            });
            $btnStop.on("click", function(e) {
                e.preventDefault();
                $btnStop.button("loading");
                var data = {};
                $.ajax({
                    url: "/account/activity/stop/" + userId,
                    data: JSON.stringify(data),
                    type: "POST",
                    contentType: "application/json",
                    dataType: "json",
                    success: function(data) {
                        if (data.debug) {
                            console.log(data.debug)
                        }
                        if (data.status && data.status.status === "stopped") {
                            $acc.trigger("status.activity", data.status)
                        } else {
                            if (data.error) {
                                alert(data.username + ": " + data.error)
                            } else if (data.errors) {
                                alert(data.username + ": " + data.errors.join("; "))
                            }
                            if (data.validationErrors) {
                                alert(data.username + ": Check account settings")
                            }
                            if (data.errorTags) {
                                alert(data.username + ": Check account settings")
                            }
                            if (data.errorComments) {
                                alert(data.username + ": Check account settings")
                            }
                        }
                    },
                    error: function() {},
                    complete: function() {
                        $btnStop.button("reset")
                    }
                })
            })
        });
        if ($accs.size()) updateStatusForAll()
    })()
});