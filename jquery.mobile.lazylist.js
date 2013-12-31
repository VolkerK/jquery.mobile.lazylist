/*
 * jquery.mobile.lazylist v1
 *
 * Copyright (c) 2013, Volker Krebs
 * Dual licensed under the MIT and GPL Version 2 licenses.
 * 
 */
(function($) {
    $.widget('mobile.lazylist', {
    moreButton: undefined,
    options: {
        initSelector: ':jqmData(role=lazylist)'
    },
    _create: function() {
        console.log('_create');
        this.apply();
        //apply listview plugin
	this.element.listview();
    },
    _loadMore: function(url) {
        var widget = this;
        console.log("Load more stuff with ajax form " + url);
        //console.log($(this));
        $.ajax({
            url: url,
            dataType: 'html',
            success: function(html, textStatus, jqXHR) {
                console.log('done loading');
                //console.log(html);
                //console.log(textStatus);
                //console.log(jqXHR);
                var content = $( html.trim() );
                widget.element.append(content);
                widget._removeMoreButton();
                // Enhance the content if necessary
                if ( typeof(content.attr('data-role')) !== 'undefined' ) {
                    var pluginName = content.attr('data-role');
                    content[pluginName]();
                }
                //refresh needed for the just loaded content
                widget.element.listview('refresh');
                //apply this widget (more button and stuff)
                widget.apply();
            },
            error: function(jqXHR, textStatus, errorThrown ) {
                console.log('error loading');
                //console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            },
            complete: function() {
                console.log('ajax completed');
            }
            //beforeSend: $.proxy(widget._displayLoadingState, this) // Display something while loading the content
        });
    },
    _displayLoadingState: function() {
        var loading = $('<span>').addClass('lazycontent-loading');
        this.element.html(loading);
    },
    _removeMoreButton: function() {
        console.log('removing more button');
        //console.log(moreButton);
        //TODO: more button genau finden um ihn komplett zu entfernen (samt evtl. Elternelemente)
        moreButton.parent().remove();
    },
    apply: function() {
        console.log('apply');
        //TODO: Better selection
        moreButton = $(".lazylist-morebtn");
        //TODO: Handling when no more button was found
        //console.log(moreButton);
        moreButton.bind("click", $.proxy(function(event) {
            //console.log(event);
            this._loadMore(event.target.href);
            //abbort and load with ajax
            return false;
        }, this));
    }
    });
    //auto self-init widgets
    $(document).bind('pagecreate', function(event) {
	$($.mobile.lazylist.prototype.options.initSelector, event.target).lazylist();
    });
}(jQuery));