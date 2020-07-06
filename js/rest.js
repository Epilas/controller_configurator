function setState(item, state)	{
		var request = $.ajax
		({
			url        : "rest/items/"+item+"",
			timeout		:	3000, 
			type       	: 	"POST",
			data       	: 	state.toString(), 
			headers    	: 	{"Content-Type": "text/plain", "Accept": "application/json"},
			dataType	:	"text"
		});
		
		request.done( function(data) 
		{ 
			//sendNext(nr+1);
		});
		
		request.fail( function(jqXHR, textStatus ) 
		{ 
			return 0;
			console.log( "Failure: " + textStatus );
		});
}

function sendGroup(_q)	{  
		if(_q.length >= 1)	{
			$("#loadProgressBar").addClass("progress-bar-striped progress-bar-animated")
			var request = $.ajax
			({
				url        : "rest/items/"+_q[_q.length-1].a+"",
				timeout		:	3000, 
				type       	: 	"POST",
				data       	: 	_q[_q.length-1].v.toString(), 
				headers    	: 	{"Content-Type": "text/plain", "Accept": "application/json"},
				dataType	:	"text"
			});
			
			request.done( function(data) 
			{ 
				_q.pop();
				$('#loadProgress').text(_q.length);
				
				val = Math.round(100 - (_q.length / Number($("#maxAmount").text()) )*100);
				
				$("#loadProgressBar").css({"width": val+"%"});
				
				sendGroup(_q);
			});
			
			request.fail( function(jqXHR, textStatus ) 
			{ 
				$('#loadProgress').text("ERR");
				sendGroup(_q);
				console.log( "Failure: " + textStatus );
			});
		} else {
			$('#loadProgress').text("0");
			$("#loadProgressBar").css({"width": "100%"}).removeClass("progress-bar-animated progress-bar-striped");
			setTimeout(function(){
				$('#bottomPanel').animate({'bottom':'-55px'},500);
			},2500);
		}
}

function getState(item)	{
	var result = "";
	$.ajax({
		url: "rest/items/"+item+"/state",
		async: false,
		success: function(data) {
			result = data; 
		}
	});
	return result;
}