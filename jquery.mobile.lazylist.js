/*
 * jquery.mobile.lazylist v1
 *
 * Copyright (c) 2013, Volker Krebs
 * Dual licensed under the MIT and GPL Version 2 licenses.
 * 
 * This widget applies listview and loades content from an
 * element with lazylist-morebtn class.
 * The content that is loaded needs to contain a new lazylist-morebtn element
 * for the next content that is loaded. So you need to have control over
 * the content that is loaded.
 */
(function($) {
    $.widget('mobile.lazylist', {
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
            beforeSend: $.proxy(widget._enableLoadingState, this),
            complete: $.proxy(widget._disableLoadingState, this)
        });
    },
    _enableLoadingState: function() {
        console.log("loading");
        this.loading = $('<span>').addClass('lazycontent-loading');
        this.element.append(this.loading);
    },
    _disableLoadingState: function() {
        console.log("finished loading");
        this.loading.remove();
    },
    _removeMoreButton: function() {
        console.log('removing more button');
        this.moreButton.parent().remove();
    },
    apply: function() {
        console.log('apply');
        //Store morebutton as instance varaiable
        this.moreButton = this.element.find(".lazylist-morebtn");
        if (this.moreButton.length >= 1) {
            //no more button, so nothintg to bind
            this.moreButton.bind("click", $.proxy(function(event) {
                //console.log(event);
                this._loadMore(event.target.href);
                //abbort and load with ajax
                return false;
            }, this));
        }
    }
    });
    //auto self-init widgets
    $(document).bind('pagecreate', function(event) {
	$($.mobile.lazylist.prototype.options.initSelector, event.target).lazylist();
    });
}(jQuery));