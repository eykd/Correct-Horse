/*
      Correct Horse (Battery Staple) -- a better password generator.
      
      See http://xkcd.com/936/ for an explanation.

      This is a Backbone.js app, with probably a lot more fanciness than it needs.
 */

/*
 *    Utilities
 */
 
// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
(function(){
  var cache = {};
  
  this.tmpl = function tmpl(str, data){
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    var fn = !/\W/.test(str) ?
      cache[str] = cache[str] ||
        tmpl(document.getElementById(str).innerHTML) :
      
      // Generate a reusable function that will serve as a template
      // generator (and which will be cached).
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +
        
        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +
        
        // Convert the template into pure JavaScript
        str
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'")
      + "');}return p.join('');");
    
    // Provide some basic currying to the user
    return data ? fn( data ) : fn;
  };
})();

/*
 *    Base64 encode / decode
 *    http://www.webtoolkit.info/
 */
(function() {
    this.Base64 = {
     
    	// private property
    	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
     
    	// public method for encoding
    	encode : function (input) {
    		var output = "";
    		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    		var i = 0;
     
    		input = Base64._utf8_encode(input);
     
    		while (i < input.length) {
     
    			chr1 = input.charCodeAt(i++);
    			chr2 = input.charCodeAt(i++);
    			chr3 = input.charCodeAt(i++);
     
    			enc1 = chr1 >> 2;
    			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    			enc4 = chr3 & 63;
     
    			if (isNaN(chr2)) {
    				enc3 = enc4 = 64;
    			} else if (isNaN(chr3)) {
    				enc4 = 64;
    			}
     
    			output = output +
    			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
    			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
     
    		}
     
    		return output;
    	},
     
    	// public method for decoding
    	decode : function (input) {
    		var output = "";
    		var chr1, chr2, chr3;
    		var enc1, enc2, enc3, enc4;
    		var i = 0;
     
    		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
     
    		while (i < input.length) {
     
    			enc1 = this._keyStr.indexOf(input.charAt(i++));
    			enc2 = this._keyStr.indexOf(input.charAt(i++));
    			enc3 = this._keyStr.indexOf(input.charAt(i++));
    			enc4 = this._keyStr.indexOf(input.charAt(i++));
     
    			chr1 = (enc1 << 2) | (enc2 >> 4);
    			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    			chr3 = ((enc3 & 3) << 6) | enc4;
     
    			output = output + String.fromCharCode(chr1);
     
    			if (enc3 != 64) {
    				output = output + String.fromCharCode(chr2);
    			}
    			if (enc4 != 64) {
    				output = output + String.fromCharCode(chr3);
    			}
     
    		}
     
    		output = Base64._utf8_decode(output);
     
    		return output;
     
    	},
     
    	// private method for UTF-8 encoding
    	_utf8_encode : function (string) {
    		string = string.replace(/\r\n/g,"\n");
    		var utftext = "";
     
    		for (var n = 0; n < string.length; n++) {
     
    			var c = string.charCodeAt(n);
     
    			if (c < 128) {
    				utftext += String.fromCharCode(c);
    			}
    			else if((c > 127) && (c < 2048)) {
    				utftext += String.fromCharCode((c >> 6) | 192);
    				utftext += String.fromCharCode((c & 63) | 128);
    			}
    			else {
    				utftext += String.fromCharCode((c >> 12) | 224);
    				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
    				utftext += String.fromCharCode((c & 63) | 128);
    			}
     
    		}
     
    		return utftext;
    	},
     
    	// private method for UTF-8 decoding
    	_utf8_decode : function (utftext) {
    		var string = "";
    		var i = 0;
    		var c = c1 = c2 = 0;
     
    		while ( i < utftext.length ) {
     
    			c = utftext.charCodeAt(i);
     
    			if (c < 128) {
    				string += String.fromCharCode(c);
    				i++;
    			}
    			else if((c > 191) && (c < 224)) {
    				c2 = utftext.charCodeAt(i+1);
    				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
    				i += 2;
    			}
    			else {
    				c2 = utftext.charCodeAt(i+1);
    				c3 = utftext.charCodeAt(i+2);
    				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
    				i += 3;
    			}
     
    		}
     
    		return string;
    	}
     
    }
})();

