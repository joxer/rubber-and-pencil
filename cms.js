
// mettere tutte le funzioni dentro un array e richiamarle, cosi' posso avere dei plugin as i want. Magari mettere la lista dei plugin dentro un json che carichi.

function lolcms(){
     var _actions = []
     var _pages = []

    
    
    var options = {} 
    options.forIE = document.all;
    options.interwiki = {
        MeatBall: 'http://www.usemod.com/cgi-bin/mb.pl?',
        WikiCreole: 'http://www.wikicreole.org/wiki/',
        Palindrome: function(link) {
                    return 'http://www.example.com/wiki/' + link.split('').reverse().join('');
        }
    };
    options.linkFormat = '/wiki/';
    var _creole = new creole(options);
    hasher.prependHash = '!';
    this.bootstrap = function(){
	
	function handleChanges(newHash, oldHash){
	    

	    if(newHash == "")
		hasher.setHash("index");
	    else{
		if(newHash == "index")
		    setPage(0,3);
		else
		    getPage(newHash.replace("!",""));
	    }

	    
	    
	}

	hasher.changed.add(handleChanges); //add hash change listener
	hasher.initialized.add(handleChanges); //add initialized listener (to grab initial value in case it is already set)
	

	
	this.addAction(this.setTitle)
	this.addAction(this.setPages)
	this.addAction(this.setLinks)
	$.getJSON("config/config.json",function(data){
	    $(_actions).each(function(){
		this(data)
	    });
	    hasher.init(); //initialize hasher (start listening for history changes)
	});

	
	
    }
    
    this.addAction = function(action){
	_actions.push(action)
    }
    
    this.setTitle = function(data){

	document.title = data.title
	
    }

    this.setLinks = function(data){
	
	$.each(data.links,function(val,key){

	    $("#"+val).attr("href","#!"+key);
	    
//	    $("#"+val).bind("click",function(){getPage(key)})
	});
    }

    this.addScripts = function(data){
	$.each(data.scripts,function(val){
	    jQuery.getScript(val,function(){
		
		console.log("debug -- script loaded")
	    })
	});
    }
    
    this.addCss = function(data){
	$.each(data.scripts,function(val){
	     var css = jQuery("<link>");
	    css.attr({
		rel:  "stylesheet",
		type: "text/css",
		href: "val"
	    });
	    $("head").append(css);
	    console.log("debug -- css loaded")

	});
    }

    this.addScript = function(url,callback){
	if(callback != null)
	    jQuery.getScript(val,callback(data))
	else
	    jQuery.getScript(val)
    }

    this.setPages = function(data){
	flag = false
	$.each(data.pages,function(key,val){
	    
	    if(key == "index")
		flag = true;
	    _pages.push({title:key,text:val})
	});

	if(!flag){

	    console.log("debug: no index");
	}
    }

    function getPage  (key){

	$("#generated").html("");
	
	//$("#generated-title").html("");
	//$("#generated-text").html("");
	$("#generated").append("<div class='generated-title' id='generated-title'></div><div class='generated-text' id='generated-text'></div>")
	$("#generated-title").html("<a href='#!"+key+"' >"+key+"</a>");
//	$("#generated-text").html(find_page(key));
	_creole.parse(document.getElementById("generated-text"),find_page(key));
    }

    this.requestPage = function(key){

	getPage(key)
    }

    function setPage(limit_a,limit_b){
	
	$("#generated").html("");
	for(var i = limit_a;i < limit_b;i++){

	    $("#generated").append("<div class='generated-title' id='generated-title-"+i+"'></div><div class='generate-text' id='generated-text-"+i+"'></div>")

	    //	$("#genereated").append("<div id='generated-title'></div><div id='generated-text'></div>")
	    $("#generated-title-"+i).html("<a href='#"+_pages[i].title+"')'>"+_pages[i].title+"</a>");
	    //	$("#generated-text").html(find_page(key));
	    
	    _creole.parse(document.getElementById("generated-text-"+i),find_page(_pages[i].title));
	}
    }

    
    function find_page(key){
	
	for(i in _pages){
	    
	    if(_pages[i].title == key){
		return _pages[i].text
	    }
	}
	

    }

}