$script.ready('backbone', function() {
    /*
     *    Application Settings
     */    
    var settings = {
        min_word_length: 5,
        max_word_length: 9,
        phrase_length: 4,
        mine: 'NGYzMTY1N2VjMzY0OWVjODlhMDAzMGZjYjhmMDhkZDFhMGZhOTRhNjIyNjM5N2QxZA'
    };

    /* 
     *    Models & Collections 
     */
    var Word = Backbone.Model.extend({
    });
    
    var Phrase = Backbone.Collection.extend({
        model: Word,
        
        cullWords: function () {
            /* Cull words that aren't marked to 'keep'.
             */
            var that = this;
            var to_cull = this.select(function (item) { return (!item.get('keep')); });
            if (to_cull.length) {
                _.each(to_cull, function (item) {
                    that.remove(item, {silent: true});
                    item.destroy();
                });
                this.trigger('remove');
            }
        },
        
        truncateWords: function () {
            while (this.length > settings.phrase_length) {
                var item = this.at(this.length - 1);
                this.remove(item);
                item.destroy();
            }
        },
        
        addWords: function (cull) {
            /* Get new words.
             */
            var that = this;
            var thus = settings.mine;
            this.truncateWords();
            if (cull) {
                this.cullWords();
            }
            var current_length = this.length;
            var target_length = settings.phrase_length;
            var to_get = target_length - current_length;
            if (to_get) {
                response = $.ajax({
                                url: 'http://api.wordnik.com/v4/words.json/randomWords',
                                data: {
                                    "limit": to_get,
                                    "maxLength": settings.max_word_length,
                                    "minLength": settings.min_word_length,
                                    "api_key": Base64.decode(thus+'==')
                                },
                                dataType: 'jsonp',
                                success: function (data) {
                                    _.each(data, function(item) {
                                        that.add(new Word({word: item.word, keep: false}));
                                    });
                                }
                            });
            }        
        }
    })
    

    /*
     *    Views
     */
    var PhraseTableView = Backbone.View.extend({
        /* Master view for passphrase table.
         */
        el: '#passphrase-tbl',
        initialize: function () {
            this.collection.bind('add', this.addWord, this);
        },
        
        addWord: function (word) {
            var word_view = new WordTableView({model: word});
            this.$('.phrase').append(word_view.render().el);
            
            var keep_view = new KeepTableView({model: word});
            this.$('.phrase-keep').append(keep_view.render().el);
        }
    });
    
    var WordTableView = Backbone.View.extend({
        /* Handle the display of words in the table.
         */
        tagName: 'td',
        className: "word",
        
        initialize: function () {
            this.model.bind('destroy', this.remove, this);
        },
        
        render: function () {
            $(this.el).html(this.model.get('word'));
            return this;
        }    
    });
    
    var KeepTableView = Backbone.View.extend({
        /* Handle the "keep" checkboxes in the table.
         */
        tagName: 'td',
        className: "check",
        
        events: {
            'change input.keep': 'change'
        },
        
        initialize: function () {
            this.model.bind('destroy', this.remove, this);
        },

        render: function () {
            $(this.el).html(tmpl('keep_checkbox', {keep: false}));
            return this;
        },
        
        change: function () {
            this.model.set({'keep': this.$('input.keep').is(':checked')});
        }
    });
    
    var PhraseInputView = Backbone.View.extend({
        /* Handle the passphrase text input.
         */
        el: '#passphrase',
        
        events: {
            'click': 'highlight'
        },
        
        initialize: function () {
            this.collection.bind('add', this.render, this);
            this.collection.bind('remove', this.render, this);
            this.collection.bind('reset', this.render, this);
        },
        
        render: function () {
            var phrase = this.collection.reduce(function (memo, word) { 
                return (memo ? memo + ' ' : memo) + word.get('word'); 
            }, '');
            $(this.el).val(phrase);
            return this;
        },
        
        highlight: function () {
            $(this.el).focus().select();
        }
    });
    
    var PhraseLengthOptionView = Backbone.View.extend({
        el: '#phrase-length',
        events: {
            'change': 'change',
            'keyUp': 'change',
            'input': 'change'
        },
        
        change: function () {
            settings.phrase_length = $(this.el).val();
            this.collection.addWords();
        }
    });
    
    var MinLengthOptionView = Backbone.View.extend({
        el: '#min-length',
        events: {
            'change': 'change',
            'keyUp': 'change',
            'input': 'change'
        },
        
        change: function () {
            settings.min_word_length = $(this.el).val();
            this.collection.addWords(true);
        }
    });
    
    var MaxLengthOptionView = Backbone.View.extend({
        el: '#max-length',
        events: {
            'change': 'change',
            'keyUp': 'change',
            'input': 'change'
        },
        
        change: function () {
            settings.max_word_length = $(this.el).val();
            this.collection.addWords(true);
        }
    });

    var PassphraseGeneratorView = Backbone.View.extend({
        /* Master view, organizes other views, handles Generate Passphrase button.
         */
        el: "#generate-passphrase",
        events: {
            "click"     : "generate"
        },
        
        initialize: function () {
            this.phrase_table_view = new PhraseTableView({
                collection: this.collection
            });
            this.phrase_input_view = new PhraseInputView({
                collection: this.collection
            });
            
            this.phrase_length = new PhraseLengthOptionView({
                collection: this.collection
            });
            
            this.max_length = new MaxLengthOptionView({
                collection: this.collection
            });
            this.min_length = new MinLengthOptionView({
                collection: this.collection
            });

            this.generate();
        },
        
        generate: function () {
            this.collection.addWords(true);
        }
    });


    /*
     *    Init
     */
    $('.passphrase td').remove();
    
    var passphrase = new Phrase();
    
    window.passphrase_generator = new PassphraseGeneratorView({
        collection: passphrase
    });
});